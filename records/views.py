from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.core.cache import cache
import json

from .models import *
from . import services
from . import progress

def index(request):
    listen_list = Listen.objects.all()
    return render(request, 'records/index.html', {'listen_list': listen_list})

def getCollection(request, username, data_level):
    user, created = DiscogsUser.objects.get_or_create(username=username)
    if created:
        progress.init(request, ['discogs', 'create', 'load'])
        if not services.updateCollection(user):
            DiscogsUser.objects.filter(username=username).delete()
            return HttpResponse('{}')
    else :
        progress.init(request, ['load'])
    collection = user.to_dict(int(data_level))
    progress.clearProcesses(['discogs', 'create', 'load'])
    return HttpResponse(json.dumps(collection))

def updateCollection(request, username):
    progress.init(request, ['discogs', 'create', 'load'])
    user, created = DiscogsUser.objects.get_or_create(username=username)
    services.updateCollection(user)
    collection = user.to_dict(2)
    progress.clearProcesses(['load', 'create', 'discogs'])
    return HttpResponse(json.dumps(collection))

def getProgress(request):
    process.init(request)
    return HttpResponse(json.dumps(progress.getProgress()))

def getRecord(request, record_id):
    record = get_object_or_404(Record, id=record_id)
    return HttpResponse(json.dumps(record.to_dict()))

def updateRecord(request, record_id):
    record = get_object_or_404(Record, id=record_id)
    services.updateRecord(record)
    return HttpResponse(json.dumps(record.to_dict()))

def setRecordListen(request, record_id, listen_name, listen_key):
    record = get_object_or_404(Record, id=record_id)
    listen = get_object_or_404(Listen, name=listen_name)
    RecordListens.objects.create(record=record, listen=listen, listen_key=listen_key)
    return HttpResponse(json.dumps(record.to_dict()))

def getArtist(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    return HttpResponse(json.dumps(artist.to_dict()))

def updateArtist(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    services.updateArtist(artist)
    return HttpResponse(json.dumps(artist.to_dict()))
