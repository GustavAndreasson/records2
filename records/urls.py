from django.conf.urls import url

from . import views

app_name = 'records'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^collection/get$', views.getCollection, name='getCollection'),
    url(r'^collection/set/(?P<user_id>\d+)$', views.setCollection, name='setCollection'),
    url(r'^collection/update$', views.updateCollection, name='updateCollection'),
    url(r'^record/(?P<record_id>\d+)/set/(?P<listen_name>\w+)/(?P<listen_key>\w+)$', views.setRecordListen, name='setRecordListen'),
    #url(r'^record/(?P<record_id>\d+)/set/youtubeid/(?P<youtube_id>\w+)$', views.setRecordYoutubeId, name='setRecordYoutubeId'),
    url(r'^artist/get/(?P<artist_id>\d+)$', views.getArtist, name='getArtist'),
    url(r'^artist/update/(?P<artist_id>\d+)$', views.updateArtist, name='updateArtist'),
]
