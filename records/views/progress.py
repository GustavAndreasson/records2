from django.http import HttpResponse
import json

from .. import progress


def getProgress(request):
    progress.init(request)
    return HttpResponse(json.dumps(progress.getProgress()))
