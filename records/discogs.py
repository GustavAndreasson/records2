import requests, json, time, logging
from decouple import config
from .models import DiscogsAccess

logger = logging.getLogger(__name__)

def getCollection(user_name):
    return __getPaginatedCollection("users/" + user_name + "/collection/folders/0/releases")

def getRelease(release_id):
    return __readUri("/releases/" + str(release_id) + "?curr_abr=SEK")

def getMaster(master_id):
    return __readUri("/masters/" + str(master_id) + "?curr_abr=SEK")

def getArtist(artist_id):
    return __readUri("/artists/" + str(artist_id))

def getArtistReleases(artist_id):
    return __getPaginatedCollection("/artists/" + str(artist_id) + "/releases")
    
def __getPaginatedCollection(uri):
    page = 1
    collection = []
    try:
        response = __readUri(uri + "?page=" + str(page))
        collection.extend(response['releases'])
        while response['pagination']['pages'] > page:
            page = page + 1
            response = __readUri(uri + "?page=" + str(page))
            collection.extend(response['releases'])
    except KeyError: 
        logger.error("Not expected collection response from Discogs:\n" + json.dumps(response))
    return collection

def __readUri(uri):
    accesses = DiscogsAccess.objects.filter(timestamp__gt=time.time() - 60)
    if len(accesses) > 58:
        wait = max(60 - (time.time() - accesses[0].timestamp), 0)
        logger.debug("Limit reached on discogs accesses. Waiting " + wait + " seconds")
        time.sleep(wait)
    DiscogsAccess.objects.create(timestamp=time.time())
    headers = {"User-Agent": config('DISCOGS_AGENT')}
    first = "&" if "?" in uri else "?"
    auth = first + "key=" + config('DISCOGS_KEY') + "&secret=" + config('DISCOGS_SECRET')
    url = config('DISCOGS_BASE_URL') + uri + auth
    r = requests.get(url, headers=headers)
    data = json.loads(r.text)
    if r.status_code == 429:
        logger.error("Too many requests to Discogs\n" + data.get('message') + "\ntrying again after 60 seconds")
        time.sleep(60)
        r = requests.get(url, headers=headers)
    elif r.status_code != 200:
        logger.error("Request to Discogs (" + url + ") failed with status " + r.status_code + "\n" + data.get('message'))
    return data
