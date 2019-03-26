from django.contrib import admin
from records.models import Record, Artist, RecordArtists, Track, Listen, RecordListens
# Register your models here.

class ArtistInline(admin.TabularInline):
    model = RecordArtists
    extra = 0

class TrackInline(admin.TabularInline):
    model = Track

class ListenInline(admin.TabularInline):
    model = RecordListens
    extra = 0

class RecordAdmin(admin.ModelAdmin):
    fields = ['id', 'name', 'year', 'format', 'cover', 'thumbnail', 'updated']
    inlines = [ArtistInline, TrackInline, ListenInline]
    list_display = ('id', 'get_artist', 'name', 'format', 'updated')
    search_fields = ['name']

admin.site.register(Record, RecordAdmin)

class ArtistAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'updated')
    search_fields = ['name']

admin.site.register(Artist, ArtistAdmin)

class ListenAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon', 'template')
    search_fields = ['name']

admin.site.register(Listen, ListenAdmin)
