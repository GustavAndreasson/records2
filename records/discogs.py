import requests
import time
import logging
from decouple import config
from django.core.cache import cache
from json.decoder import JSONDecodeError
from pydantic import BaseModel, ValidationError
from typing import TypeVar
from .models import DiscogsAccess
from . import progress

logger = logging.getLogger(__name__)
ACCESS_QUEUE_CACHE_KEY = "DISCOGS_ACCESS_QUEUE_CACHE_KEY"
max_discogs_accesses = 60
time_discogs_accesses = 60


class Image(BaseModel):
    height: int | None = None
    resource_url: str | None = None
    type: str | None = None
    uri: str | None = None
    uri150: str | None = None
    width: int | None = None


class Member(BaseModel):
    active: bool | None = None
    id: int
    name: str
    resource_url: str | None = None


class Group(BaseModel):
    active: bool | None = None
    id: int
    name: str
    resource_url: str | None = None


class FullArtist(BaseModel):
    namevariations: list[str] | None = None
    profile: str | None = None
    releases_url: str | None = None
    resource_url: str | None = None
    uri: str | None = None
    urls: list[str] | None = None
    data_quality: str | None = None
    id: int
    images: list[Image] | None = None
    members: list[Member] | None = None
    groups: list[Group] | None = None


class Rating(BaseModel):
    average: float
    count: int | None = None


class Community(BaseModel):
    data_quality: str | None = None
    have: int | None = None
    rating: Rating | None = None
    status: str | None = None
    want: int | None = None


class Company(BaseModel):
    catno: str | None = None
    entity_type: str | None = None
    entity_type_name: str | None = None
    id: int
    name: str
    resource_url: str | None = None


class Format(BaseModel):
    descriptions: list[str] | None = None
    name: str
    qty: str | None = None


class Identifier(BaseModel):
    type: str
    value: str


class Label(BaseModel):
    catno: str | None = None
    entity_type: str | None = None
    id: int
    name: str
    resource_url: str | None = None


class Video(BaseModel):
    duration: int | None = None
    description: str | None = None
    embed: bool | None = None
    uri: str
    title: str | None = None


class ReleaseArtist(BaseModel):
    join: str | None = None
    name: str
    anv: str | None = None
    tracks: str | None = None
    role: str | None = None
    resource_url: str | None = None
    id: int


class TracklistItem(BaseModel):
    duration: str | None = None
    position: str | None = None
    type_: str | None = None
    title: str
    artists: list[ReleaseArtist] | None = None
    extraartists: list[ReleaseArtist] | None = None


class Master(BaseModel):
    styles: list[str] | None = None
    genres: list[str] | None = None
    videos: list[Video] | None = None
    title: str
    main_release: int
    main_release_url: str | None = None
    uri: str | None = None
    artists: list[ReleaseArtist] | None = None
    versions_url: str | None = None
    year: int | None = None
    images: list[Image] | None = None
    resource_url: str | None = None
    tracklist: list[TracklistItem] | None = None
    id: int
    num_for_sale: int | None = None
    lowest_price: float | None = None
    data_quality: str | None = None


class Release(BaseModel):
    title: str
    id: int
    artists: list[ReleaseArtist] | None = None
    data_quality: str | None = None
    thumb: str | None = None
    community: Community | None = None
    companies: list[Company] | None = None
    country: str | None = None
    date_added: str | None = None
    date_changed: str | None = None
    estimated_weight: int | None = None
    extraartists: list[ReleaseArtist] | None = None
    format_quantity: int | None = None
    formats: list[Format] | None = None
    genres: list[str] | None = None
    identifiers: list[Identifier] | None = None
    images: list[Image] | None = None
    labels: list[Label] | None = None
    lowest_price: float | None = None
    master_id: int | None = None
    master_url: str | None = None
    notes: str | None = None
    num_for_sale: int | None = None
    released: str | None = None
    released_formatted: str | None = None
    resource_url: str | None = None
    series: list | None = None
    status: str | None = None
    styles: list[str] | None = None
    tracklist: list[TracklistItem] | None = None
    uri: str | None = None
    videos: list[Video] | None = None
    year: int | None = None


class ArtistRelease(BaseModel):
    artist: str
    id: int
    main_release: int | None = None
    resource_url: str | None = None
    role: str | None = None
    thumb: str | None = None
    title: str
    type: str | None = None
    year: int | None = None
    format: str | None = None
    label: str | None = None
    status: str | None = None


class BasicInformation(BaseModel):
    id: int
    title: str
    year: int | None = None
    resource_url: str | None = None
    master_id: int | None = None
    thumb: str | None = None
    cover_image: str | None = None
    formats: list[Format] | None = None
    labels: list[Label] | None = None
    artists: list[ReleaseArtist] | None = None
    genres: list[str] | None = None
    styles: list[str] | None = None


class Note(BaseModel):
    field_id: int
    value: str


class CollectionRelease(BaseModel):
    id: int
    instance_id: int | None = None
    folder_id: int | None = None
    rating: int | None = None
    basic_information: BasicInformation
    notes: list[Note] | None = None
    date_added: str | None = None
    role: None = None


class Pagination(BaseModel):
    per_page: int
    items: int
    page: int
    pages: int


class DiscogsError(Exception):
    def __init__(self, code: int, message: str):
        self.code: int = code
        self.message: str = message

    def __str__(self):
        return str(self.code) + ":" + self.message


