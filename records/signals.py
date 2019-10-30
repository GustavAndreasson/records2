from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.cache import cache
from .models import Record

@receiver(post_save, sender=Record)
def save_record(sender, instance, created, **kwargs):
    if not created:
        cache.delete(instance.get_cache_key())
