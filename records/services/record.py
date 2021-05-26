from datetime import date
from ..models import Record, RecordArtists, Listen, RecordListens, Track, TrackArtists, Artist
from .. import discogs
from .. import spotify
from .. import progress
import records.services.artist as artistService
import logging
import re

logger = logging.getLogger(__name__)


def createRecord(id, data):
    release_id = id
    master_id = data.get('master', release_id + 990000000)
    if data.get('type') == "master":
        master_id = id
        try:
            release_id = Record.objects.filter(master=master_id)[0].id
        except IndexError:
            release_id = data.get('main_release')
    record, created = Record.objects.get_or_create(
        id=release_id,
        defaults={
            'name': data.get('name'),
            'master': master_id,
            'cover': data.get('cover'),
            'thumbnail': data.get('thumbnail'),
            'year': data.get('year'),
            'format': __getFormat(data.get('format')) if data.get('format') else None
        })
    if created:
        logger.info("Created record " + record.name + " (" + str(record.id) + ")")
        position = 0
        for r_artist in data.get('artists'):
            delimiter = None
            if type(r_artist) is Artist:
                artist = r_artist
            else:
                artist = artistService.createArtist(r_artist['id'], r_artist['name'])
                delimiter = r_artist.get('join')
            ra = RecordArtists.objects.create(
                record=record,
                artist=artist,
                delimiter=delimiter,
                position=position)
            position += 1
    return record


def updateRecord(record):
    logger.info("Updating record " + record.name + " (" + str(record.id) + ")")
    try:
        release_data = discogs.getRelease(record.id)
        if release_data.get('master_id'):
            record.master = release_data.get('master_id')
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
        else:
            record.master = record.id + 990000000
        RecordArtists.objects.filter(record=record).delete()
        position = 0
        for r_artist in release_data.get('artists'):
            artist = artistService.createArtist(r_artist['id'], r_artist['name'])
            ra = RecordArtists.objects.create(
                record=record,
                artist=artist,
                delimiter=r_artist['join'],
                position=position)
            position += 1
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
            RecordListens.objects.filter(record=record,listen=youtube_listen).delete()
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
            inch = re.search('(\d+)"', " ".join(format.get('descriptions')))
            if inch:
                format_string += inch.group(1)
        formats.append(format_string.replace(" ", "-"))
    return " ".join(formats)


def __createTrack(record, track_data):
    track = Track.objects.create(position=track_data.get('position'),
                                 name=track_data.get('title'),
                                 record=record)
    if track_data.get('artists'):
        position = 0
        for t_artist in track_data.get('artists'):
            artist = artistService.createArtist(t_artist['id'], t_artist['name'])
            ta = TrackArtists.objects.create(
                track=track,
                artist=artist,
                delimiter=t_artist['join'],
                position=position)
            position += 1
