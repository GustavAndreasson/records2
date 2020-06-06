from django.conf.urls import url

from . import views

app_name = 'records'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^collection/(?P<username>[\w\.\-]+)$', views.getCollection, name='getCollection'),
    url(r'^collection/(?P<username>[\w\.\-]+)/update$', views.updateCollection, name='updateCollection'),
    url(r'^record/(?P<record_id>\d+)$', views.getRecord, name='getRecord'),
    url(r'^record/(?P<record_id>\d+)/update$', views.updateRecord, name='updateRecord'),
    url(r'^record/(?P<record_id>\d+)/set/(?P<listen_name>\w+)/(?P<listen_key>\w+)$', views.setRecordListen, name='setRecordListen'),
    url(r'^artist/(?P<artist_id>\d+)$', views.getArtist, name='getArtist'),
    url(r'^artist/(?P<artist_id>\d+)/update$', views.updateArtist, name='updateArtist'),
    url(r'^artist/(?P<artist_id>\d+)/releases$', views.getArtistReleases, name='getArtistReleases'),
    url(r'^artist/(?P<artist_id>\d+)/releases/update$', views.getArtistReleases, name='updateArtistReleases'),
    url(r'^progress$', views.getProgress, name='getProgress'),
]
