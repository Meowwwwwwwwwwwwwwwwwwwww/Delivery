# delivery/orders/serializers.py

from rest_framework import serializers
from django.db import transaction
from .models import Order, OrderItem, MenuItem
from decimal import Decimal

# Serializer for the items within the order request
class OrderItemSerializer(serializers.ModelSerializer):
    # This field is for receiving data from the request (it's NOT a model field)
    menu_item_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)   

    class Meta:
        model = OrderItem
        fields = ['menu_item', 'quantity', 'menu_item_price']
        # The 'price' field (the actual model field) will be set in the parent serializer's create method

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'items', 'created_at', 'total_price', 'user']
        read_only_fields = ['id', 'created_at', 'total_price', 'user']


def create(self, validated_data):
    order_items_data = validated_data.pop('items')
    user = self.context['request'].user
    total_price = Decimal('0.00')

    with transaction.atomic():
        order = Order.objects.create(user=user, total_price=0)

        for item_data in order_items_data:
            menu_item_pk = item_data.pop('menu_item')
            menu_item_instance = MenuItem.objects.get(pk=menu_item_pk)

            price_at_time_of_order = item_data.pop('menu_item_price', menu_item_instance.price)
            quantity = item_data['quantity']

            OrderItem.objects.create(
                order=order,
                menu_item=menu_item_instance,
                quantity=quantity,
                price=price_at_time_of_order
            )

            total_price += price_at_time_of_order * quantity

        # Update total price
        order.total_price = total_price
        order.save()

    return order
