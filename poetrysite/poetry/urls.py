from django.urls import path,include
from rest_framework import routers

from . import views



router = routers.SimpleRouter()
router.register('api', views.poetryall, base_name='poetryall')
router.register('api/name',views.nameall, base_name='nameall')
# router.register('api/searchkey',views.searchkey, base_name='searchkey')

urlpatterns = [
    path('', include(router.urls)),
    path('index/',views.index),
    path('poetrydetail/',views.poetrydetail),
    path('poetrydetail/poetryshow/', views.poetryshow),
    path('api/changecount/',views.changecount),
    path('api/searchcount/',views.searchco),
    path('api/searchkey/',views.searchkey),
    path('api/authorcount/',views.aurthorcount),
    path('dataan/',views.dataan),
]
