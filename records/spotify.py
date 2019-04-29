import requests, json, base64
from decouple import config

def getAlbum(artist, album):
    headers = {"Authorization": "Bearer " + __getToken()}
    query = "name:deaf&type=album"
    r = requests.get(config('SPOTIFY_API_URL') + "search?q=" + query, headers=headers)
    if r.status_code != 200:
        time.sleep(10)
        r = requests.get(config('SPOTIFY_API_URL') + "search?q=" + query, headers=headers)
    return json.loads(r.text)

def __getToken():
    auth = base64.b64encode(bytes(config('SPOTIFY_ID') + ":" + config('SPOTIFY_SECRET'),"utf-8"))
    r = requests.post(config('SPOTIFY_API_URL') + "token")
    return ""
