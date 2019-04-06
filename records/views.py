from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
import json

from .models import *
from . import discogs
from .services import createCollection

# Create your views here.
def index(request):
    listen_list = Listen.objects.all()
    return render(request, 'records/index.html', {'listen_list': listen_list})

def getCollection(request, data_level):
    discogsUserName = "gustav.andreasson"
    if request.COOKIES.get('discogs_username'):
        discogsUserName = request.COOKIES.get('discogs_username')

    user, created = DiscogsUser.objects.get_or_create(username=discogsUserName)
    if created:
        createCollection(user)

    return HttpResponse(json.dumps(user.to_dict(int(data_level))))

def setCollection(request, user_id):
    response = HttpResponse("{}")
    response.set_cookie('discogs_username', user_id)
    return response

def updateCollection(request):
    discogsUserName = "gustav.andreasson"
    if request.COOKIES.get('discogs_username'):
        discogsUserName = request.COOKIES.get('discogs_username')
    user, created = DiscogsUser.objects.get_or_create(username=discogsUserName)
    createCollection(user)
    return HttpResponse(json.dumps(user.to_dict(1)))

def setRecordListen(request, record_id, listen_name, listen_key):
    record = get_object_or_404(Record, id=record_id)
    listen = get_object_or_404(Listen, name=listen_name)
    RecordListens.objects.create(record=record, listen=listen, listen_key=listen_key)
    return HttpResponse(json.dumps(record.to_dict()))

#def setRecordYoutubeId(request, record_id, youtube_id):
#    record = get_object_or_404(Record, id=record_id)
#    record.youtubeId = youtube_id
#    record.save()
#    return HttpResponse(json.dumps(record.to_dict()))

def getArtist(request, artist_id):
    artist = get_object_or_404(Artist, id=artist_id)
    return HttpResponse(json.dumps(artist.to_dict()))

def updateArtist(request, artist_id):
    return HttpResponse("{}")
