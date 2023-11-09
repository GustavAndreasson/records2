from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.core.paginator import Paginator
import json

from ..models import DiscogsUser, UserRecords
import records.services.collection as collectionService
from .. import progress


def getCollection(request, username):
    user, created = DiscogsUser.objects.get_or_create(username=username)
    if created:
        progress.init(request, ["discogs", "create"])
        if not collectionService.updateCollection(user):
            DiscogsUser.objects.filter(username=username).delete()
            return HttpResponse("{}")
        progress.clearProcesses(["discogs", "create"])
    pagesize = int(request.GET.get("pagesize", 100))
    page = int(request.GET.get("page", 1))
    urs = UserRecords.objects.filter(user=user)
    records_paginator = Paginator(urs, pagesize)
    records_page = records_paginator.get_page(page)
    collection = {}
    for ur in records_page.object_list:
        collection[ur.record.id] = ur.record.to_dict()
        collection[ur.record.id]["addedDate"] = str(ur.added_date)
    return HttpResponse(
        json.dumps(
            {
                "data": collection,
                "pagination": {
                    "page": page,
                    "pagesize": pagesize,
                    "pagecount": records_paginator.num_pages,
                    "nextpage": records_page.next_page_number() if records_page.has_next() else None,
                    "previouspage": records_page.previous_page_number() if records_page.has_previous() else None,
                },
            }
        )
    )


def updateCollection(request, username):
    progress.init(request, ["discogs", "create"])
    user = get_object_or_404(DiscogsUser, username=username)
    collectionService.updateCollection(user)
    progress.clearProcesses(["create", "discogs"])
    return HttpResponse(json.dumps({"status": "success"}))
