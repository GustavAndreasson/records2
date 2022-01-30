from django.core.management.base import BaseCommand
from records.models import Record
from records.services.record import downloadCover
from requests.exceptions import RequestException, HTTPError


class Command(BaseCommand):
    help = "Downloads covers to all records"

    def add_arguments(self, parser):
        parser.add_argument('limit', type=int,
                            help="Limit number of downloaded covers")

    def handle(self, *args, **options):
        records = Record.objects.filter(cover_file__isnull=True)[
            :options['limit']]
        for record in records:
            self.stdout.write("Downloading cover for record " + record.name)
            try:
                downloadCover(record)
            except HTTPError as e:
                if e.response.status_code == 429:
                    self.stdout.write("Discogs download limit reached. Wait"
                                      + " for a minute before running again")
                    break
                else:
                    self.stdout.write("Error downloading cover for record "
                                      + record.name + "\n" + str(e))
                    continue
            except RequestException as e:
                self.stdout.write("Error downloading cover for record "
                                  + record.name + "\n" + str(e))
                break
