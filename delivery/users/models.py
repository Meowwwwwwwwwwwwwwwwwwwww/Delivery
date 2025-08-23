from django.db import models

# Create your models here.from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
 CUSTOMER = 'customer' 
 RESTAURANT = 'restaurant'
 DELIVERY = 'delivery'
 ROLE_CHOICES = [
  (CUSTOMER, 'Customer'), (RESTAURANT, 'Restaurant Owner'), (DELIVERY, 'Delivery Partner'),
 ]
role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=CUSTOMER)
phone = models.CharField(max_length=20, blank=True)
address = models.TextField(blank=True)


def __str__(self):
 return f"{self.username} ({self.role})"
