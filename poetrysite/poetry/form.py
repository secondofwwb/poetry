from django.forms import ModelForm
from .models import poetry_author,poems_author,poetry,poems,searchcount



class poetryauform(ModelForm):
    class Meta:
        model = poetry_author
        fields = ['clickcount', ]


class poetryform(ModelForm):
    class Meta:
        model = poetry
        fields = ['clickcount', ]


class poemsform(ModelForm):
    class Meta:
        model = poems
        fields = ['clickcount',]


class poemsauform(ModelForm):
    class Meta:
        model = poems_author
        fields = ['clickcount', ]

class searchcouform(ModelForm):
    class Meta:
        model = searchcount
        fields = ['count','keyword']