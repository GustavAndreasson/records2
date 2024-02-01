import requests
from json.decoder import JSONDecodeError
from decouple import config
from django.core.cache import cache
import time

RATES_CACHE_KEY = "rates_cache_key"


def getRate(currency: str) -> int | None:
    rates = cache.get(RATES_CACHE_KEY)
    yesterday = time.time() - 86400
    if not rates or rates.get("query").get("timestamp") < yesterday:
        url = str(config("RATES_API_URL") + config("RATES_API_KEY"))
        try:
            r = requests.get(url)
            if r.status_code == 200:
                data = r.json()
                rates = data
                cache.set(RATES_CACHE_KEY, rates)
            elif not rates:
                return None
        except (requests.exceptions.RequestException, JSONDecodeError):
            if not rates:
                return None
    if currency == rates.get("query").get("base_currency"):
        return 1
    rate = rates.get("data").get(currency)
    if not rate:
        return None
    return rate
