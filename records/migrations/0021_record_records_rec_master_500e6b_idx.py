# Generated by Django 4.2.8 on 2024-02-21 12:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0020_record_release_country_record_release_year'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='record',
            index=models.Index(fields=['master'], name='records_rec_master_500e6b_idx'),
        ),
    ]
