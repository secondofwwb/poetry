from .models import poetry_author,poems_author,poems,poetry,searchcount
from rest_framework import serializers


class PoemSerializer(serializers.ModelSerializer):
    class Meta:
        model = poems
        fields = '__all__'


class PoetrySerializer(serializers.ModelSerializer):
    class Meta:
        model = poetry
        fields = '__all__'


class Poetry_auSerializer(serializers.ModelSerializer):
    class Meta:
        model = poetry_author
        fields = '__all__'

class Poems_auSerializer(serializers.ModelSerializer):
    class Meta:
        model = poems_author
        fields = '__all__'

class searcountSerializer(serializers.ModelSerializer):
    class Meta:
        model = searchcount
        fields = '__all__'