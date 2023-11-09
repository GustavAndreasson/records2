from ..models import UserRecords
from .. import discogs
from .. import progress
from django.db import DatabaseError
import records.services.record as recordService
import logging

logger = logging.getLogger(__name__)


def updateCollection(user):
    logger.info("Updating collection for " + user.username)
    try:
        collection_data = discogs.getCollection(user.username)
        old_collection = list(UserRecords.objects.filter(user=user).values_list("record_id", flat=True))
        tot = len(collection_data)
        nr = 0
        for release_data in collection_data:
            basic_information = release_data["basic_information"]
            if basic_information["id"] not in old_collection:
                try:
                    record = recordService.createRecord(
                        basic_information["id"],
                        {
                            "name": basic_information.get("title"),
                            "master": basic_information.get("master_id"),
                            "cover": basic_information.get("cover_image"),
                            "thumbnail": basic_information.get("thumb"),
                            "year": basic_information.get("year"),
                            "format": basic_information.get("formats"),
                            "artists": basic_information["artists"],
                        },
                    )
                    ur = UserRecords.objects.create(
                        user=user, record=record, added_date=release_data["date_added"][0:10]
                    )
                    logger.info(
                        "Added record " + record.name + " (" + str(record.id) + ") to collection for " + user.username
                    )
                except DatabaseError as de:
                    logger.error(
                        "Could not create record "
                        + basic_information.get("title")
                        + " ("
                        + basic_information["id"]
                        + ")\n"
                        + str(de)
                    )
            else:
                old_collection.remove(basic_information["id"])
            nr = nr + 1
            if nr % 10 == 0:
                progress.updateProgress("create", int((nr * 100) / tot))
        removed_records = UserRecords.objects.filter(user=user).filter(record_id__in=old_collection)
        if removed_records.exists():
            for ur in removed_records:
                logger.info(
                    "Removed record "
                    + ur.record.name
                    + " ("
                    + str(ur.record.id)
                    + ") from collection for "
                    + user.username
                )
            removed_records.delete()
        progress.updateProgress("create", 100)
    except discogs.DiscogsError as de:
        logger.info("Did not find collection for " + user.username + " on discogs\n" + str(de))
        return False
    return True
