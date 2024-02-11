from datetime import date
from django.db import DatabaseError
from django.core import files
import requests
from io import BytesIO
from decimal import Decimal
from ..models import (
    Record,
    RecordArtists,
    Format,
    RecordFormats,
    Listen,
    RecordListens,
    Genre,
    Track,
    TrackArtists,
    Artist,
)
from .. import discogs
from .. import spotify
import records.services.artist as artistService
import logging
import re

logger = logging.getLogger(__name__)


def createRecord(id: int, data: dict) -> Record:
    release_id = id
    master_id = data.get("master", release_id + 990000000)
    if data.get("type") == "master":
        master_id = id
        try:
            release_id = Record.objects.filter(master=master_id)[0].id
        except IndexError:
            release_id = data.get("main_release")
    record, created = Record.objects.get_or_create(
        id=release_id,
        defaults={
            "name": data.get("name"),
            "master": master_id,
            "cover": data.get("cover"),
            "thumbnail": data.get("thumbnail"),
            "release_year": data.get("year"),
        },
    )
    if created:
        logger.info("Created record " + record.name + " (" + str(record.id) + ")")
        position = 0
        for r_artist in data.get("artists") or []:
            delimiter = None
            anv = None
            if type(r_artist) is Artist:
                artist = r_artist
            else:
                artist = artistService.createArtist(r_artist.id, r_artist.name)
                delimiter = r_artist.join
                anv = r_artist.anv
            RecordArtists.objects.create(record=record, artist=artist, delimiter=delimiter, anv=anv, position=position)
            position += 1
        r_formats = __getFormats(data.get("format") or [])
        for r_format in r_formats:
            format, created = Format.objects.get_or_create(name=r_format.get("name"))
            if created:
                format.save()
            RecordFormats.objects.create(record=record, format=format, qty=r_format.get("qty"))
        r_genres = (data.get("genres") or []) + (data.get("styles") or [])
        for r_genre in r_genres:
            genre, created = Genre.objects.get_or_create(name=r_genre)
            if created:
                genre.save()
            record.genres.add(genre)
    return record


def updateRecord(record: Record) -> bool:
    logger.info("Updating record " + record.name + " (" + str(record.id) + ")")
    try:
        release_data = discogs.getRelease(record.id)
        __updateDataWithMasterData(release_data)
        record.master = release_data.master_id
        __updateArtists(record, release_data.artists or [])
        record.track_set.all().delete()  # type: ignore
        if release_data.tracklist:
            for track_data in release_data.tracklist:
                __createTrack(record, track_data)
        if release_data.images:
            old_cover = record.cover
            record.cover = release_data.images[0].uri
            record.thumbnail = release_data.images[0].uri150
            if old_cover != record.cover:
                try:
                    downloadCover(record)
                except requests.exceptions.RequestException as e:
                    logger.error(
                        "Error when downloading cover art for " + record.name + " (" + str(record.id) + ")\n" + str(e)
                    )
        __updateListens(record, release_data.videos or [])
        record.release_year = release_data.year
        record.release_country = release_data.country
        if release_data.formats:
            RecordFormats.objects.filter(record=record).delete()
            r_formats = __getFormats(release_data.formats)
            for r_format in r_formats:
                format, created = Format.objects.get_or_create(name=r_format.get("name"))
                if created:
                    format.save()
                RecordFormats.objects.create(record=record, format=format, qty=r_format.get("qty"))
        if release_data.lowest_price:
            record.price = Decimal(release_data.lowest_price)
        if release_data.genres or release_data.styles:
            r_genres = (release_data.genres or []) + (release_data.styles or [])
            if set(r_genres) != set(record.genres.all()):
                record.genres.clear()
                for r_genre in r_genres:
                    genre, created = Genre.objects.get_or_create(name=r_genre)
                    if created:
                        genre.save()
                    record.genres.add(genre)
        record.updated = date.today()
        record.save()
    except discogs.DiscogsError as de:
        logger.info("Did not find record " + record.name + " (" + str(record.id) + ") on discogs\n" + str(de))
        return False
    except DatabaseError as de:
        logger.error("Could not update record " + record.name + " (" + str(record.id) + ")\n" + str(de))
        return False
    return True


