from rest_framework import serializers
from .models import Order, OrderItem, MenuItem
from django.db import transaction

# Serializer for reading/listing OrderItem details
class OrderItemSerializer(serializers.ModelSerializer):
    total_price = serializers.ReadOnlyField() 
    
    class Meta:
        model = OrderItem
        fields = ['id', 'name', 'quantity', 'unit_price', 'total_price']

# Serializer for the main Order model (Used for listing and creation)
class OrderSerializer(serializers.ModelSerializer):
    # This is the field the frontend sends in the POST request: [{id: 1, qty: 2}, ...]
    cart_items = serializers.ListField(write_only=True)
    
    # This is the field returned in the response (nested OrderItems)
    items = OrderItemSerializer(many=True, read_only=True)
    
    total_amount = serializers.ReadOnlyField() # Model property
    
    class Meta:
        model = Order
        # Fields for reading/listing
        fields = ['id', 'order_id', 'user', 'status', 'created_at', 'total_amount', 'delivery_charge', 'items', 'cart_items']
        # The user, ID, and calculated fields are read-only
        read_only_fields = ['id', 'order_id', 'user', 'status', 'created_at', 'total_amount', 'delivery_charge', 'items']

    @transaction.atomic
    def create(self, validated_data):
        # 1. Pop the cart data from the request
        cart_items_data = validated_data.pop('cart_items', [])
        
        # 2. Create the main Order object (user is passed via the ViewSet context)
        order = Order.objects.create(**validated_data) # Status defaults to 'PENDING'

        # 3. Process each item and create OrderItem snapshots
        for item_data in cart_items_data:
            menu_item_id = item_data.get('id')
            quantity = item_data.get('qty')
            
            try:
                # Retrieve the MenuItem to get the current price and name
                menu_item = MenuItem.objects.get(pk=menu_item_id, is_available=True)
            except MenuItem.DoesNotExist:
                raise serializers.ValidationError(
                    f"Menu item ID {menu_item_id} is not available."
                )

            # 4. Create the OrderItem, recording the price/name snapshot
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                name=menu_item.name,
                quantity=quantity,
                unit_price=menu_item.price, # Use the current DB price
            )

        return order
