from django.http import HttpResponse, Http404
import json
import records.services.rates as ratesService


def getRate(request, currency):
    if not (currency.isupper() and len(currency) == 3):
        return Http404
    rate = ratesService.getRate(currency)
    if not rate:
        return Http404
    else:
        return HttpResponse(json.dumps({"currency": currency, "rate": rate}))
