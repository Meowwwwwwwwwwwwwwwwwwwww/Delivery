from rest_framework import serializers
from .models import Restaurant, MenuItem

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ["id", "name", "description", "price", "is_available"]

class RestaurantSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)  # matches related_name='menu_items'

    class Meta:
        model = Restaurant
        fields = ["id", "name", "address", "is_active", "menu_items"]
