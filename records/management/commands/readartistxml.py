from lxml import etree
from django.core.management.base import BaseCommand
from records.models import Artist


class Command(BaseCommand):
    help = "Reads artist datadump xml and creates all artists"

    def add_arguments(self, parser):
        parser.add_argument("file", type=str, help="XML file to import")
        parser.add_argument("-s", "--start", type=int, help="Position of first artist to import")
        parser.add_argument("-e", "--end", type=int, help="Position of last artist to import")

    def handle(self, *args, **options):
        self.stdout.write("Counting number of artists in file...")
        with open(options["file"], "r") as f:
            nr_artists = sum(line.count("<artist>") for line in f)
        start = options["start"] if options["start"] else 0
        end = min(options["end"], nr_artists) if options["end"] else nr_artists
        if start > end:
            self.stdout.write("No artists in range")
            return
        if options["start"] or options["end"]:
            self.stdout.write(
                "Importing artists " + str(start) + " to " + str(end) + " of " + str(nr_artists) + " artists"
            )
            nr_artists = end - start + 1
        else:
            self.stdout.write("Importing " + str(nr_artists) + " artists")
        artist_counter = 0
        artists_imported = 0
        loop_counter = 0
        batch_size = 1000
        context = etree.iterparse(options["file"], events=("end",), tag="artist")
        artists_batch = []
        for event, elem in context:
            if loop_counter >= start:
                if (
                    elem.findtext("name")
                    and elem.findtext("id")
                    and not elem.findtext("data_quality") in ("Needs Major Changes", "Entirely Incorrect")
                ):
                    name = elem.findtext("name")
                    sname = name.lower()[:20]
                    artists_batch.append(Artist(id=elem.findtext("id"), name=name, sname=sname))
                    if len(artists_batch) >= batch_size:
                        Artist.objects.bulk_create(
                            artists_batch, update_conflicts=True, update_fields=("name", "sname")
                        )
                        artists_batch = []
                        artists_imported += batch_size
                artist_counter += 1
                if artist_counter % 863 == 1 or artist_counter == nr_artists:
                    progress = (artist_counter / nr_artists) * 100
                    self.stdout.write(
                        "[{0}] {1}% {2}/{3}".format(
                            "#" * int(progress / 2) + " " * (50 - int(progress / 2)),
                            int(progress),
                            artist_counter,
                            nr_artists,
                        ),
                        ending="\r",
                    )
                    self.stdout.flush()
            elem.clear()
            while elem.getprevious() is not None:
                del elem.getparent()[0]
            loop_counter += 1
            if loop_counter > end:
                break
        if artists_batch:
            Artist.objects.bulk_create(
                artists_batch, update_conflicts=True, update_fields=("name", "sname")
            )
            artists_imported += len(artists_batch)
        self.stdout.write("\nArtist import done. " + str(artists_imported) + " artists imported.")
