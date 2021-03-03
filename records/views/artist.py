from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from urllib.parse import unquote
import json

from ..models import Artist, RecordArtists
from .. import services
from .. import progress

def getArtist(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    return HttpResponse(json.dumps(artist.to_dict()))

def updateArtist(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    services.updateArtist(artist)
    return HttpResponse(json.dumps(artist.to_dict()))

def getArtistReleases(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    if artist.collectionUpdated == None:
        progress.init(request, ['discogs', 'create', 'load'])
        services.collectArtistReleases(artist)
    else:
        progress.init(request, ['load'])
    artist_releases = _createReleasesDict(artist)
    progress.clearProcesses(['load', 'create', 'discogs'])
    return HttpResponse(json.dumps(artist_releases))

def updateArtistReleases(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    progress.init(request, ['discogs', 'create', 'load'])
    services.collectArtistReleases(artist)
    artist_releases = _createReleasesDict(artist)
    progress.clearProcesses(['load', 'create', 'discogs'])
    return HttpResponse(json.dumps(artist_releases))

def getArtistAutocomplete(request):
    artist_start = unquote(request.GET.get('q', ''))
    list_length = int(unquote(request.GET.get('l', '5')))
    if len(artist_start) < 2:
        return HttpResponse('[]')
    artists = Artist.objects.filter(name__istartswith=artist_start).order_by('name')
    return HttpResponse(json.dumps([artist.to_dict(False) for artist in artists[:list_length]]))

def _createReleasesDict(artist):
    ras = RecordArtists.objects.filter(artist=artist)
    releases = {}
    progress.updateProgress('load', 0)
    tot = len(ras)
    nr = 0
    for ra in ras:
        releases[ra.record.id] = ra.record.to_dict()
        nr = nr + 1
        if nr % 10 == 0:
            progress.updateProgress('load', int((nr * 100) / tot))
    progress.updateProgress('load', 100)
    return releases
