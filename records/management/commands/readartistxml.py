from lxml import etree
from django.core.management.base import BaseCommand
from records.services.artist import createArtist


class Command(BaseCommand):
    help = "Reads artist datadump xml and creates all artists"

    def add_arguments(self, parser):
        parser.add_argument('file', type=str,
                            help="XML file to import")
        parser.add_argument('-s', '--start', type=int,
                            help="Position of first artist to import")
        parser.add_argument('-e', '--end', type=int,
                            help="Position of last artist to import")

    def handle(self, *args, **options):
        self.stdout.write("Counting number of artists in file...")
        with open(options['file'], 'r') as f:
            nr_artists = sum(line.count('<artist>') for line in f)
        start = options['start'] if options['start'] else 0
        end = min(options['end'], nr_artists) if options['end'] else nr_artists
        if start > end:
            self.stdout.write("No artists in range")
            return
        if options['start'] or options['end']:
            self.stdout.write("Importing " + str(end - start + 1) + " of "
                              + str(nr_artists) + " artists")
            nr_artists = end - start + 1
        else:
            self.stdout.write("Importing " + str(nr_artists) + " artists")
        artist_counter = 0
        loop_counter = 0
        context = etree.iterparse(
            options['file'], events=('end',), tag='artist')
        for event, elem in context:
            if loop_counter >= start:
                if not elem.find('data_quality').text in ('Needs Major Changes',
                                                          'Entirely Incorrect'):
                    createArtist(elem.find('id').text, elem.find('name').text)
                artist_counter += 1
                progress = (artist_counter / nr_artists) * 100
                self.stdout.write(
                    "[{0}] {1}%".format('#'*int(progress/2)
                                        + ' '*(50-int(progress/2)),
                                        int(progress)),
                    ending='\r')
                self.stdout.flush()
            elem.clear()
            while elem.getprevious() is not None:
                del elem.getparent()[0]
            loop_counter += 1
            if loop_counter > end:
                break
        self.stdout.write("\nArtist import done")
