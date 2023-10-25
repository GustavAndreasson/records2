import requests
import time
import logging
from decouple import config
from django.core.cache import cache
from json.decoder import JSONDecodeError
from .models import DiscogsAccess
from . import progress

logger = logging.getLogger(__name__)
ACCESS_QUEUE_CACHE_KEY = "DISCOGS_ACCESS_QUEUE_CACHE_KEY"
max_discogs_accesses = 60
time_discogs_accesses = 60


class DiscogsError(Exception):
    def __init__(self, code, message):
        self.code = code
        self.message = message

    def __str__(self):
        return str(self.code) + ":" + self.message


def getCollection(user_name):
    return __getPaginatedCollection("users/" + user_name + "/collection/folders/0/releases")


def getRelease(release_id):
    return __readUri("/releases/" + str(release_id))


def getMaster(master_id):
    return __readUri("/masters/" + str(master_id))


def getArtist(artist_id):
    return __readUri("/artists/" + str(artist_id))


def getArtistReleases(artist_id, check_main=True):
    return __getPaginatedCollection("/artists/" + str(artist_id) + "/releases", check_main)


def __getPaginatedCollection(uri, check_main=False):
    page = 0
    page_size = 25
    pages = 100
    collection = []
    progress.updateProgress("discogs", 0)
    try:
        while True:
            progress.updateProgress("discogs", int((page * 100) / pages))
            page = page + 1
            response = __readUri(uri + "?per_page=" + str(page_size) + "&page=" + str(page))
            try:
                if response["pagination"]["items"] == 0:
                    break
                collection.extend(response["releases"])
                pages = response["pagination"]["pages"]
                if page >= pages:
                    break
                if check_main and response["releases"][-1].get("role") != "Main":
                    break
            except KeyError:
                raise DiscogsError(
                    "KeyError",
                    "Collection page not correct. "
                    + uri
                    + "?per_page="
                    + str(page_size)
                    + "&page="
                    + str(page)
                    + "\n"
                    + str(response),
                )
    except DiscogsError as de:
        logger.error("Not expected collection response from Discogs:\n" + str(de))
        if page != pages:
            raise
    progress.updateProgress("discogs", 100)
    return collection


def __readUri(uri):
    global max_discogs_accesses
    accesses = DiscogsAccess.objects.filter(timestamp__gt=int(time.time()) - time_discogs_accesses - 1)
    if len(accesses) >= max_discogs_accesses - 1:
        queue = cache.get(ACCESS_QUEUE_CACHE_KEY, 0)
        if queue > len(accesses):
            wait = time_discogs_accesses + queue - len(accesses) + 1
            logger.warning("Access queue length: " + queue)
        else:
            wait = max(time_discogs_accesses + 1 - (int(time.time()) - accesses[queue].timestamp), 0)
        cache.set(ACCESS_QUEUE_CACHE_KEY, queue + 1)
        logger.debug(
            "Limit reached on discogs accesses with "
            + str(len(accesses))
            + " in last "
            + str(time_discogs_accesses)
            + " seconds. "
            + str(queue)
            + " calls in queue. Waiting "
            + str(wait)
            + " seconds"
        )
        time.sleep(wait)
        queue = cache.get(ACCESS_QUEUE_CACHE_KEY, 1)
        cache.set(ACCESS_QUEUE_CACHE_KEY, queue - 1)
    DiscogsAccess.objects.create(timestamp=time.time())
    headers = {"User-Agent": config("DISCOGS_AGENT")}
    params = {"key": config("DISCOGS_KEY"), "secret": config("DISCOGS_SECRET")}
    url = config("DISCOGS_BASE_URL") + uri
    try:
        r = requests.get(url, params=params, headers=headers)
        data = r.json()
        max_discogs_accesses = int(r.headers.get("X-Discogs-Ratelimit", max_discogs_accesses))
        if (max_discogs_accesses - len(accesses)) > int(r.headers.get("X-Discogs-Ratelimit-Remaining")):
            logger.debug(
                "Rate limit remaining: "
                + r.headers.get("X-Discogs-Ratelimit-Remaining")
                + ", expected: "
                + str(max_discogs_accesses - len(accesses))
                + ". Adding dummy request to queue."
            )
            DiscogsAccess.objects.create(timestamp=time.time())
    except requests.exceptions.RequestException as re:
        raise DiscogsError(re.response.status_code if re.response is not None else -1, str(re))
    except JSONDecodeError as je:
        raise DiscogsError(r.status_code, str(je))
    if r.status_code == 429 or data.get("message") == "You are making requests too quickly.":
        logger.error(
            "Too many requests to Discogs "
            + data.get("message")
            + " trying again after "
            + str(time_discogs_accesses)
            + " seconds"
        )
        time.sleep(time_discogs_accesses)
        return __readUri(uri)
    elif r.status_code != 200:
        message = "Error calling " + url
        if data.get("error"):
            message = data["error"].get("message")
        raise DiscogsError(r.status_code, message)
    return data
