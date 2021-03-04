from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.core.paginator import Paginator
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
    pagesize = request.GET.get('pagesize')
    page = request.GET.get('page')
    urs = UserRecords.objects.filter(user=user)
    records_paginator = Paginator(urs, pagesize)
    records_page = records_paginator.get_page(page)
    collection = {}
    progress.updateProgress('load', 0)
    tot = records_paginator.count
    nr = records_page.start_index()
    for ur in records_page.object_list:
        collection[ur.record.id] = ur.record.to_dict()
        collection[ur.record.id]["addedDate"] = str(ur.added_date)
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

def updateCollection(request, username):
    progress.init(request, ['discogs', 'create'])
    user, created = DiscogsUser.objects.get_or_create(username=username)
    services.updateCollection(user)
    progress.clearProcesses(['create', 'discogs'])
    return HttpResponse(json.dumps({'status': 'success'}))
