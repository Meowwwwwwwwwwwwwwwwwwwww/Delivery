import os


TEMPLATES = [{
'BACKEND': 'django.template.backends.django.DjangoTemplates',
'DIRS': [BASE_DIR / 'templates'],
'APP_DIRS': True,
'OPTIONS': {
'context_processors': [
'django.template.context_processors.debug',
'django.template.context_processors.request',
'django.contrib.auth.context_processors.auth',
'django.contrib.messages.context_processors.messages',
],
},
}]


WSGI_APPLICATION = 'food_delivery.wsgi.application'


# Database via DATABASE_URL (sqlite or postgres)
DB_URL = os.getenv('DATABASE_URL', f"sqlite:///{BASE_DIR / 'db.sqlite3'}")
if DB_URL.startswith('sqlite'):
DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'db.sqlite3'}}
else:
u = urlparse(DB_URL)
DATABASES = {'default': {
'ENGINE': 'django.db.backends.postgresql',
'NAME': u.path[1:], 'USER': u.username, 'PASSWORD': u.password,
'HOST': u.hostname, 'PORT': u.port or '5432',
}}


AUTH_PASSWORD_VALIDATORS = [
{'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
{'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
]


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True


STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.User'


REST_FRAMEWORK = {
'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
'DEFAULT_PERMISSION_CLASSES': ('rest_framework.permissions.IsAuthenticated',),
'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
'DEFAULT_THROTTLE_CLASSES': [
'rest_framework.throttling.UserRateThrottle',
'rest_framework.throttling.AnonRateThrottle',
],
'DEFAULT_THROTTLE_RATES': {
'user': '2000/day',
'anon': '200/day',
},
'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
'PAGE_SIZE': 20,
'DEFAULT_FILTER_BACKENDS': (
'django_filters.rest_framework.DjangoFilterBackend',
'rest_framework.filters.OrderingFilter',
'rest_framework.filters.SearchFilter',
),
}


SPECTACULAR_SETTINGS = {
'TITLE': 'Food Delivery API',
'DESCRIPTION': 'Local food delivery backend (restaurants, menus, orders)',
'VERSION': '1.0.0',
}


CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL', 'True') == 'True'