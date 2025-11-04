from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 
from django.views.generic import TemplateView
from django.urls import re_path
# Removed: from .views import home (Unresolved import)

urlpatterns = [
    # 1. Django Admin
    path("admin/", admin.site.urls),
    
    # 2. DJOSER Core URLs (REQUIRED FOR /users/ REGISTRATION)
    # By including 'djoser.urls' at the root path, the registration endpoint 
    # for user creation (POST) is correctly exposed at /users/.
    path('', include('djoser.urls')), 

    # 3. Custom JWT Token Endpoints (Login and Refresh)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # 4. Application URLs
    path("restaurants/", include("restaurants.urls")),
    path('orders/', include('orders.urls')), 
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
  

]
