# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals
from django.core.cache import cache
from django.db import models
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFit


class Artist(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1024, blank=True)
    sname = models.CharField(max_length=20, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    updated = models.DateField(blank=True, null=True)
    collectionUpdated = models.DateField(blank=True, null=True)
    members = models.ManyToManyField("self", through="ArtistMembers", symmetrical=False)

    def __str__(self):
        return self.name

    def to_dict(self, full=True):
        if not full:
            return {"id": self.id, "name": self.name}
        member_relations = ArtistMembers.objects.filter(group=self)
        members = [{"artist": mr.member.to_dict(False), "active": mr.active} for mr in member_relations]
        group_relations = ArtistMembers.objects.filter(member=self)
        groups = [{"artist": gr.group.to_dict(False), "active": gr.active} for gr in group_relations]
        updated = str(self.updated) if self.updated else None
        collectionUpdated = str(self.collectionUpdated) if self.collectionUpdated else None
        return {
            "id": self.id,
            "name": self.name,
            "image": self.image,
            "description": self.description,
            "members": members,
            "groups": groups,
            "updated": updated,
            "collectionUpdated": collectionUpdated,
        }

    def save(self, *args, **kwargs):
        self.sname = self.name.lower()[:20]
        super(Artist, self).save(*args, **kwargs)

    class Meta:
        indexes = [models.Index(fields=["sname"])]


class Listen(models.Model):
    name = models.CharField(max_length=32, unique=True)
    template = models.TextField(blank=True)
    icon = models.CharField(max_length=64, blank=True, null=True)

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name


class Format(models.Model):
    name = models.CharField(max_length=32, unique=True)

    def __str__(self):
        return self.name


class Record(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=1024)
    master = models.IntegerField(blank=True, null=True)
    cover = models.CharField(max_length=255, blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    updated = models.DateField(blank=True, null=True)
    thumbnail = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, blank=True, null=True)
    genres = models.ManyToManyField(to=Genre)
    listens = models.ManyToManyField(Listen, through="RecordListens")
    formats = models.ManyToManyField(Format, through="RecordFormats")
    artists = models.ManyToManyField(Artist, through="RecordArtists")
    cover_file = models.ImageField(upload_to="records", blank=True, null=True)
    thumbnail_file = ImageSpecField(
        source="cover_file", processors=[ResizeToFit(200, 90)], format="JPEG", options={"quality": 100}
    )

    def __str__(self):
        return self.name

    def to_dict(self):
        cached_data = cache.get(self.get_cache_key())
        if cached_data:
            cached_data["cached"] = True
            return cached_data
        dict = {
            "id": self.id,
            "name": self.name,
            "master": self.master,
            "cover": self.cover_file.url if self.cover_file else self.cover,
            "year": self.year,
            "thumbnail": self.thumbnail_file.url if self.thumbnail_file else self.thumbnail,
            "price": str(self.price) if self.price else None,
            "genres": [genre.name for genre in self.genres.all()],
            "updated": str(self.updated) if self.updated else None,
        }
        ras = RecordArtists.objects.filter(record=self)
        artists = [{"artist": ra.artist.to_dict(False), "delimiter": ra.delimiter, "anv": ra.anv} for ra in ras]
        dict["artists"] = artists
        rfs = RecordFormats.objects.filter(record=self)
        formats = [rf.to_dict() for rf in rfs]
        dict["formats"] = formats
        rls = RecordListens.objects.filter(record=self)
        listens = [rl.to_dict() for rl in rls]
        dict["listens"] = listens
        track_objects = self.track_set.all()  # type: ignore
        tracks = [track.to_dict() for track in track_objects]
        dict["tracks"] = tracks
        cache.set(self.get_cache_key(), dict)
        return dict

    def get_cache_key(self):
        return "record-" + str(self.id)

    def get_artist(self):
        ras = RecordArtists.objects.filter(record=self)
        artists = ""
        for ra in ras:
            artists += ra.artist.name + " "
        return artists

    get_artist.short_description = "Artist"


class DiscogsUser(models.Model):
    username = models.CharField(max_length=255)
    records = models.ManyToManyField(Record, through="UserRecords")

    def __str__(self):
        return self.username


class UserRecords(models.Model):
    user = models.ForeignKey(DiscogsUser, on_delete=models.CASCADE)
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    added_date = models.DateField(blank=True, null=True)

    class Meta:
        ordering = ["id"]


class Track(models.Model):
    position = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=1024, blank=True, null=True)
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    artists = models.ManyToManyField(Artist, through="TrackArtists")

    def __str__(self):
        return self.name

    def to_dict(self):
        tas = TrackArtists.objects.filter(track=self)
        artists = [{"artist": ta.artist.to_dict(False), "delimiter": ta.delimiter} for ta in tas]
        if len(artists) == 0:
            artists = None
        return {"position": self.position, "name": self.name, "artists": artists}


class RecordListens(models.Model):
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    listen = models.ForeignKey(Listen, on_delete=models.CASCADE)
    listen_key = models.CharField(max_length=64, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)

    def to_dict(self):
        return {
            "type": self.listen.name,
            "name": self.name,
            "icon": self.listen.icon,
            "html": self.listen.template.format(self.listen_key),
        }


class RecordFormats(models.Model):
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    format = models.ForeignKey(Format, on_delete=models.CASCADE)
    qty = models.IntegerField(blank=True, null=True)

    def to_dict(self):
        return {
            "name": self.format.name,
            "qty": self.qty,
        }


class RecordArtists(models.Model):
    record = models.ForeignKey(Record, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    delimiter = models.CharField(max_length=255, blank=True, null=True)
    anv = models.CharField(max_length=255, blank=True, null=True)
    position = models.IntegerField(blank=True, null=True)

    class Meta:
        ordering = ["position"]


class ArtistMembers(models.Model):
    group = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="group")
    member = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="member")
    active = models.IntegerField(blank=True, null=True)


class TrackArtists(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    delimiter = models.CharField(max_length=255, blank=True, null=True)
    position = models.IntegerField(blank=True, null=True)

    class Meta:
        ordering = ["position"]


class DiscogsAccess(models.Model):
    timestamp = models.IntegerField()

    def __str__(self):
        return str(self.timestamp)
