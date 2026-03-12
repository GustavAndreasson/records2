# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class DiscogsArtist(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.TextField()
    realname = models.TextField(blank=True, null=True)
    profile = models.TextField(blank=True, null=True)
    data_quality = models.TextField(blank=True, null=True)
    sname = models.TextField()

    class Meta:
        managed = False
        db_table = 'artist'


class DiscogsArtistAlias(models.Model):
    artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE)
    alias_name = models.TextField()
    alias_artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE, related_name='alias_artist_set')

    class Meta:
        managed = False
        db_table = 'artist_alias'


class DiscogsArtistImage(models.Model):
    artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE)
    type = models.TextField(blank=True, null=True)
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'artist_image'


class ArtistNamevariation(models.Model):
    id = models.BigAutoField(primary_key=True)
    artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE)
    name = models.TextField()

    class Meta:
        managed = False
        db_table = 'artist_namevariation'


class DiscogsArtistUrl(models.Model):
    id = models.BigAutoField(primary_key=True)
    artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE)
    url = models.TextField()

    class Meta:
        managed = False
        db_table = 'artist_url'


class DiscogsGroupMember(models.Model):
    group_artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE, related_name='group_artist_set')
    member_artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE, related_name='member_artist_set')
    member_name = models.TextField()

    class Meta:
        managed = False
        db_table = 'group_member'


class DiscogsLabel(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.TextField()
    contact_info = models.TextField(blank=True, null=True)
    profile = models.TextField(blank=True, null=True)
    parent_id = models.IntegerField(blank=True, null=True)
    parent_name = models.TextField(blank=True, null=True)
    data_quality = models.TextField(blank=True, null=True)
    sname = models.TextField()

    class Meta:
        managed = False
        db_table = 'label'


class DiscogsLabelImage(models.Model):
    label = models.ForeignKey(DiscogsLabel, on_delete=models.CASCADE)
    type = models.TextField(blank=True, null=True)
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'label_image'


class DiscogsLabelUrl(models.Model):
    id = models.BigAutoField(primary_key=True)
    label = models.ForeignKey(DiscogsLabel, on_delete=models.CASCADE)
    url = models.TextField()

    class Meta:
        managed = False
        db_table = 'label_url'


class DiscogsMaster(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.TextField()
    year = models.IntegerField(blank=True, null=True)
    artists = models.ManyToManyField(DiscogsArtist, through="DiscogsMasterArtist")
    main_release = models.ForeignKey('DiscogsRelease', on_delete=models.CASCADE, db_column='main_release')
    data_quality = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'master'


class DiscogsMasterArtist(models.Model):
    id = models.BigAutoField(primary_key=True)
    master = models.ForeignKey(DiscogsMaster, on_delete=models.CASCADE)
    artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE)
    artist_name = models.TextField(blank=True, null=True)
    anv = models.TextField(blank=True, null=True)
    position = models.IntegerField(blank=True, null=True)
    join_string = models.TextField(blank=True, null=True)
    role = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'master_artist'


class DiscogsMasterGenre(models.Model):
    id = models.BigAutoField(primary_key=True)
    master = models.ForeignKey(DiscogsMaster, on_delete=models.CASCADE)
    genre = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'master_genre'


class DiscogsMasterImage(models.Model):
    master = models.ForeignKey(DiscogsMaster, on_delete=models.CASCADE)
    type = models.TextField(blank=True, null=True)
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'master_image'


class DiscogsMasterStyle(models.Model):
    id = models.BigAutoField(primary_key=True)
    master = models.ForeignKey(DiscogsMaster, on_delete=models.CASCADE)
    style = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'master_style'


class DiscogsMasterVideo(models.Model):
    id = models.BigAutoField(primary_key=True)
    master = models.ForeignKey(DiscogsMaster, on_delete=models.CASCADE)
    duration = models.IntegerField(blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    uri = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'master_video'


class DiscogsRelease(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.TextField()
    artists = models.ManyToManyField(DiscogsArtist, through="DiscogsReleaseArtist")
    companies = models.ManyToManyField(DiscogsLabel, through="DiscogsReleaseCompany", related_name='company_release_set')
    labels = models.ManyToManyField(DiscogsLabel, through="DiscogsReleaseLabel", related_name='label_release_set')
    released = models.TextField(blank=True, null=True)
    country = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    data_quality = models.TextField(blank=True, null=True)
    main = models.IntegerField(blank=True, null=True)
    master = models.ForeignKey(DiscogsMaster, on_delete=models.CASCADE)
    status = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release'


class DiscogsReleaseArtist(models.Model):
    id = models.BigAutoField(primary_key=True)
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE)
    artist_name = models.TextField(blank=True, null=True)
    extra = models.IntegerField()
    anv = models.TextField(blank=True, null=True)
    position = models.IntegerField(blank=True, null=True)
    join_string = models.TextField(blank=True, null=True)
    role = models.TextField(blank=True, null=True)
    tracks = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_artist'


class DiscogsReleaseCompany(models.Model):
    id = models.BigAutoField(primary_key=True)
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    company = models.ForeignKey(DiscogsLabel, on_delete=models.CASCADE)
    company_name = models.TextField()
    entity_type = models.TextField(blank=True, null=True)
    entity_type_name = models.TextField(blank=True, null=True)
    uri = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_company'


class DiscogsReleaseFormat(models.Model):
    id = models.BigAutoField(primary_key=True)
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    name = models.TextField(blank=True, null=True)
    qty = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    text_string = models.TextField(blank=True, null=True)
    descriptions = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_format'


class DiscogsReleaseGenre(models.Model):
    id = models.BigAutoField(primary_key=True)
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    genre = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_genre'


class DiscogsReleaseIdentifier(models.Model):
    id = models.BigAutoField(primary_key=True)
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)
    type = models.TextField(blank=True, null=True)
    value = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_identifier'


class DiscogsReleaseImage(models.Model):
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    type = models.TextField(blank=True, null=True)
    width = models.IntegerField(blank=True, null=True)
    height = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_image'


class DiscogsReleaseLabel(models.Model):
    id = models.BigAutoField(primary_key=True)
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    label = models.ForeignKey(DiscogsLabel, on_delete=models.CASCADE)
    label_name = models.TextField()
    catno = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_label'


class DiscogsReleaseStyle(models.Model):
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    style = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_style'


class DiscogsReleaseTrack(models.Model):
    id = models.BigAutoField(primary_key=True)
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    sequence = models.IntegerField()
    position = models.TextField(blank=True, null=True)
    parent = models.IntegerField(blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    duration = models.TextField(blank=True, null=True)
    track_id = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_track'


class DiscogsReleaseTrackArtist(models.Model):
    id = models.BigAutoField(primary_key=True)
    track = models.ForeignKey(DiscogsReleaseTrack, on_delete=models.CASCADE)
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    track_sequence = models.IntegerField()
    artist = models.ForeignKey(DiscogsArtist, on_delete=models.CASCADE)
    artist_name = models.TextField(blank=True, null=True)
    extra = models.IntegerField()
    anv = models.TextField(blank=True, null=True)
    position = models.IntegerField(blank=True, null=True)
    join_string = models.TextField(blank=True, null=True)
    role = models.TextField(blank=True, null=True)
    tracks = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_track_artist'


class DiscogsReleaseVideo(models.Model):
    id = models.BigAutoField(primary_key=True)
    release = models.ForeignKey(DiscogsRelease, on_delete=models.CASCADE)
    duration = models.IntegerField(blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    uri = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'release_video'
