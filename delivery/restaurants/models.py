from django.db import models

# Create your models here.
from django.db import models
from users.models import User


class Restaurant(models.Model):
owner = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'role': 'restaurant'})
name = models.CharField(max_length=120)
address = models.TextField()
phone = models.CharField(max_length=20, blank=True)
is_open = models.BooleanField(default=True)


def __str__(self):
return self.name


class OpeningHour(models.Model):
restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='opening_hours')
day_of_week = models.IntegerField(choices=[(i, i) for i in range(7)]) # 0=Mon
open_time = models.TimeField(); close_time = models.TimeField()


class MenuItem(models.Model):
restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_items')
name = models.CharField(max_length=120)
description = models.TextField(blank=True)
price = models.DecimalField(max_digits=8, decimal_places=2)
is_available = models.BooleanField(default=True)
image = models.ImageField(upload_to='menu/', blank=True, null=True)


def __str__(self):
return