def getCollection(user_name: str) -> list[CollectionRelease]:
    return __getPaginatedCollection("users/" + user_name + "/collection/folders/0/releases", CollectionRelease)


def getRelease(release_id: int) -> Release:
    try:
        response = __readUri("releases/" + str(release_id))
        return Release.model_validate(response)
    except ValidationError as ve:
        raise DiscogsError(2, ve.json())


def getMaster(master_id: int) -> Master:
    try:
        response = __readUri("masters/" + str(master_id))
        return Master.model_validate(response)
    except ValidationError as ve:
        raise DiscogsError(2, ve.json())


def getArtist(artist_id: int) -> FullArtist:
    try:
        response = __readUri("artists/" + str(artist_id))
        return FullArtist.model_validate(response)
    except ValidationError as ve:
        raise DiscogsError(2, ve.json())


def getArtistReleases(artist_id: int, check_main=True) -> list[ArtistRelease]:
    return __getPaginatedCollection("artists/" + str(artist_id) + "/releases", ArtistRelease, check_main)


T = TypeVar("T", ArtistRelease, CollectionRelease)


def __getPaginatedCollection(uri: str, collectionType: type[T], check_main=False) -> list[T]:
    page = 0
    page_size = 25
    pages = 100
    collection: list[collectionType] = []
    progress.updateProgress("discogs", 0)
    try:
        while True:
            progress.updateProgress("discogs", int((page * 100) / pages))
            page = page + 1
            response = __readUri(uri + "?per_page=" + str(page_size) + "&page=" + str(page))
            try:
                pagination = Pagination.model_validate(response.get("pagination"))
                if pagination.items == 0:
                    break
                releases = [collectionType.model_validate(r) for r in response.get("releases") or []]
                collection.extend(releases)
                pages = pagination.pages
                if page >= pages:
                    break
                if check_main and releases[-1].role != "Main":
                    break
            except ValidationError as ve:
                raise DiscogsError(
                    1,
                    "Collection page not correct. "
                    + uri
                    + "?per_page="
                    + str(page_size)
                    + "&page="
                    + str(page)
                    + "\n"
                    + str(response)
                    + "\n"
                    + str(ve.json()),
                )
    except DiscogsError as de:
        logger.error("Not expected collection response from Discogs:\n" + str(de))
        if page != pages:
            raise
    progress.updateProgress("discogs", 100)
    return collection


def __readUri(uri: str) -> dict:
    global max_discogs_accesses
    accesses = DiscogsAccess.objects.filter(timestamp__gt=int(time.time()) - time_discogs_accesses - 1)
    if len(accesses) >= max_discogs_accesses - 1:
        queue = cache.get(ACCESS_QUEUE_CACHE_KEY, 0)
        if queue > len(accesses):
            wait = time_discogs_accesses + queue - len(accesses) + 1
            logger.warning("Access queue length: " + queue)
        else:
            wait = max(time_discogs_accesses + 1 - (int(time.time()) - accesses[queue].timestamp), 0)
        cache.set(ACCESS_QUEUE_CACHE_KEY, queue + 1)
        logger.debug(
            "Limit reached on discogs accesses with "
            + str(len(accesses))
            + " in last "
            + str(time_discogs_accesses)
            + " seconds. "
            + str(queue)
            + " calls in queue. Waiting "
            + str(wait)
            + " seconds"
        )
        time.sleep(wait)
        queue = cache.get(ACCESS_QUEUE_CACHE_KEY, 1)
        cache.set(ACCESS_QUEUE_CACHE_KEY, queue - 1)
    DiscogsAccess.objects.create(timestamp=time.time())
    headers = {"User-Agent": str(config("DISCOGS_AGENT"))}
    params = {"key": str(config("DISCOGS_KEY")), "secret": str(config("DISCOGS_SECRET"))}
    url = str(config("DISCOGS_BASE_URL")) + uri
    try:
        r = requests.get(url, params=params, headers=headers)
        data = r.json()
        max_discogs_accesses = int(r.headers.get("X-Discogs-Ratelimit", max_discogs_accesses))
        remaining_discogs_accesses = r.headers.get("X-Discogs-Ratelimit-Remaining")
        if remaining_discogs_accesses and ((max_discogs_accesses - len(accesses)) > int(remaining_discogs_accesses)):
            logger.debug(
                "Rate limit remaining: "
                + str(remaining_discogs_accesses)
                + ", expected: "
                + str(max_discogs_accesses - len(accesses))
                + ". Adding dummy request to queue."
            )
            DiscogsAccess.objects.create(timestamp=time.time())
    except requests.exceptions.RequestException as re:
        raise DiscogsError(re.response.status_code if re.response is not None else -1, str(re))
    except JSONDecodeError as je:
        raise DiscogsError(-1, str(je))
    if r.status_code == 429 or data.get("message") == "You are making requests too quickly.":
        logger.error(
            "Too many requests to Discogs "
            + data.get("message")
            + " trying again after "
            + str(time_discogs_accesses)
            + " seconds"
        )
        time.sleep(time_discogs_accesses)
        return __readUri(uri)
    elif r.status_code != 200:
        message = "Error calling " + url
        if data.get("error"):
            message = data["error"].get("message")
        raise DiscogsError(r.status_code, message)
    return data
