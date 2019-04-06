# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class Artist(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    updated = models.DateField(blank=True, null=True)
    members = models.ManyToManyField('self', through='ArtistMembers', symmetrical=False)

    def __str__(self):
        return self.name

    def to_dict(self, full=True):
        if not full:
            return {"id": self.id, "name": self.name}
        member_relations = ArtistMembers.objects.filter(group=self)
        members = [{"artist": mr.member.to_dict(False), "active": mr.active} for mr in member_relations]
        group_relations = ArtistMembers.objects.filter(member=self)
        groups = [{"artist": gr.group.to_dict(False), "active": gr.active} for gt in group_relations]
        return {"id": self.id, "name": self.name, "image": self.image, "description": self.description, "members": members, "groups": groups}


class Listen(models.Model):
    name = models.CharField(max_length=32, unique=True)
    template = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=64, blank=True, null=True)

    def __str__(self):
        return self.name


class Record(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    cover = models.CharField(max_length=255, blank=True, null=True)
    format = models.CharField(max_length=255, blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    updated = models.DateField(blank=True, null=True)
    thumbnail = models.CharField(max_length=255, blank=True, null=True)
    #spotifyId = models.CharField(max_length=32, blank=True, null=True)
    listens = models.ManyToManyField(Listen, through='RecordListens')
    artists = models.ManyToManyField(Artist, through='RecordArtists')

    def __str__(self):
        return self.name

    def to_dict(self, data_level):
        dict = {"id": self.id, "name": self.name, "cover": self.cover, "format": self.format, "year":  self.year, "thumbnail": self.thumbnail, "data_level": data_level}
        if data_level == 0:
            return dict
        ras = RecordArtists.objects.filter(record=self)
        artists = [{"artist": ra.artist.to_dict(False), "delimiter": ra.delimiter} for ra in ras]
        dict["artists"] = artists
        if data_level == 1:
            return dict
        rls = RecordListens.objects.filter(record=self)
        listens = [rl.to_dict() for rl in rls]
        dict["listens"] = listens
        track_objects = self.track_set.all()
        tracks = [track.to_dict() for track in track_objects]
        dict["tracks"] = tracks
        return dict

    def get_artist(self):
        ras = RecordArtists.objects.filter(record=self)
        artists = ""
        for ra in ras:
            artists += ra.artist.name + " "
        return artists
    get_artist.short_description = "Artist"

class DiscogsUser(models.Model):
    username = models.CharField(max_length=255)
    records = models.ManyToManyField(Record, through='UserRecords')

    def __str__(self):
        return self.username

    def to_dict(self, data_level):
        urs = UserRecords.objects.filter(user=self)
        dict = {}
        for ur in urs:
            dict[ur.record.id] = ur.record.to_dict(data_level)
            dict[ur.record.id]["addedDate"] = str(ur.added_date)
        return dict


class UserRecords(models.Model):
    user = models.ForeignKey(DiscogsUser, on_delete=models.CASCADE)
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    added_date = models.DateField(blank=True, null=True)


class Track(models.Model):
    position = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    artists = models.ManyToManyField(Artist, through='TrackArtists')

    def __str__(self):
        return self.name

    def to_dict(self):
        tas = TrackArtists.objects.filter(track=self)
        artists = [{"artist": ta.artist.to_dict(False), "delimiter": ta.delimiter} for ta in tas]
        if len(artists) == 0:
            artists = None
        return {"position": self.position, "name": self.name, "artists" : artists}


class RecordListens(models.Model):
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    listen = models.ForeignKey(Listen, on_delete=models.CASCADE)
    listen_key = models.CharField(max_length=64, blank=True, null=True)

    def to_dict(self):
        return {"name": self.listen.name, "icon": self.listen.icon, "html": self.listen.template.format(self.listen_key)}


class RecordArtists(models.Model):
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    delimiter = models.CharField(max_length=255, blank=True, null=True)
    position = models.IntegerField(blank=True, null=True)

    class Meta:
        ordering = ['position']


class ArtistMembers(models.Model):
    group = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='group')
    member = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='member')
    active = models.IntegerField(blank=True, null=True)


class TrackArtists(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    delimiter = models.CharField(max_length=255, blank=True, null=True)
    position = models.IntegerField(blank=True, null=True)

    class Meta:
        ordering = ['position']


class DiscogsAccess(models.Model):
    timestamp = models.IntegerField()

    def __str__(self):
        return str(self.timestamp)
