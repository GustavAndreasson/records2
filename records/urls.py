from django.conf.urls import url

from . import views

app_name = 'records'
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^collection/get$', views.getCollection, name='getCollection'),
    url(r'^collection/set/(?P<user_id>[0-9]+)$', views.setCollection, name='setCollection'),
    url(r'^collection/update$', views.updateCollection, name='updateCollection'),
    url(r'^artist/get/(?P<artist_id>[0-9]+)$', views.getArtist, name='getArtist'),
    url(r'^artist/update/(?P<artist_id>[0-9]+)$', views.updateArtist, name='updateArtist'),
]
