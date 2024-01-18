import requests
import base64
import time
import logging
from json.decoder import JSONDecodeError
from urllib.parse import quote
from django.core.cache import cache
from decouple import config

logger = logging.getLogger(__name__)
TOKEN_KEY = "spotify_token_cache_key"


class SpotifyError(Exception):
    def __init__(self, code, message):
        self.code = code
        self.message = message

    def __str__(self):
        return str(self.code) + ":" + self.message


def getAlbum(artist, album):
    auth = "Bearer " + __getToken()
    headers = {"Authorization": auth}
    query = "album:" + quote(album) + "%20artist:" + quote(artist) + "&type=album"
    r = requests.get(str(config("SPOTIFY_API_URL")) + "search?q=" + query, headers=headers)
    try:
        data = r.json()
    except JSONDecodeError:
        data = {}
    if r.status_code == 200:
        if data["albums"]["total"] > 0:
            return data["albums"]["items"][0]
    elif r.status_code >= 400:
        raise SpotifyError(r.status_code, data["error"].get("message"))
    return None


def getAlbumId(artist, album):
    album_data = getAlbum(artist, album)
    if album_data:
        return album_data["id"]
    return None


def __getToken():
    token_info = cache.get(TOKEN_KEY)
    if not token_info or time.time() > token_info[1]:
        token_info = __renewToken()
        logger.debug("Renewed Spotify token, expires " + time.asctime(time.localtime(token_info[1])))
    return token_info[0]


def __renewToken():
    auth = base64.b64encode(bytes(str(config("SPOTIFY_ID")) + ":" + str(config("SPOTIFY_SECRET")), "utf-8"))
    headers = {"Authorization": "Basic " + auth.decode(), "Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}
    r = requests.post(str(config("SPOTIFY_ACCOUNT_URL")) + "token", data=data, headers=headers)
    token_info = (r.json()["access_token"], r.json()["expires_in"] + time.time())
    cache.set(TOKEN_KEY, token_info)
    return token_info
