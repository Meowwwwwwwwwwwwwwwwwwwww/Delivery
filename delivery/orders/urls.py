# orders/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views 

# Create a router instance
router = DefaultRouter()

# Register the ViewSet. The path will be handled by the router.
# The `basename` is used for naming the generated URLs.
router.register(r'', views.OrderViewSet, basename='order') 

urlpatterns = [
    # The router generates /orders/ and /orders/{id}/
    path('', include(router.urls)), 
]