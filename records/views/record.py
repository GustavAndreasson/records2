from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
import json

from ..models import Record, Listen, RecordListens
import records.services.record as recordService


def getRecord(request, record_id):
    record = get_object_or_404(Record, id=record_id)
    return HttpResponse(json.dumps(record.to_dict()))


def updateRecord(request, record_id):
    record = get_object_or_404(Record, id=record_id)
    if not recordService.updateRecord(record):
        raise Http404
    return HttpResponse(json.dumps(record.to_dict()))


def setRecordListen(request, record_id, listen_name, listen_key):
    record = get_object_or_404(Record, id=record_id)
    listen = get_object_or_404(Listen, name=listen_name)
    RecordListens.objects.create(record=record, listen=listen, listen_key=listen_key)
    return HttpResponse(json.dumps(record.to_dict()))
