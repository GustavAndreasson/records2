from django.conf.urls import url

from .views import collection
from .views import record
from .views import artist
from .views import progress
from .views import rates

app_name = 'records'
urlpatterns = [
    url(r'^collection/(?P<username>[\w\.\-]+)$',
        collection.getCollection, name='getCollection'),
    url(r'^collection/(?P<username>[\w\.\-]+)/update$',
        collection.updateCollection, name='updateCollection'),
    url(r'^record/(?P<record_id>\d+)$',
        record.getRecord, name='getRecord'),
    url(r'^record/(?P<record_id>\d+)/update$',
        record.updateRecord, name='updateRecord'),
    url(r'^record/(?P<record_id>\d+)/set/(?P<listen_name>\w+)/(?P<listen_key>\w+)$',
        record.setRecordListen, name='setRecordListen'),
    url(r'^artist/(?P<artist_id>\d+)$',
        artist.getArtist, name='getArtist'),
    url(r'^artist/(?P<artist_id>\d+)/update$',
        artist.updateArtist, name='updateArtist'),
    url(r'^artist/(?P<artist_id>\d+)/releases$',
        artist.getArtistReleases, name='getArtistReleases'),
    url(r'^artist/(?P<artist_id>\d+)/releases/update$',
        artist.updateArtistReleases, name='updateArtistReleases'),
    url(r'^artist/autocomplete$',
        artist.getArtistAutocomplete, name='getArtistAutocomplete'),
    url(r'^progress$',
        progress.getProgress, name='getProgress'),
    url(r'^rate/(?P<currency>\w+)$',
        rates.getRate, name='getRate'),
]
