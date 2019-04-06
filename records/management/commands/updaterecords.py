from django.core.management.base import BaseCommand
from records.models import Record
from records.discogs import getRelease, getMaster
from records.services import updateRecord
import json

class Command(BaseCommand):
    help = "Loads extra info to all records"

    def add_arguments(self, parser):
        parser.add_argument('nr', type=int)

    def handle(self, *args, **options):
        records = Record.objects.filter(updated__isnull=True)[:options['nr']]
        for record in records:
            release_data = getRelease(record.id)
            #self.stdout.write("Release Data:")
            #self.stdout.write(json.dumps(release_data))
            if release_data.get('master_id'):
                master_data = getMaster(release_data.get('master_id'))
                #self.stdout.write("Master Data:")
                #self.stdout.write(json.dumps(master_data))
                release_data['year'] = master_data.get('year')
                if not release_data.get('images'):
                    if master_data.get('images'):
                        release_data['images'] = master_data.get('images')
            self.stdout.write("Updating record " + record.name)
            updateRecord(record, release_data)
