from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import home

from django.contrib import admin
urlpatterns = [
    path("admin/", admin.site.urls),
    path("users/", include("users.urls")),
    path("restaurants/", include("restaurants.urls")),
    path('orders/', include('orders.urls')), 
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
