# Generated by Django 2.0.5 on 2018-06-04 09:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('poetry', '0005_searchcount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='poems',
            name='author',
            field=models.CharField(db_index=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='poems',
            name='content',
            field=models.TextField(db_index=True),
        ),
        migrations.AlterField(
            model_name='poems',
            name='title',
            field=models.CharField(db_index=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='poems_author',
            name='name',
            field=models.CharField(db_index=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='poetry',
            name='author',
            field=models.CharField(db_index=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='poetry',
            name='content',
            field=models.TextField(db_index=True),
        ),
        migrations.AlterField(
            model_name='poetry',
            name='title',
            field=models.CharField(db_index=True, max_length=150),
        ),
        migrations.AlterField(
            model_name='poetry_author',
            name='name',
            field=models.CharField(db_index=True, max_length=150),
        ),
    ]
