from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.db.models import Q
from rest_framework import viewsets
from .models import poems_author,poetry_author,poetry,poems,searchcount
from .serializers import Poems_auSerializer,PoemSerializer,Poetry_auSerializer,PoetrySerializer,searcountSerializer
from rest_framework.response import Response
from drf_multiple_model.pagination import MultipleModelLimitOffsetPagination
from drf_multiple_model.viewsets import FlatMultipleModelAPIViewSet
from .form import poemsauform,poetryauform,poemsform,poetryform,searchcouform
from django.views.decorators.csrf import ensure_csrf_cookie
from django.core import serializers
from hanziconv import HanziConv
from itertools import chain


class LimitPagination(MultipleModelLimitOffsetPagination):
    default_limit = 5
    offset_query_param = 'page'




# 名字查询接口
class nameall(FlatMultipleModelAPIViewSet):
    sorting_field = '-clickcount'
    pagination_class = LimitPagination

    def get_querylist(self):
        name = self.request.query_params.get('name')
        if name != None:
            traditonname = HanziConv.toTraditional(name)
            querylist = (
                {'queryset': poems_author.objects.filter(Q(name__contains=name) | Q(name__contains=traditonname)),
                 'serializer_class': Poems_auSerializer},
                {'queryset': poetry_author.objects.filter(Q(name__contains=name) | Q(name__contains=traditonname)),
                 'serializer_class': Poetry_auSerializer},
            )
            return querylist

# 主查询接口
class poetryall(FlatMultipleModelAPIViewSet):
    sorting_field = '-clickcount'
    pagination_class = LimitPagination

    def get_querylist(self):
        search = self.request.query_params.get('search')
        name = self.request.query_params.get('name')
        if name!=None and search!=None:
            traditonname = HanziConv.toTraditional(name)
            traditonsearch = HanziConv.toTraditional(search)
            querylist=(
                {'queryset': poems.objects.filter(
                    Q(author=name)|Q(author=traditonname),Q(content__contains=search)|Q(title__contains=search)|Q(content__contains=traditonsearch)|Q(title__contains=traditonsearch)),
                    'serializer_class': PoemSerializer},
                {'queryset': poetry.objects.filter(
                    Q(author=name)|Q(author=traditonname),Q(content__contains=search)|Q(title__contains=search)|Q(content__contains=traditonsearch)|Q(title__contains=traditonsearch)),
                    'serializer_class': PoetrySerializer},

            )
        elif search!=None:
            traditonsearch = HanziConv.toTraditional(search)
            querylist = (
                {'queryset': poems_author.objects.filter(Q(name__contains=search)|Q(name__contains=traditonsearch)), 'serializer_class': Poems_auSerializer},
                {'queryset': poetry_author.objects.filter(Q(name__contains=search)|Q(name__contains=traditonsearch)), 'serializer_class': Poetry_auSerializer},
                {'queryset': poems.objects.filter(
                        Q(content__contains=search) | Q(title__contains=search)|Q(content__contains=traditonsearch)|Q(title__contains=traditonsearch)),
                     'serializer_class': PoemSerializer},
                {'queryset': poetry.objects.filter(
                        Q(content__contains=search) | Q(title__contains=search)|Q(content__contains=traditonsearch)|Q(title__contains=traditonsearch)),
                     'serializer_class': PoetrySerializer},
                )
        elif name!=None and search == None:
            traditonname = HanziConv.toTraditional(name)
            querylist = (
                {'queryset': poems.objects.filter(
                    Q(author=name) | Q(author=traditonname)),
                    'serializer_class': PoemSerializer},
                {'queryset': poetry.objects.filter(
                    Q(author=name) | Q(author=traditonname)),
                    'serializer_class': PoetrySerializer},

            )

        return querylist


