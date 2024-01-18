from django.core.management.base import BaseCommand
from records.models import Record
from records.services.record import downloadCover, updateRecord
from requests.exceptions import RequestException, HTTPError


class Command(BaseCommand):
    help = "Downloads covers to all records"

    def add_arguments(self, parser):
        parser.add_argument("limit", type=int, help="Limit number of downloaded covers")

    def handle(self, *args, **options):
        records = Record.objects.filter(cover_file__exact="")[: options["limit"]]
        for record in records:
            self.stdout.write("Downloading cover for record " + record.name)
            try:
                if downloadCover(record):
                    record.save()
            except HTTPError as e:
                if e.response and e.response.status_code == 429:
                    self.stdout.write("Discogs download limit reached. Wait for a minute before running again")
                    break
                elif e.response and e.response.status_code == 404:
                    self.stdout.write(
                        "Cover file for record " + record.name + " is missing on discogs. Updating record.\n"
                    )
                    updateRecord(record)
                    continue
                else:
                    self.stdout.write("Error downloading cover for record " + record.name + "\n" + str(e))
                    continue
            except RequestException as e:
                self.stdout.write("Error downloading cover for record " + record.name + "\n" + str(e))
                break
