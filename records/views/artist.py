from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.core.paginator import Paginator
from urllib.parse import unquote
import json

from ..models import Artist, RecordArtists
import records.services.artist as artistService
from .. import progress


def getArtist(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    return HttpResponse(json.dumps(artist.to_dict()))


def updateArtist(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    artistService.updateArtist(artist)
    return HttpResponse(json.dumps(artist.to_dict()))


def getArtistReleases(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    if artist.collectionUpdated == None:
        progress.init(request, ['discogs', 'create'])
        artistService.collectArtistReleases(artist)
        progress.clearProcesses(['discogs', 'create'])
    pagesize = int(request.GET.get('pagesize', 100))
    page = int(request.GET.get('page', 1))
    ras = RecordArtists.objects.filter(artist=artist).order_by('record__id')
    records_paginator = Paginator(ras, pagesize)
    records_page = records_paginator.get_page(page)
    collection = {}
    for ur in records_page.object_list:
        collection[ur.record.id] = ur.record.to_dict()
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
    artistService.collectArtistReleases(artist)
    progress.clearProcesses(['create', 'discogs'])
    return HttpResponse(json.dumps({'status': 'success'}))


def getArtistAutocomplete(request):
    artist_start = unquote(request.GET.get('q', ''))
    list_length = int(unquote(request.GET.get('l', '5')))
    if len(artist_start) < 2:
        return HttpResponse('[]')
    artists = Artist.objects.filter(
        name__istartswith=artist_start).order_by('name')
    return HttpResponse(json.dumps([artist.to_dict(False) for artist in artists[:list_length]]))
