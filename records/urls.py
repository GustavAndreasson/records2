from django.urls import path, re_path

from .views import collection
from .views import record
from .views import artist
from .views import progress
from .views import rates

app_name = "records"
urlpatterns = [
    re_path(r"^collection/(?P<username>[\w\.\-]+)$", collection.getCollection, name="getCollection"),
    re_path(r"^collection/(?P<username>[\w\.\-]+)/update$", collection.updateCollection, name="updateCollection"),
    path("record/<int:record_id>", record.getRecord, name="getRecord"),
    path("record/<int:record_id>/update", record.updateRecord, name="updateRecord"),
    re_path(
        r"^record/(?P<record_id>\d+)/set/(?P<listen_name>\w+)/(?P<listen_key>\w+)$",
        record.setRecordListen,
        name="setRecordListen",
    ),
    path("artist/<int:artist_id>", artist.getArtist, name="getArtist"),
    path("artist/<int:artist_id>/update", artist.updateArtist, name="updateArtist"),
    path("artist/<int:artist_id>/releases", artist.getArtistReleases, name="getArtistReleases"),
    path("artist/<int:artist_id>/releases/update", artist.updateArtistReleases, name="updateArtistReleases"),
    path("artist/autocomplete", artist.getArtistAutocomplete, name="getArtistAutocomplete"),
    path("progress", progress.getProgress, name="getProgress"),
    re_path(r"^rate/(?P<currency>\w+)$", rates.getRate, name="getRate"),
]
