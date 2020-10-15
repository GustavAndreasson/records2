from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from urllib.parse import unquote
import json

from ..models import Artist
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
    artist_releases = artist.get_releases()
    progress.clearProcesses(['load', 'create', 'discogs'])
    return HttpResponse(json.dumps(artist_releases))

def updateArtistReleases(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    progress.init(request, ['discogs', 'create', 'load'])
    services.collectArtistReleases(artist)
    artist_releases = artist.get_releases()
    progress.clearProcesses(['load', 'create', 'discogs'])
    return HttpResponse(json.dumps(artist_releases))

def getArtistAutocomplete(request):
    artist_start = unquote(request.GET.get('q', ''))
    if len(artist_start) < 2:
        return HttpResponse('[]')
    artists = Artist.objects.filter(name__istartswith=artist_start).order_by('name')
    return HttpResponse(json.dumps([artist.to_dict() for artist in artists[:5]]))
