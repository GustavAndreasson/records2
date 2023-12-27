# Generated by Django 3.2.20 on 2023-12-27 15:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('records', '0015_auto_20231222_1145'),
    ]

    operations = [
        migrations.CreateModel(
            name='Format',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, unique=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='record',
            name='format',
        ),
        migrations.CreateModel(
            name='RecordFormats',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qty', models.IntegerField(blank=True, null=True)),
                ('format', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='records.format')),
                ('record', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='records.record')),
            ],
        ),
        migrations.AddField(
            model_name='record',
            name='formats',
            field=models.ManyToManyField(through='records.RecordFormats', to='records.Format'),
        ),
    ]
