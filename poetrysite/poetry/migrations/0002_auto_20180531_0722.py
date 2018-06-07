# Generated by Django 2.0.5 on 2018-05-31 07:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('poetry', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='poems',
            name='dynasty',
            field=models.CharField(default='宋', max_length=10),
        ),
        migrations.AlterField(
            model_name='poems_author',
            name='dynasty',
            field=models.CharField(default='宋', max_length=10),
        ),
        migrations.AlterField(
            model_name='poetry',
            name='dynasty',
            field=models.CharField(default='唐', max_length=10),
        ),
        migrations.AlterField(
            model_name='poetry_author',
            name='dynasty',
            field=models.CharField(default='唐', max_length=10),
        ),
    ]