# 统计点击查询量
def changecount(request):
    functions = {
        'poems': changepoems,
        'poetry': changepoetry,
        'poems_author': changepoems_author,
        'poetry_author': changepoetry_author,
    }
    if request.method == 'POST':
        type = request.POST.get('type')
        result = functions[type](request.POST)
        if result:
            return HttpResponse(status=200)
        else:
            return HttpResponse('SAVE COUNT WRONG')
    else:
        return HttpResponse('resqust method wrong')





def changepoems(postob):
    id = postob.get('id')
    qureyset = poems.objects.get(id=id)
    if qureyset:
        count = qureyset.clickcount
        count = int(count)+1
        f = poemsform(postob, instance=qureyset)
        temp = f.save(commit=False)
        temp.clickcount = count
        temp.save()
        return True
    else:
        return False

def changepoetry(postob):
    id = postob.get('id')
    qureyset = poetry.objects.get(id=id)
    if qureyset:
        count = qureyset.clickcount
        count = int(count)+1
        f = poetryform(postob, instance=qureyset)
        temp = f.save(commit=False)
        temp.clickcount = count
        temp.save()
        return True
    else:
        return False

def changepoems_author(postob):
    id = postob.get('id')
    qureyset = poems_author.objects.get(id=id)
    if qureyset:
        count = qureyset.clickcount
        count = int(count)+1
        f = poemsauform(postob, instance=qureyset)
        temp = f.save(commit=False)
        temp.clickcount = count
        temp.save()
        return True
    else:
        return False


def changepoetry_author(postob):
    id = postob.get('id')
    qureyset = poetry_author.objects.get(id=id)
    if qureyset:
        count = qureyset.clickcount
        count = int(count)+1
        f = poetryauform(postob, instance=qureyset)
        temp = f.save(commit=False)
        temp.clickcount = count
        temp.save()
        return True
    else:
        return False



# 搜索统计
def searchco(request):
    if request.method=='POST':
        count = request.POST.get('count')
        keyword = request.POST.get('keyword')

        qureyset = searchcount.objects.filter(keyword=keyword)
        if len(qureyset)!=0:
            count_data=qureyset.values()[0]['count']   
            f = searchcouform(request.POST, instance=qureyset[0])
            temp = f.save(commit=False)
            temp.count = int(count_data)+1
            temp.save()
            return HttpResponse(status=204)
        else:
            f = searchcouform(request.POST)
            f.save()
            return HttpResponse(status=204)
    else:
        return HttpResponse(status=500)


# 搜索关键字结果
# class searchkey(viewsets.ModelViewSet):
#     serializer_class = searcountSerializer
#
#     def get_queryset(self):
#         queryset = searchcount.objects.order_by('-count')
#         if queryset.count()>=5:
#             queryset = queryset[:5]
#             return queryset
#         else :
#             return queryset

# 搜索关键字结果
def searchkey(request):
    queryset = searchcount.objects.order_by('-count')
    if queryset.count()>=5:
        return HttpResponse(serializers.serialize('json',queryset[:5]))
    else:
        return HttpResponse(serializers.serialize('json',queryset))

# class aurthororder(FlatMultipleModelAPIViewSet):
#     sorting_field = '-clickcount'
#
#     def get_querylist(self):

def aurthorcount(request):
    queryset_T = poetry_author.objects.filter(clickcount__gt=0).order_by('-clickcount')
    queryset_S = poems_author.objects.filter(clickcount__gt=0).order_by('-clickcount')
    result_list = sorted(chain(queryset_S,queryset_T),key=lambda x : x.clickcount,reverse=True)
    count = queryset_T.count()+queryset_S.count()
    if count>= 5:
        data = serializers.serialize('json',result_list[:5])
        return HttpResponse(data)
    else:
        return HttpResponse(serializers.serialize('json',result_list))

# 页面渲染
@ensure_csrf_cookie
def index(request):
    return render(request, 'poetry/poetryhome.html')

@ensure_csrf_cookie
def poetrydetail(request):
    return render(request, 'poetry/poetrydetail.html')

def poetryshow(request):
    return render(request, 'poetry/poetryshow.html')

def dataan(request):
    return render(request,'poetry/dataan.html')
