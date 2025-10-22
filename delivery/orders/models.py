# delivery/orders/models.py

from decimal import Decimal
from django.db import models
from django.contrib.auth.models import User

from django.conf import settings# Assuming standard User model

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name

class Order(models.Model):
    user = models.ForeignKey(
                  settings.AUTH_USER_MODEL, # Correct way to reference the User model
                  on_delete=models.CASCADE
                   )
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, default=Decimal('0.00'))

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    
    # 💡 IMPORTANT: This field 'price' is assumed to store the unit price 
    # at the time of order, replacing the passed 'menu_item_price'.
    price = models.DecimalField(max_digits=6, decimal_places=2,default=Decimal('0.00')) 
    
    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name}"