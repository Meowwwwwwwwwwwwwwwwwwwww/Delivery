import os
from pathlib import Path
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent  # Delivery/delivery
PROJECT_ROOT = BASE_DIR.parent                     # Delivery/
STATIC_URL = '/static/'


STATICFILES_DIRS = [
                   
                           # Django static
]

STATIC_ROOT = BASE_DIR / "staticfiles"

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key secret in production!

SECRET_KEY = "django-insecure-CHANGE_THIS_TO_A_RANDOM_SECRET_KEY"
DEBUG = True
ALLOWED_HOSTS = ["*"]

# Custom user model
AUTH_USER_MODEL = "users.User"

# Application definition
INSTALLED_APPS = [
   
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party apps
    "rest_framework",
    "drf_spectacular",
    "django_filters",
    "corsheaders",
    'rest_framework.authtoken',
    
       



    # Your apps
    
    "users",
    "orders",
    "restaurants",
    "delivery",
    
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",  # required
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",  # required
    "django.contrib.messages.middleware.MessageMiddleware",  # required
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # for CORS
]

ROOT_URLCONF = "delivery.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "delivery.wsgi.application"

# Database (SQLite for dev)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "Delivery",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "localhost",  
        "PORT": "5432",       
    }
}


# Password validators
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# Static & media



 # for prod (collectstatic)

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# DRF settings

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
         'rest_framework.authentication.TokenAuthentication',
    ),
    "DEFAULT_PERMISSION_CLASSES": (
         'rest_framework.permissions.IsAuthenticated',
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "user": "2000/day",
        "anon": "200/day",
    },
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.OrderingFilter",
        "rest_framework.filters.SearchFilter",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# API docs

SPECTACULAR_SETTINGS = {
    "TITLE": "Food Delivery API",
    "DESCRIPTION": "Local food delivery backend (restaurants, menus, orders)",
    "VERSION": "1.0.0",
}

# CORS

CORS_ALLOW_ALL_ORIGINS =  True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # your React dev server
]