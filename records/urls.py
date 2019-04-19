from django.conf.urls import url

from . import views

app_name = 'records'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^collection/(?P<username>[\w\.]+)/get/(?P<data_level>\d+)$', views.getCollection, name='getCollection'),
    url(r'^collection/(?P<username>[\w\.]+)/update$', views.updateCollection, name='updateCollection'),
    url(r'^record/(?P<record_id>\d+)/set/(?P<listen_name>\w+)/(?P<listen_key>\w+)$', views.setRecordListen, name='setRecordListen'),
    url(r'^artist/get/(?P<artist_id>\d+)$', views.getArtist, name='getArtist'),
    url(r'^artist/update/(?P<artist_id>\d+)$', views.updateArtist, name='updateArtist'),
]
