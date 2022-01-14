from lxml import etree
from django.core.management.base import BaseCommand
from records.services.artist import createArtist


class Command(BaseCommand):
    help = "Reads artist datadump xml and creates all artists"

    def add_arguments(self, parser):
        parser.add_argument('file', type=str)

    def handle(self, *args, **options):
        context = etree.iterparse(
            options['file'], events=('end',), tag='artist')
        for event, elem in context:
            if not elem.find('data_quality').text in ('Needs Major Changes',
                                                      'Entirely Incorrect'):
                createArtist(elem.find('id').text, elem.find('name').text)
            elem.clear()
            while elem.getprevious() is not None:
                del elem.getparent()[0]
