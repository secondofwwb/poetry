# Generated by Django 2.0.5 on 2018-06-03 03:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('poetry', '0004_auto_20180601_0910'),
    ]

    operations = [
        migrations.CreateModel(
            name='searchcount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('keyword', models.CharField(max_length=150)),
                ('count', models.IntegerField()),
            ],
        ),
    ]
