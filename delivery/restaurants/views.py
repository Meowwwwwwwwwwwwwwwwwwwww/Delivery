from rest_framework import generics, permissions
from .models import Restaurant, MenuItem
from .serializers import RestaurantSerializer, MenuItemSerializer
from rest_framework.permissions import AllowAny


class RestaurantListView(generics.ListAPIView):
    queryset = Restaurant.objects.filter(is_active=True)
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

class RestaurantDetailView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.filter(is_active=True)
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

class MenuItemListView(generics.ListAPIView):
    queryset = MenuItem.objects.filter(is_available=True)
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class MenuItemDetailView(generics.RetrieveAPIView):
    queryset = MenuItem.objects.filter(is_available=True)
    serializer_class = MenuItemSerializer
    permission_classes = [permissions.IsAuthenticated]

