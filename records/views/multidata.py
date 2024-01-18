from django.http import HttpResponse

from urllib.parse import unquote
import records.services.artist as artistService
import records.services.record as recordService
import json


def getMultipleData(request):
    artistListStr = unquote(request.GET.get("artists", ""))
    artistList = artistListStr.split(",") if len(artistListStr) > 0 else []
    artists = artistService.getArtists(artistList)
    # labels = unquote(request.GET.get("labels", ""))
    releaseListStr = unquote(request.GET.get("releases", ""))
    releaseList = releaseListStr.split(",") if len(releaseListStr) > 0 else []
    releases = recordService.getReleases(releaseList)
    masterListStr = unquote(request.GET.get("masters", ""))
    masterList = masterListStr.split(",") if len(masterListStr) > 0 else []
    masters = recordService.getMasters(masterList)
    return HttpResponse(
        json.dumps(
            {
                "artists": {id: artist.to_dict(False) for (id, artist) in artists.items()},
                "releases": {id: {"id": release.id, "name": release.name} for (id, release) in releases.items()},
                "masters": {id: {"id": master.id, "name": master.name} for (id, master) in masters.items()},
            }
        )
    )
