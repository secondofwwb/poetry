# Generated by Django 2.0.5 on 2018-05-25 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='poems',
            fields=[
                ('title', models.CharField(max_length=150)),
                ('content', models.TextField()),
                ('author_id', models.IntegerField()),
                ('dynasty', models.CharField(max_length=10)),
                ('author', models.CharField(max_length=150)),
                ('id', models.IntegerField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='poems_author',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('dynasty', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=150)),
                ('intro_l', models.TextField()),
                ('intro_s', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='poetry',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=150)),
                ('dynasty', models.CharField(max_length=10)),
                ('content', models.TextField()),
                ('author', models.CharField(max_length=150)),
                ('author_id', models.IntegerField()),
                ('yunlv_rule', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='poetry_author',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('dynasty', models.CharField(max_length=10)),
                ('name', models.CharField(max_length=150)),
                ('intro', models.TextField()),
            ],
        ),
    ]
