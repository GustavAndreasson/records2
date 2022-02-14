import requests
import time
import logging
from decouple import config
from json.decoder import JSONDecodeError
from .models import DiscogsAccess
from . import progress

logger = logging.getLogger(__name__)
max_discogs_accesses = 60
time_discogs_accesses = 60


class DiscogsError(Exception):
    def __init__(self, code, message):
        self.code = code
        self.message = message

    def __str__(self):
        return str(self.code) + ":" + self.message


def getCollection(user_name):
    return __getPaginatedCollection("users/" + user_name
                                    + "/collection/folders/0/releases")


def getRelease(release_id):
    return __readUri("/releases/" + str(release_id))


def getMaster(master_id):
    return __readUri("/masters/" + str(master_id))


def getArtist(artist_id):
    return __readUri("/artists/" + str(artist_id))


def getArtistReleases(artist_id, check_main=True):
    return __getPaginatedCollection("/artists/" + str(artist_id)
                                    + "/releases", check_main)


def __getPaginatedCollection(uri, check_main=False):
    page = 1
    collection = []
    progress.updateProgress('discogs', 0)
    try:
        response = __readUri(uri + "?per_page=25&page=" + str(page))
        collection.extend(response['releases'])
        while response['pagination']['pages'] > page:
            progress.updateProgress('discogs', int(
                (page * 100) / response['pagination']['pages']))
            page = page + 1
            response = __readUri(uri + "?per_page=25&page=" + str(page))
            collection.extend(response['releases'])
            if check_main and response['releases'][-1].get('role') != "Main":
                break
    except DiscogsError as de:
        logger.error(
            "Not expected collection response from Discogs:\n" + str(de))
        if not collection:
            raise
    progress.updateProgress('discogs', 100)
    return collection


def __readUri(uri):
    accesses = DiscogsAccess.objects.filter(
        timestamp__gt=int(time.time()) - time_discogs_accesses - 1)
    if len(accesses) >= max_discogs_accesses - 1:
        wait = max(time_discogs_accesses + 1
                   - (int(time.time()) - accesses[0].timestamp), 0)
        logger.debug("Limit reached on discogs accesses with "
                     + str(len(accesses)) + " in last "
                     + str(time_discogs_accesses) + " seconds. Waiting "
                     + str(wait) + " seconds")
        time.sleep(wait)
    DiscogsAccess.objects.create(timestamp=time.time())
    headers = {"User-Agent": config('DISCOGS_AGENT')}
    params = {"key": config('DISCOGS_KEY'), "secret": config('DISCOGS_SECRET')}
    url = config('DISCOGS_BASE_URL') + uri
    try:
        r = requests.get(url, params=params, headers=headers)
        data = r.json()
    except requests.exceptions.RequestException as re:
        raise DiscogsError(re.response.status_code, str(re))
    except JSONDecodeError as je:
        raise DiscogsError(r.status_code, str(je))
    if r.status_code == 429:
        logger.error("Too many requests to Discogs\n" + data.get('message')
                     + "\ntrying again after " + str(time_discogs_accesses)
                     + " seconds")
        time.sleep(time_discogs_accesses)
        r = requests.get(url, params=params, headers=headers)
    elif r.status_code != 200:
        message = "Error calling " + url
        if data.get('error'):
            message = data['error'].get('message')
        raise DiscogsError(r.status_code, message)
    return data
