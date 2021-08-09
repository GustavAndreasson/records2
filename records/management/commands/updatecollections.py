from django.core.management.base import BaseCommand
from records.models import DiscogsUser
from records.services.collection import updateCollection


class Command(BaseCommand):
    help = "Updates collections for all users"

    def handle(self, *args, **options):
        users = DiscogsUser.objects.all()
        for user in users:
            self.stdout.write("Updating collection for user " + user.username)
            updateCollection(user)
