import requests, json, base64, time, logging
from decouple import config

logger = logging.getLogger(__name__)
token = ("", 0)

def getAlbum(artist, album):
    auth = "Bearer " + __getToken()
    headers = {"Authorization": auth}
    query = "album:" + album + "%20artist:" + artist + "&type=album"
    r = requests.get(config('SPOTIFY_API_URL') + "search?q=" + query, headers=headers)
    if r.status_code == 200:
        albums_data = json.loads(r.text)
        if albums_data['albums']['total'] > 0:
            return albums_data['albums']['items'][0]
    elif r.status_code >= 400:
        e = json.loads(r.text)
        logger.error("Request to spotify failed:\n" + str(e.get('error')) + "\n" + str(e.get('error_description')))
    return None

def getAlbumId(artist, album):
    album_data = getAlbum(artist, album)
    if album_data:
        return album_data['id']
    return None

def __getToken():
    global token
    if time.time() > token[1]:
        token = __renewToken()
        logger.debug("Renewed Spotify token, expires " + time.asctime(time.localtime(token[1])))
    return token[0]

def __renewToken():
    auth = base64.b64encode(bytes(config('SPOTIFY_ID') + ":" + config('SPOTIFY_SECRET'),"utf-8"))
    headers = {
        "Authorization": "Basic " + auth.decode(),
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    r = requests.post(config('SPOTIFY_ACCOUNT_URL') + "token", data=data, headers=headers)
    return (json.loads(r.text)['access_token'], json.loads(r.text)['expires_in'] + time.time())
