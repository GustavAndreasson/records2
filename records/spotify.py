import requests, base64, time, logging
from decouple import config

logger = logging.getLogger(__name__)
token, token_expire = ("", 0)

class SpotifyError(Exception):
    def __init__(self, code, message):
        self.code = code
        self.message = message

    def __str__(self):
        return str(self.code) + ":" + self.message

def getAlbum(artist, album):
    auth = "Bearer " + __getToken()
    headers = {"Authorization": auth}
    query = "album:" + album + "%20artist:" + artist + "&type=album"
    r = requests.get(config('SPOTIFY_API_URL') + "search?q=" + query, headers=headers)
    try:
        data = r.json()
    except JSONDecodeError:
        data = {}
    if r.status_code == 200:
        if data['albums']['total'] > 0:
            return data['albums']['items'][0]
    elif r.status_code >= 400:
        raise SpotifyError(r.status_code, data['error'].message)
    return None

def getAlbumId(artist, album):
    album_data = getAlbum(artist, album)
    if album_data:
        return album_data['id']
    return None

def __getToken():
    global token, token_expire
    if time.time() > token_expire:
        token, token_expire = __renewToken()
        logger.debug("Renewed Spotify token, expires " + time.asctime(time.localtime(token_expire)))
    return token

def __renewToken():
    auth = base64.b64encode(bytes(config('SPOTIFY_ID') + ":" + config('SPOTIFY_SECRET'),"utf-8"))
    headers = {
        "Authorization": "Basic " + auth.decode(),
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    r = requests.post(config('SPOTIFY_ACCOUNT_URL') + "token", data=data, headers=headers)
    return (r.json()['access_token'], r.json()['expires_in'] + time.time())
