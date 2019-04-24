import requests, json, time
from decouple import config
from .models import DiscogsAccess

def getCollection(user_name):
    uri = "users/" + user_name + "/collection/folders/0/releases"
    page = 1
    collection = []
    while True:
        response = readUri(uri + "?page=" + str(page))
        page = page + 1
        if 'releases' in response:
            collection.extend(response['releases'])
        else:
            break
    return collection

def getRelease(release_id):
    return readUri("/releases/" + str(release_id) + "?curr_abr=SEK")

def getMaster(master_id):
    return readUri("/masters/" + str(master_id) + "?curr_abr=SEK")

def getArtist(artist_id):
	return readUri("/artists/" + str(artist_id))

def getArtistReleases(artist_id):
    uri = "/artists/" + str(artist_id) + "/releases"
    page = 1
    collection = []
    while True:
        response = readUri(uri + "?page=" + str(page))
        page = page + 1
        if 'releases' in response:
            collection.extend(response['releases'])
        else:
            break
    return collection

def readUri(uri):
    accesses = DiscogsAccess.objects.filter(timestamp__gt=time.time() - 60)
    if len(accesses) > 58:
        time.sleep(max(60 - (time.time() - accesses[0].timestamp), 0))
    DiscogsAccess.objects.create(timestamp=time.time())
    headers = {"User-Agent": config('DISCOGS_AGENT')}
    first = "&" if "?" in uri else "?"
    auth = first + "key=" + config('DISCOGS_KEY') + "&secret=" + config('DISCOGS_SECRET')
    r = requests.get(config('DISCOGS_BASE_URL') + uri + auth, headers=headers)
    if r.status_code != 200:
        time.sleep(10)
        r = requests.get(config('DISCOGS_BASE_URL') + uri + auth, headers=headers)
    return json.loads(r.text)
