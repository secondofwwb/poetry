from django.db import models

# Create your models here.


# 宋词
class poems(models.Model):
    title = models.CharField(max_length=150)
    content = models.TextField()
    author_id = models.IntegerField()
    dynasty = models.CharField(max_length=10)
    author = models.CharField(max_length=150)
    id = models.IntegerField(primary_key=True)
    clickcount = models.IntegerField(default=0)


# 宋词作者
class poems_author(models.Model):
    id = models.IntegerField(primary_key=True)
    dynasty = models.CharField(max_length=10)
    name = models.CharField(max_length=150)
    intro_l = models.TextField()
    intro_s = models.TextField()
    clickcount = models.IntegerField(default=0)


# 唐诗
class poetry(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=150)
    dynasty = models.CharField(max_length=10)
    content = models.TextField()
    author = models.CharField(max_length=150,)
    author_id = models.IntegerField()
    yunlv_rule = models.TextField()
    clickcount = models.IntegerField(default=0)


# 唐诗作者信息
class poetry_author(models.Model):
    id = models.IntegerField(primary_key=True)
    dynasty = models.CharField(max_length=10)
    name = models.CharField(max_length=150)
    intro = models.TextField()
    clickcount = models.IntegerField(default=0)


# 统计查询量
class searchcount(models.Model):
    keyword = models.CharField(max_length=150)
    count = models.IntegerField()