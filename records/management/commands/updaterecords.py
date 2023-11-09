from django.core.management.base import BaseCommand
from records.models import Record
from records.services.record import updateRecord


class Command(BaseCommand):
    help = "Loads extra info to all records"

    def add_arguments(self, parser):
        parser.add_argument("limit", type=int, help="Limit number of updated records")

    def handle(self, *args, **options):
        records = Record.objects.filter(updated__isnull=True)[: options["limit"]]
        for record in records:
            self.stdout.write("Updating record " + record.name)
            updateRecord(record)
