from ..models import UserRecords
from .. import discogs
from .. import progress
import records.services.record as recordService
import logging

logger = logging.getLogger(__name__)


def updateCollection(user):
    logger.info("Updating collection for " + user.username)
    try:
        collection_data = discogs.getCollection(user.username)
        old_collection = list(UserRecords.objects.filter(user=user)
                              .values_list('record_id', flat=True))
        tot = len(collection_data)
        nr = 0
        for release_data in collection_data:
            if release_data['basic_information']['id'] not in old_collection:
                record = recordService.createRecord(
                    release_data['basic_information']['id'], {
                        'name': release_data['basic_information'].get('title'),
                        'master': release_data['basic_information'].get('master_id'),
                        'cover': release_data['basic_information'].get('cover_image'),
                        'thumbnail': release_data['basic_information'].get('thumb'),
                        'year': release_data['basic_information'].get('year'),
                        'format': release_data['basic_information'].get('formats'),
                        'artists': release_data['basic_information']['artists']
                    })
                ur = UserRecords.objects\
                    .create(user=user,
                            record=record,
                            added_date=release_data['date_added'][0:10])
                logger.info("Added record " + record.name
                            + " (" + str(record.id) + ") to collection for "
                            + user.username)
            else:
                old_collection.remove(release_data['basic_information']['id'])
            nr = nr + 1
            if nr % 10 == 0:
                progress.updateProgress('create', int((nr * 100) / tot))
        removed_records = UserRecords.objects.filter(user=user)\
            .filter(record_id__in=old_collection)
        if removed_records.exists():
            for ur in removed_records:
                logger.info("Removed record " + ur.record.name
                            + " (" + str(ur.record.id)
                            + ") from collection for " + user.username)
            removed_records.delete()
        progress.updateProgress('create', 100)
    except discogs.DiscogsError as de:
        logger.info("Did not find collection for " + user.username
                    + " on discogs\n" + str(de))
        return False
    return True
