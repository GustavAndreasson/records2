# -*- coding: utf-8 -*-
# Generated by Django 1.11.22 on 2020-06-06 08:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0009_record_master'),
    ]

    operations = [
        migrations.AddField(
            model_name='artist',
            name='collectionUpdated',
            field=models.DateField(blank=True, null=True),
        ),
    ]
