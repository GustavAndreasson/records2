# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-10-28 20:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0007_record_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=7, null=True),
        ),
    ]