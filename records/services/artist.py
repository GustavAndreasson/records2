from django.db import DatabaseError
from datetime import date
from ..models import Artist, ArtistMembers
from .. import discogs
from .. import progress
import records.services.record as recordService
import logging

logger = logging.getLogger(__name__)


def createArtist(id: int, name: str) -> Artist:
    artist, created = Artist.objects.get_or_create(id=id, defaults={"name": name})
    if created:
        logger.info("Created artist " + artist.name + " (" + str(artist.id) + ")")
    return artist


def updateArtist(artist: Artist) -> bool:
    logger.info("Updating artist " + artist.name + " (" + str(artist.id) + ")")
    try:
        artist_data = discogs.getArtist(artist.id)
        artist.description = artist_data.profile
        if artist_data.images:
            artist.image = artist_data.images[0].resource_url
        if artist_data.members:
            for member_data in artist_data.members:
                member, created = Artist.objects.get_or_create(id=member_data.id, defaults={"name": member_data.name})
                if created:
                    logger.info("Created artist " + member.name + " (" + str(member.id) + ")")
                ArtistMembers.objects.update_or_create(
                    group=artist, member=member, defaults={"active": member_data.active}
                )
        if artist_data.groups:
            for group_data in artist_data.groups:
                group, created = Artist.objects.get_or_create(id=group_data.id, defaults={"name": group_data.name})
                if created:
                    logger.info("Created artist " + group.name + " (" + str(group.id) + ")")
                ArtistMembers.objects.update_or_create(
                    group=group, member=artist, defaults={"active": group_data.active}
                )
        artist.updated = date.today()
        artist.save()
    except discogs.DiscogsError as de:
        logger.info("Did not find artist " + artist.name + " (" + str(artist.id) + ") on discogs\n" + str(de))
        return False
    except DatabaseError as de:
        logger.error("Could not update artist " + artist.name + " (" + str(artist.id) + ")\n" + str(de))
        return False
    return True


def collectArtistReleases(artist: Artist) -> bool:
    logger.info("Collecting releases for artist " + artist.name + " (" + str(artist.id) + ")")
    try:
        artist_releases = discogs.getArtistReleases(artist.id)
        artist_main_releases = [
            release for release in artist_releases if release.role == "Main" and release.type == "master"
        ]
        tot = len(artist_main_releases)
        nr = 0
        for release_data in artist_main_releases:
            try:
                recordService.createRecordFromArtistRelease(release_data, artist)
            except DatabaseError as de:
                logger.error(
                    "Could not create record " + release_data.title + " (" + str(release_data.id) + ")\n" + str(de)
                )
            nr = nr + 1
            if nr % 10 == 0:
                progress.updateProgress("create", int((nr * 100) / tot))
        progress.updateProgress("create", 100)
    except discogs.DiscogsError as de:
        logger.info("Did not find releases for " + artist.name + " on discogs\n" + str(de))
        return False
    artist.collection_updated = date.today()
    artist.save()
    return True


def getArtists(artist_list: list[str]) -> dict[str, Artist]:
    artists: dict[str, Artist] = {}
    for artist_identifier in artist_list:
        try:
            if artist_identifier.isdigit():
                artists[artist_identifier] = Artist.objects.get(id=int(artist_identifier))
            else:
                artists[artist_identifier] = Artist.objects.get(sname=artist_identifier[:20].lower())
        except (Artist.DoesNotExist, Artist.MultipleObjectsReturned):
            pass
    return artists
