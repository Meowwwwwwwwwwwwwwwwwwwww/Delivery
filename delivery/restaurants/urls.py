from django.urls import path
from .views import RestaurantListView, RestaurantDetailView, MenuItemListView, MenuItemDetailView

urlpatterns = [
    path("", RestaurantListView.as_view(), name="restaurant-list"),
    path("<int:pk>/", RestaurantDetailView.as_view(), name="restaurant-detail"),
    path("menu/", MenuItemListView.as_view(), name="menu-list"),
    path("menu/<int:pk>/", MenuItemDetailView.as_view(), name="menu-detail"),
]