def __updateDataWithMasterData(release_data: discogs.Release) -> None:
    if release_data.master_id:
        try:
            master_data = discogs.getMaster(release_data.master_id)
            release_data.year = master_data.year
            if not release_data.images:
                if master_data.images:
                    release_data.images = master_data.images
            if not release_data.videos:
                if master_data.videos:
                    release_data.videos = master_data.videos
        except discogs.DiscogsError as de:
            logger.info(
                "Did not find master for record "
                + str(release_data.title)
                + " ("
                + str(release_data.id)
                + ") on discogs\n"
                + str(de)
            )
    else:
        release_data.master_id = int(release_data.id or 0) + 990000000


def __updateArtists(record: Record, artists: list[discogs.ReleaseArtist]) -> None:
    RecordArtists.objects.filter(record=record).delete()
    position = 0
    for r_artist in artists:
        artist = artistService.createArtist(r_artist.id, r_artist.name)
        RecordArtists.objects.create(
            record=record, artist=artist, delimiter=r_artist.join, anv=r_artist.anv, position=position
        )
        position += 1


def __updateListens(record: Record, videos: list[discogs.Video]) -> None:
    try:
        spotify_listen = Listen.objects.get(name="spotify")
        if RecordListens.objects.filter(record=record, listen=spotify_listen).count() == 0:
            try:
                spotify_id = spotify.getAlbumId(record.get_artist(), record.name)
                if spotify_id:
                    RecordListens.objects.create(record=record, listen=spotify_listen, listen_key=spotify_id)
            except spotify.SpotifyError as se:
                logger.error("Request to spotify failed:\n" + str(se))
    except Listen.DoesNotExist:
        logger.error("Spotify listen does not exist")
    if videos:
        try:
            youtube_listen = Listen.objects.get(name="youtube")
            RecordListens.objects.filter(record=record, listen=youtube_listen).delete()
            for video in videos:
                if "youtube" in video.uri and "v=" in video.uri:
                    youtube_key = video.uri[video.uri.find("v=") + 2 :]
                    if (
                        RecordListens.objects.filter(
                            record=record, listen=youtube_listen, listen_key=youtube_key
                        ).count()
                        == 0
                    ):
                        RecordListens.objects.create(
                            record=record, listen=youtube_listen, listen_key=youtube_key, name=video.title
                        )
        except Listen.DoesNotExist:
            logger.error("Youtube listen does not exist")


def __getFormats(format_data: list[discogs.Format]) -> list[dict]:
    if not format_data:
        return []
    formats_dup = []
    for format in format_data:
        format_string = str(format.name)
        if format.descriptions:
            desc = re.search(r'(\d[\d\.\,½]*)"|(LP)', " ".join(format.descriptions or []))
            if desc:
                format_string += desc.group(1) or desc.group(2)
        formats_dup.append({"name": format_string.replace(" ", "-"), "qty": int(format.qty or "0")})
    formats = []
    for format in formats_dup:
        qty = sum(f.get("qty") if f.get("name") == format.get("name") else 0 for f in formats_dup)
        if not any(f.get("name") == format.get("name") for f in formats):
            formats.append({"name": format.get("name"), "qty": qty})
    return formats


def __createTrack(record: Record, track_data: discogs.TracklistItem):
    track = Track.objects.create(position=track_data.position, name=track_data.title, record=record)
    if track_data.artists:
        position = 0
        for t_artist in track_data.artists or []:
            artist = artistService.createArtist(t_artist.id, t_artist.name)
            TrackArtists.objects.create(track=track, artist=artist, delimiter=t_artist.join, position=position)
            position += 1


def downloadCover(record: Record) -> bool:
    if not record.cover:
        return False
    if record.cover[-10:] == "spacer.gif":
        record.cover = None
        return True
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    }
    resp = requests.get(record.cover, headers=headers)
    resp.raise_for_status()
    fp = BytesIO()
    fp.write(resp.content)
    record.cover_file.save(str(record.id) + ".jpg", files.File(fp))
    return False


def getReleases(release_list: list[str]) -> dict[str, Record]:
    releases = {}
    for release_id in release_list:
        try:
            releases[release_id] = Record.objects.get(id=int(release_id))
        except (Record.DoesNotExist, Record.MultipleObjectsReturned):
            pass
    return releases


def getMasters(master_list: list[str]) -> dict[str, Record]:
    masters = {}
    for master_id in master_list:
        try:
            masters[master_id] = Record.objects.filter(master=int(master_id))[0]
        except IndexError:
            pass
    return masters
