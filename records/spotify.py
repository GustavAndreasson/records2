import requests
import base64
import time
import logging
import json
from json.decoder import JSONDecodeError
from urllib.parse import quote
from django.core.cache import cache
from decouple import config

logger = logging.getLogger(__name__)
TOKEN_KEY = "spotify_token_cache_key"


class SpotifyError(Exception):
    def __init__(self, code, message):
        self.code = code
        try:
            data = json.loads(message)
            error = data.get("error")
            message = (error and error.get("message")) or message
        except JSONDecodeError:
            pass
        self.message = message

    def __str__(self):
        return str(self.code) + ":" + self.message


def getAlbum(artist: str, album: str) -> dict | None:
    auth = "Bearer " + __getToken()
    headers = {"Authorization": auth}
    query = "album:" + quote(album) + "%20artist:" + quote(artist) + "&type=album"
    try:
        r = requests.get(str(config("SPOTIFY_API_URL")) + "search?q=" + query, headers=headers)
        if r.status_code != 200:
            raise SpotifyError(r.status_code, r.text)
        data = r.json()
    except requests.exceptions.RequestException as re:
        raise SpotifyError(re.response.status_code if re.response is not None else -1, str(re))
    except JSONDecodeError as je:
        raise SpotifyError(-1, je.msg)
    albums = data.get("albums")
    if not albums or albums.get("total") <= 0:
        return None
    return albums["items"][0]


def getAlbumId(artist: str, album: str) -> str | None:
    album_data = getAlbum(artist, album)
    if not album_data:
        return None
    return album_data["id"]


def __getToken() -> str:
    token_info = cache.get(TOKEN_KEY)
    if not token_info or time.time() > token_info[1]:
        token_info = __renewToken()
        logger.debug("Renewed Spotify token, expires " + time.asctime(time.localtime(token_info[1])))
    return token_info[0]


def __renewToken() -> tuple[str, float]:
    auth = base64.b64encode(bytes(str(config("SPOTIFY_ID")) + ":" + str(config("SPOTIFY_SECRET")), "utf-8"))
    headers = {"Authorization": "Basic " + auth.decode(), "Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}
    try:
        r = requests.post(str(config("SPOTIFY_ACCOUNT_URL")) + "token", data=data, headers=headers)
        if r.status_code != 200:
            raise SpotifyError(r.status_code, r.text)
        data = r.json()
    except requests.exceptions.RequestException as re:
        raise SpotifyError(re.response.status_code if re.response is not None else -1, str(re))
    except JSONDecodeError as je:
        raise SpotifyError(-1, je.msg)
    token_info = (data.get("access_token"), data.get("expires_in") + time.time())
    cache.set(TOKEN_KEY, token_info)
    return token_info
