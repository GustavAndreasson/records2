from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.core.paginator import Paginator
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
    pagesize = request.GET.get('pagesize')
    page = request.GET.get('page')
    ras = RecordArtists.objects.filter(artist=artist)
    records_paginator = Paginator(ras, pagesize)
    records_page = records_paginator.get_page(page)
    collection = {}
    progress.updateProgress('load', 0)
    tot = records_paginator.count
    nr = records_page.start_index()
    for ur in records_page.object_list:
        collection[ur.record.id] = ur.record.to_dict()
        nr = nr + 1
        if nr % 10 == 0:
            progress.updateProgress('load', int((nr * 100) / tot))
    progress.updateProgress('load', 100)
    progress.clearProcesses(['discogs', 'create', 'load'])
    return HttpResponse(json.dumps({
        'data': collection,
        'pagination': {
            'page': page,
            'pagesize': pagesize,
            'pagecount': records_paginator.num_pages,
            'nextpage': records_page.next_page_number() if records_page.has_next() else None,
            'previouspage': records_page.previous_page_number() if records_page.has_previous() else None
        }
    }))

def updateArtistReleases(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    progress.init(request, ['discogs', 'create'])
    services.collectArtistReleases(artist)
    progress.clearProcesses(['create', 'discogs'])
    return HttpResponse(json.dumps({'status': 'success'}))

def getArtistAutocomplete(request):
    artist_start = unquote(request.GET.get('q', ''))
    list_length = int(unquote(request.GET.get('l', '5')))
    if len(artist_start) < 2:
        return HttpResponse('[]')
    artists = Artist.objects.filter(name__istartswith=artist_start).order_by('name')
    return HttpResponse(json.dumps([artist.to_dict(False) for artist in artists[:list_length]]))
