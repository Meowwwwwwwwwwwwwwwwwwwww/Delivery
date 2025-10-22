from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView 
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

    # 5. Djoser JWT URLs (Optional, as 3 covers it, but good to know)
    # path('', include('djoser.urls.jwt')), 
    
    # Note on 'users.urls': The previous path('', include('users.urls')) 
    # caused conflicts with Djoser's /users/ endpoint. If you have custom 
    # user views, include them under a unique path like:
    # path('app-users/', include('users.urls')),
]
