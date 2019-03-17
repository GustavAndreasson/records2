import re
from datetime import date
from .models import *
from . import discogs

def createCollection(user):
    collection = discogs.getCollection(user.username)
    for release in collection:
        record, created = Record.objects.get_or_create(id=release['basic_information']['id'], defaults={
            'name': _fixName(release['basic_information'].get('title')),
            'cover': release['basic_information'].get('cover_image'),
            'thumbnail': release['basic_information'].get('thumb'),
            'year': release['basic_information'].get('year'),
            'format': release['basic_information']['formats'][0].get('name')
        })
        if created:
            position = 0
            for r_artist in release['basic_information']['artists']:
                artist, created = Artist.objects.get_or_create(id=r_artist['id'], defaults={'name': _fixArtistName(r_artist['name'])})
                ra = RecordArtists.objects.create(record=record, artist=artist, delimiter=r_artist['join'], position=position)
                ra.save()
                position += 1
        ur = UserRecords.objects.create(user=user, record=record, added_date=release['date_added'][0:10])
        ur.save()

def updateRecord(record, release_data):
    record.track_set.all().delete()
    if release_data.get('tracklist'):
        for track_data in release_data.get('tracklist'):
            createTrack(record, track_data)
    record.cover = release_data.get('cover_image')
    record.thumbnail = release_data.get('thumb')
    record.year = release_data.get('year')
    record.updated = date.today()
    record.save()

def createTrack(record, track_data):
    track = Track.objects.create(position=track_data.get('position'), name=_fixName(track_data.get('title')), record=record)
    if track_data.get('artists'):
        position = 0
        for t_artist in track_data.get('artists'):
            artist, created = Artist.objects.get_or_create(id=t_artist['id'], defaults={'name': _fixArtistName(t_artist['name'])})
            ta = TrackArtists.objects.create(track=track, artist=artist, delimiter=t_artist['join'], position=position)
            ta.save()
            position += 1

def _fixName(name):
    myre = re.compile(u'['
    u'\U0001F300-\U0001F64F'
    u'\U0001F680-\U0001F6FF'
    u'\u2600-\u26FF\u2700-\u27BF]+',
    re.UNICODE)
    return myre.sub('', name)

def _fixArtistName(name):
    myre = re.compile('\(\d+\)$')
    return _fixName(myre.sub('', name))
