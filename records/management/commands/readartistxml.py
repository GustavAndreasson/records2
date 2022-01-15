from lxml import etree
from django.core.management.base import BaseCommand
from records.services.artist import createArtist


class Command(BaseCommand):
    help = "Reads artist datadump xml and creates all artists"

    def add_arguments(self, parser):
        parser.add_argument('file', type=str)

    def handle(self, *args, **options):
        self.stdout.write("Counting number of artists in file...")
        with open(options['file'], 'r') as f:
            nr_artists = sum(line.count('<artist>') for line in f)
        self.stdout.write("Importing " + str(nr_artists) + " artists")
        counter = 1
        context = etree.iterparse(
            options['file'], events=('end',), tag='artist')
        for event, elem in context:
            if not elem.find('data_quality').text in ('Needs Major Changes',
                                                      'Entirely Incorrect'):
                createArtist(elem.find('id').text, elem.find('name').text)
            counter += 1
            progress = (counter / nr_artists) * 100
            self.stdout.write(
                "[{0}] {1}%".format('#'*int(progress/2)
                                    + ' '*(50-int(progress/2)),
                                    int(progress)),
                ending='\r')
            self.stdout.flush()
            elem.clear()
            while elem.getprevious() is not None:
                del elem.getparent()[0]
        self.stdout.write("\nArtist import done")
