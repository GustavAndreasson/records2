from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
import json

from .models import *
from . import discogs
from .services import createCollection

def index(request):
    listen_list = Listen.objects.all()
    return render(request, 'records/index.html', {'listen_list': listen_list})

def getCollection(request, username, data_level):
    user, created = DiscogsUser.objects.get_or_create(username=username)
    if created:
        if not createCollection(user):
            DiscogsUser.objects.filter(username=username).delete()
            return HttpResponse('{}')
    return HttpResponse(json.dumps(user.to_dict(int(data_level))))

def updateCollection(request, username):
    user, created = DiscogsUser.objects.get_or_create(username=username)
    createCollection(user)
    return HttpResponse(json.dumps(user.to_dict(1)))

def setRecordListen(request, record_id, listen_name, listen_key):
    record = get_object_or_404(Record, id=record_id)
    listen = get_object_or_404(Listen, name=listen_name)
    RecordListens.objects.create(record=record, listen=listen, listen_key=listen_key)
    return HttpResponse(json.dumps(record.to_dict()))

def getArtist(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    return HttpResponse(json.dumps(artist.to_dict()))

def updateArtist(request, artist_id):
    return HttpResponse("{}")
