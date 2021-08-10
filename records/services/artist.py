import re
from datetime import date
from ..models import Artist, ArtistMembers
from .. import discogs
from .. import progress
import records.services.record as recordService
import logging

logger = logging.getLogger(__name__)


def createArtist(id, name):
    artist, created = Artist.objects.get_or_create(
        id=id,
        defaults={'name': __fixArtistName(name)})
    if created:
        logger.info("Created artist " + artist.name
                    + " (" + str(artist.id) + ")")
    return artist


def updateArtist(artist):
    logger.info("Updating artist " + artist.name + " (" + str(artist.id) + ")")
    try:
        artist_data = discogs.getArtist(artist.id)
        artist.description = artist_data.get('profile')
        if artist_data.get('images'):
            artist.image = artist_data['images'][0].get('resource_url')
        if artist_data.get('members'):
            for member_data in artist_data.get('members'):
                member, created = Artist.objects.get_or_create(
                    id=member_data['id'],
                    defaults={'name': __fixArtistName(member_data['name'])})
                if created:
                    logger.info("Created artist " + member.name
                                + " (" + str(member.id) + ")")
                ArtistMembers.objects.update_or_create(
                    group=artist,
                    member=member,
                    defaults={'active': member_data['active']})
        if artist_data.get('groups'):
            for group_data in artist_data.get('groups'):
                group, created = Artist.objects.get_or_create(
                    id=group_data['id'],
                    defaults={'name': __fixArtistName(group_data['name'])})
                if created:
                    logger.info("Created artist " + group.name
                                + " (" + str(group.id) + ")")
                ArtistMembers.objects.update_or_create(
                    group=group,
                    member=artist,
                    defaults={'active': group_data['active']})
        artist.updated = date.today()
        artist.save()
    except discogs.DiscogsError as de:
        logger.info("Did not find artist " + artist.name
                    + " (" + str(artist.id) + ") on discogs\n" + str(de))
        return False
    return True


def collectArtistReleases(artist):
    logger.info("Collecting releases for artist "
                + artist.name + " (" + str(artist.id) + ")")
    try:
        artist_releases = discogs.getArtistReleases(artist.id)
        artist_main_releases = [
            release for release in artist_releases
            if release.get('role') == "Main"]
        tot = len(artist_main_releases)
        nr = 0
        for release_data in artist_main_releases:
            recordService.createRecord(release_data['id'], {
                'name': release_data.get('title'),
                'cover': release_data.get('thumb'),
                'thumbnail': release_data.get('thumb'),
                'year': release_data.get('year'),
                'type': release_data.get('type'),
                'main_release': release_data.get('main_release'),
                'artists': [artist]
            })
            nr = nr + 1
            if nr % 10 == 0:
                progress.updateProgress('create', int((nr * 100) / tot))
        progress.updateProgress('create', 100)
    except discogs.DiscogsError as de:
        logger.info("Did not find releases for "
                    + artist.name + " on discogs\n" + str(de))
        return False
    artist.collectionUpdated = date.today()
    artist.save()
    return True


def __fixArtistName(name):
    myre = re.compile('\\(\\d+\\)$')
    return myre.sub('', name)
