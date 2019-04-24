from django.core.management.base import BaseCommand
from records.models import Record
from records.services import updateRecord

class Command(BaseCommand):
    help = "Loads extra info to all records"

    def add_arguments(self, parser):
        parser.add_argument('nr', type=int)

    def handle(self, *args, **options):
        records = Record.objects.filter(updated__isnull=True)[:options['nr']]
        for record in records:
            self.stdout.write("Updating record " + record.name)
            updateRecord(record)
