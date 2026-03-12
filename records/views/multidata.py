from django.http import HttpResponse

from urllib.parse import unquote
from records.services.discogs_data import (getReleases, getMasters, getArtists, getLabels)
import json


def getMultipleData(request):
    artist_list_str = unquote(request.GET.get("artists", ""))
    artist_list = artist_list_str.split(",") if len(artist_list_str) > 0 else []
    artists = getArtists(artist_list)
    label_list_str = unquote(request.GET.get("labels", ""))
    label_list = label_list_str.split(",") if len(label_list_str) > 0 else []
    labels = getLabels(label_list)
    release_list_str = unquote(request.GET.get("releases", ""))
    release_list = release_list_str.split(",") if len(release_list_str) > 0 else []
    releases = getReleases(release_list)
    master_list_str = unquote(request.GET.get("masters", ""))
    master_list = master_list_str.split(",") if len(master_list_str) > 0 else []
    masters = getMasters(master_list)
    return HttpResponse(
        json.dumps(
            {
                "artists": {id: {"id": artist.id, "name": artist.name} for (id, artist) in artists.items()},
                "releases": {id: {"id": release.id, "name": release.title} for (id, release) in releases.items()},
                "masters": {id: {"id": master.id, "name": master.title} for (id, master) in masters.items()},
                "labels": {id: {"id": label.id, "name": label.name} for (id, label) in labels.items()},
            }
        )
    )
