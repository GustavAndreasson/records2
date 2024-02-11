from django.http import HttpResponse

from urllib.parse import unquote
import records.services.artist as artistService
import records.services.record as recordService
import json


def getMultipleData(request):
    artist_list_str = unquote(request.GET.get("artists", ""))
    artist_list = artist_list_str.split(",") if len(artist_list_str) > 0 else []
    artists = artistService.getArtists(artist_list)
    # labels = unquote(request.GET.get("labels", ""))
    release_list_str = unquote(request.GET.get("releases", ""))
    release_list = release_list_str.split(",") if len(release_list_str) > 0 else []
    releases = recordService.getReleases(release_list)
    master_list_str = unquote(request.GET.get("masters", ""))
    master_list = master_list_str.split(",") if len(master_list_str) > 0 else []
    masters = recordService.getMasters(master_list)
    return HttpResponse(
        json.dumps(
            {
                "artists": {id: artist.to_dict(False) for (id, artist) in artists.items()},
                "releases": {id: {"id": release.id, "name": release.name} for (id, release) in releases.items()},
                "masters": {id: {"id": master.id, "name": master.name} for (id, master) in masters.items()},
            }
        )
    )
