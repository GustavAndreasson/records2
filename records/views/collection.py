from django.shortcuts import get_object_or_404
from django.http import HttpResponse
import json

from ..models import DiscogsUser
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
    collection = user.get_collection()
    progress.clearProcesses(['discogs', 'create', 'load'])
    return HttpResponse(json.dumps(collection))

def updateCollection(request, username):
    progress.init(request, ['discogs', 'create', 'load'])
    user, created = DiscogsUser.objects.get_or_create(username=username)
    services.updateCollection(user)
    collection = user.get_collection()
    progress.clearProcesses(['load', 'create', 'discogs'])
    return HttpResponse(json.dumps(collection))
