from django.contrib import admin
from records.models import Record, Artist, RecordArtists, Track, Listen, RecordListens, ArtistMembers, DiscogsUser
from records.services.record import updateRecord
from records.services.artist import updateArtist
from django.core.cache import cache
# Register your models here.


class ArtistInline(admin.TabularInline):
    model = RecordArtists
    extra = 0


class TrackInline(admin.TabularInline):
    model = Track
    extra = 0


class ListenInline(admin.TabularInline):
    model = RecordListens
    extra = 0


def reset_updated(modeladmin, request, queryset):
    queryset.update(updated=None)


def update_record(modeladmin, request, queryset):
    for record in queryset:
        updateRecord(record)


def clear_cache_item(modeladmin, request, queryset):
    cache.delete_many([record.get_cache_key() for record in queryset])


class RecordAdmin(admin.ModelAdmin):
    fields = ['id', 'name', 'master', 'year', 'format',
              'cover', 'thumbnail', 'price', 'updated']
    inlines = [ArtistInline, TrackInline, ListenInline]
    list_display = ('id', 'get_artist', 'name', 'format', 'updated')
    search_fields = ['name']
    actions = [reset_updated, update_record, clear_cache_item, ]


admin.site.register(Record, RecordAdmin)


def update_artist(modeladmin, request, queryset):
    for artist in queryset:
        updateArtist(artist)


class MembersInline(admin.TabularInline):
    model = ArtistMembers
    extra = 0
    fk_name = 'group'


class GroupsInline(admin.TabularInline):
    model = ArtistMembers
    extra = 0
    fk_name = 'member'


class ArtistAdmin(admin.ModelAdmin):
    fields = ['id', 'name', 'description',
              'image', 'updated', 'collectionUpdated']
    inlines = [MembersInline, GroupsInline]
    list_display = ('id', 'name', 'description', 'image',
                    'updated', 'collectionUpdated')
    search_fields = ['name']
    actions = [reset_updated, update_artist, ]


admin.site.register(Artist, ArtistAdmin)


class ListenAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'template')
    search_fields = ['name']


admin.site.register(Listen, ListenAdmin)


class DiscogsUserAdmin(admin.ModelAdmin):
    fields = ['username']
    list_display = ('id', 'username')
    search_fields = ['username']


admin.site.register(DiscogsUser, DiscogsUserAdmin)
