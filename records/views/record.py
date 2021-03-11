from django.shortcuts import get_object_or_404
from django.http import HttpResponse
import json

from ..models import Record
from .. import services

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
