from django.contrib import admin
from records.models import (
    Record,
    Artist,
    RecordArtists,
    Track,
    Genre,
    Format,
    RecordFormats,
    Listen,
    RecordListens,
    ArtistMembers,
    DiscogsUser,
)
from records.services.record import updateRecord
from records.services.artist import updateArtist
from django.core.cache import cache

# Register your models here.


class ArtistInline(admin.TabularInline):
    model = RecordArtists
    readonly_fields = ("artist",)
    extra = 0


class TrackInline(admin.TabularInline):
    model = Track
    extra = 0


class FormatInline(admin.TabularInline):
    model = RecordFormats
    extra = 0


class ListenInline(admin.TabularInline):
    model = RecordListens
    extra = 0


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    pass


@admin.register(Format)
class FormatAdmin(admin.ModelAdmin):
    pass


def reset_updated(modeladmin, request, queryset):
    queryset.update(updated=None)


def update_record(modeladmin, request, queryset):
    for record in queryset:
        updateRecord(record)


def clear_cache_item(modeladmin, request, queryset):
    cache.delete_many([record.get_cache_key() for record in queryset])


@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    fields = [
        "id",
        "name",
        "master",
        "year",
        "release_year",
        "release_country",
        "cover",
        "thumbnail",
        "price",
        "updated",
        "genres",
    ]
    filter_horizontal = ("genres",)
    inlines = [ArtistInline, TrackInline, FormatInline, ListenInline]
    list_display = ("id", "get_artist", "name", "updated")
    search_fields = ["name"]
    actions = [
        reset_updated,
        update_record,
        clear_cache_item,
    ]


def update_artist(modeladmin, request, queryset):
    for artist in queryset:
        updateArtist(artist)


class MembersInline(admin.TabularInline):
    model = ArtistMembers
    readonly_fields = ("member",)
    extra = 0
    fk_name = "group"


class GroupsInline(admin.TabularInline):
    model = ArtistMembers
    readonly_fields = ("group",)
    extra = 0
    fk_name = "member"


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    fields = ["id", "name", "description", "image", "updated", "collection_updated"]
    inlines = [MembersInline, GroupsInline]
    list_display = ("id", "name", "description", "image", "updated", "collection_updated")
    search_fields = ["name"]
    actions = [
        reset_updated,
        update_artist,
    ]


@admin.register(Listen)
class ListenAdmin(admin.ModelAdmin):
    list_display = ("name", "icon", "template")
    search_fields = ["name"]


@admin.register(DiscogsUser)
class DiscogsUserAdmin(admin.ModelAdmin):
    fields = ["username"]
    list_display = ("id", "username")
    search_fields = ["username"]
