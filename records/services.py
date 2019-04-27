import re
from datetime import date
from .models import *
from . import discogs

def createCollection(user):
    collection = discogs.getCollection(user.username)
    if collection:
        for release in collection:
            formats = []
            for format in release['basic_information']['formats']:
                format_string = format.get('name')
                if "7\"" in format.get('description'):
                    format_string += "7"
                if "10\"" in format.get('description'):
                    format_string += "10"
                if "12\"" in format.get('description'):
                    format_string += "12"
                formats = formats.append(format_string)
            record, created = Record.objects.get_or_create(id=release['basic_information']['id'],
                                                           defaults={
                                                               'name': release['basic_information'].get('title'),
                                                               'cover': release['basic_information'].get('cover_image'),
                                                               'thumbnail': release['basic_information'].get('thumb'),
                                                               'year': release['basic_information'].get('year'),
                                                               'format': " ".join(formats)
                                                           })
            if created:
                position = 0
                for r_artist in release['basic_information']['artists']:
                    artist, created = Artist.objects.get_or_create(id=r_artist['id'],
                                                                   defaults={'name': __fixArtistName(r_artist['name'])})
                    ra = RecordArtists.objects.create(record=record,
                                                      artist=artist,
                                                      delimiter=r_artist['join'],
                                                      position=position)
                    position += 1
            ur = UserRecords.objects.create(user=user, record=record, added_date=release['date_added'][0:10])
        return True
    return False


def updateRecord(record):
    release_data = discogs.getRelease(record.id)
    if release_data.get('master_id'):
        master_data = discogs.getMaster(release_data.get('master_id'))
        release_data['year'] = master_data.get('year')
        if not release_data.get('images'):
            if master_data.get('images'):
                release_data['images'] = master_data.get('images')
        if not release_data.get('videos'):
            if master_data.get('videos'):
                release_data['videos'] = master_data.get('videos')

    record.track_set.all().delete()
    if release_data.get('tracklist'):
        for track_data in release_data.get('tracklist'):
            __createTrack(record, track_data)
    if release_data.get('images'):
        record.cover = release_data['images'][0].get('uri')
        record.thumbnail = release_data['images'][0].get('uri')
    if release_data.get('videos'):
        listen = Listen.objects.get(name='youtube')
        for video in release_data.get('videos'):
            if "youtube" in video['uri'] and "v=" in video['uri']:
                listen_key = video['uri'][video['uri'].find('v=')+2:]
                RecordListens.objects.create(record=record, listen=listen, listen_key=listen_key)
    record.year = release_data.get('year')
    record.updated = date.today()
    record.save()


def __createTrack(record, track_data):
    track = Track.objects.create(position=track_data.get('position'),
                                 name=track_data.get('title'),
                                 record=record)
    if track_data.get('artists'):
        position = 0
        for t_artist in track_data.get('artists'):
            artist, created = Artist.objects.get_or_create(id=t_artist['id'],
                                                           defaults={'name': __fixArtistName(t_artist['name'])})
            ta = TrackArtists.objects.create(track=track,
                                             artist=artist,
                                             delimiter=t_artist['join'],
                                             position=position)
            position += 1

def updateArtist(artist):
    artist_data = discogs.getArtist(artist.id)
    artist.description = artist_data.get('profile')
    if artist_data.get('images'):
        artist.image = artist_data['images'][0].get('resource_url')
    if artist_data.get('members'):
        for member_data in artist_data.get('members'):
            member, created = Artist.objects.get_or_create(id=member_data['id'],
                                                           defaults={'name': __fixArtistName(member_data['name'])})
            am = ArtistMembers.object.create(group=artist,
                                             member=member,
                                             active=member_data['active'])
    if artist_data.get('groups'):
        for group_data in artist_data.get('groups'):
            group, created = Artist.objects.get_or_create(id=group_data['id'],
                                                          defaults={'name': __fixArtistName(group_data['name'])})
            am = ArtistMembers.object.create(group=group,
                                             member=artist,
                                             active=group_data['active'])
    artist.updated = date.today()
    artist.save()

def __fixArtistName(name):
    myre = re.compile('\(\d+\)$')
    return myre.sub('', name)
