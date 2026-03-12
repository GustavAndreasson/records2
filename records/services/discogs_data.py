from django.db import models
from ..discogs_models import (DiscogsRelease, DiscogsMaster, DiscogsArtist, DiscogsLabel)


def __getData(id_list: list[str], DiscogsModel: type[models.Model]) -> dict[str, models.Model]:
    entities = {}
    for entity_id in id_list:
        try:
            if entity_id.isdigit():
                entities[entity_id] = DiscogsModel.objects.get(id=int(entity_id))
            else:
                entities[entity_id] = DiscogsModel.objects.get(sname=entity_id[:30].lower())
        except (DiscogsModel.DoesNotExist, DiscogsModel.MultipleObjectsReturned):
            pass
    return entities


def getReleases(release_list: list[str]) -> dict[str, DiscogsRelease]:
    return __getData(release_list, DiscogsRelease)


def getMasters(master_list: list[str]) -> dict[str, DiscogsMaster]:
    return __getData(master_list, DiscogsMaster)


def getArtists(artist_list: list[str]) -> dict[str, DiscogsArtist]:
    return __getData(artist_list, DiscogsArtist)


def getLabels(label_list: list[str]) -> dict[str, DiscogsLabel]:
    return __getData(label_list, DiscogsLabel)