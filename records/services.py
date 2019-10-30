import re
from datetime import date
from django.core.cache import cache
from .models import *
from . import discogs
from . import spotify
import logging

logger = logging.getLogger(__name__)

def updateCollection(user):
    logger.info("Updating collection for " + user.username)
    try:
        collection_data = discogs.getCollection(user.username)
        old_collection = list(UserRecords.objects.filter(user=user).values_list('record_id', flat=True))
        for release_data in collection_data:
            if release_data['basic_information']['id'] not in old_collection:
                record, created = Record.objects.get_or_create(
                    id=release_data['basic_information']['id'],
                    defaults={
                        'name': release_data['basic_information'].get('title'),
                        'cover': release_data['basic_information'].get('cover_image'),
                        'thumbnail': release_data['basic_information'].get('thumb'),
                        'year': release_data['basic_information'].get('year'),
                        'format': __getFormat(release_data['basic_information'].get('formats'))
                    })
                if created:
                    logger.info("Created record " + record.name + " (" + str(record.id) + ")")
                position = 0
                for r_artist in release_data['basic_information']['artists']:
                    artist, created = Artist.objects.get_or_create(
                        id=r_artist['id'],
                        defaults={'name': __fixArtistName(r_artist['name'])})
                    if created:
                        logger.info("Created artist " + artist.name + " (" + str(artist.id) + ")")
                    ra = RecordArtists.objects.create(
                        record=record,
                        artist=artist,
                        delimiter=r_artist['join'],
                        position=position)
                    position += 1
                ur = UserRecords.objects.create(user=user, record=record, added_date=release_data['date_added'][0:10])
                logger.info("Added record " + record.name + " (" + str(record.id) + ") to collection for " + user.username)
            else:
                old_collection.remove(release_data['basic_information']['id'])
        removed_records = UserRecords.objects.filter(user=user).filter(record_id__in=old_collection)
        if removed_records.exists():
            for ur in removed_records:
                logger.info("Removed record " + ur.record.name + " (" + str(ur.record.id) + ") from collection for " + user.username)
            removed_records.delete()
    except discogs.DiscogsError as de:
        logger.info("Did not find collection for " + user.username + " on discogs\n" + str(de))
        return False
    return True


def updateRecord(record):
    logger.info("Updating record " + record.name + " (" + str(record.id) + ")")
    try:
        release_data = discogs.getRelease(record.id)
        if release_data.get('master_id'):
            try:
                master_data = discogs.getMaster(release_data.get('master_id'))
                release_data['year'] = master_data.get('year')
                if not release_data.get('images'):
                    if master_data.get('images'):
                        release_data['images'] = master_data.get('images')
                if not release_data.get('videos'):
                    if master_data.get('videos'):
                        release_data['videos'] = master_data.get('videos')
            except discogs.DiscogsError as de:
                logger.info("Did not find master for record " + record.name + " (" + str(record.id) + ") on discogs\n" + str(de))
        record.track_set.all().delete()
        if release_data.get('tracklist'):
            for track_data in release_data.get('tracklist'):
                __createTrack(record, track_data)
        if release_data.get('images'):
            record.cover = release_data['images'][0].get('uri')
            record.thumbnail = release_data['images'][0].get('uri150')
        spotify_listen = Listen.objects.get(name="spotify")
        if RecordListens.objects.filter(record=record,listen=spotify_listen).count() == 0:
            try:
                spotify_id = spotify.getAlbumId(record.get_artist(), record.name)
                if spotify_id:
                    RecordListens.objects.create(record=record,listen=spotify_listen, listen_key=spotify_id)
            except spotify.SpotifyError as se:
                logger.error("Request to spotify failed:\n" + str(se))
        if release_data.get('videos'):
            youtube_listen = Listen.objects.get(name='youtube')
            for video in release_data.get('videos'):
                if "youtube" in video['uri'] and "v=" in video['uri']:
                    youtube_key = video['uri'][video['uri'].find('v=')+2:]
                    if RecordListens.objects.filter(record=record,listen=youtube_listen, listen_key=youtube_key).count() == 0:
                        RecordListens.objects.create(record=record, listen=youtube_listen, listen_key=youtube_key, name=video.get('title'))
        record.year = release_data.get('year')
        if release_data.get('formats'):
            record.format = __getFormat(release_data.get('formats'))
        if release_data.get('lowest_price'):
            record.price = release_data.get('lowest_price')
        record.updated = date.today()
        record.save()
    except discogs.DiscogsError as de:
        logger.info("Did not find record " + record.name + " (" + str(record.id) + ") on discogs\n" + str(de))
        return False
    return True

def __getFormat(format_data):
    formats = []
    for format in format_data:
        format_string = format.get('name')
        if format.get('descriptions'):
            if "7\"" in format.get('descriptions'):
                format_string += "7"
            if "10\"" in format.get('descriptions'):
                format_string += "10"
            if "12\"" in format.get('descriptions'):
                format_string += "12"
        formats.append(format_string.replace(" ", "-"))
    return " ".join(formats)


def __createTrack(record, track_data):
    track = Track.objects.create(position=track_data.get('position'),
                                 name=track_data.get('title'),
                                 record=record)
    if track_data.get('artists'):
        position = 0
        for t_artist in track_data.get('artists'):
            artist, created = Artist.objects.get_or_create(
                id=t_artist['id'],
                defaults={'name': __fixArtistName(t_artist['name'])})
            ta = TrackArtists.objects.create(
                track=track,
                artist=artist,
                delimiter=t_artist['join'],
                position=position)
            position += 1

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
                    logger.info("Created artist " + member.name + " (" + str(member.id) + ")")
                am = ArtistMembers.objects.update_or_create(
                    group=artist,
                    member=member,
                    defaults={'active': member_data['active']})
        if artist_data.get('groups'):
            for group_data in artist_data.get('groups'):
                group, created = Artist.objects.get_or_create(
                    id=group_data['id'],
                    defaults={'name': __fixArtistName(group_data['name'])})
                if created:
                    logger.info("Created artist " + group.name + " (" + str(group.id) + ")")
                am = ArtistMembers.objects.update_or_create(
                    group=group,
                    member=artist,
                    defaults={'active': group_data['active']})
        artist.updated = date.today()
        artist.save()
    except discogs.DiscogsError as de:
        logger.info("Did not find artist " + artist.name + " (" + str(artist.id) + ") on discogs\n" + str(de))
        return False
    return True

def __fixArtistName(name):
    myre = re.compile('\(\d+\)$')
    return myre.sub('', name)
