from django.http import HttpResponse, Http404
import json
import re
import records.services.rates as ratesService


def getRate(request, currency):
    cur = re.sub(r"[\W_]+", "", currency)
    if not (cur.isupper() and len(cur) == 3):
        raise Http404
    rate = ratesService.getRate(cur)
    if not rate:
        raise Http404
    return HttpResponse(json.dumps({"currency": cur, "rate": rate}))
