from django.shortcuts import get_object_or_404
from django.http import HttpResponse
import json

from ..models import DiscogsUser, UserRecords
from .. import services
from .. import progress

def getCollection(request, username):
    user, created = DiscogsUser.objects.get_or_create(username=username)
    if created:
        progress.init(request, ['discogs', 'create', 'load'])
        if not services.updateCollection(user):
            DiscogsUser.objects.filter(username=username).delete()
            progress.clearProcesses(['discogs', 'create', 'load'])
            return HttpResponse('{}')
    else :
        progress.init(request, ['load'])
    collection = _createCollectionDict(user)
    progress.clearProcesses(['discogs', 'create', 'load'])
    return HttpResponse(json.dumps(collection))

def updateCollection(request, username):
    progress.init(request, ['discogs', 'create', 'load'])
    user, created = DiscogsUser.objects.get_or_create(username=username)
    services.updateCollection(user)
    collection = _createCollectionDict(user)
    progress.clearProcesses(['load', 'create', 'discogs'])
    return HttpResponse(json.dumps(collection))

def _createCollectionDict(user):
    urs = UserRecords.objects.filter(user=user)
    dict = {}
    progress.updateProgress('load', 0)
    tot = len(urs)
    nr = 0
    for ur in urs:
        dict[ur.record.id] = ur.record.to_dict()
        dict[ur.record.id]["addedDate"] = str(ur.added_date)
        nr = nr + 1
        if nr % 10 == 0:
            progress.updateProgress('load', int((nr * 100) / tot))
    progress.updateProgress('load', 100)
    return dict
