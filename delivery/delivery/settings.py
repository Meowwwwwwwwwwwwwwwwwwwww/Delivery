import os
from pathlib import Path
import dj_database_url
from corsheaders.defaults import default_headers
from datetime import timedelta # Imported here to be available for SIMPLE_JWT

BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------
# 1. CORE SECURITY & ENVIRONMENT
# -----------------------------
SECRET_KEY = "django-insecure-CHANGE_THIS_TO_A_RANDOM_SECRET_KEY"
DEBUG = True
ALLOWED_HOSTS = ["*"]

# Custom user model
AUTH_USER_MODEL = "users.User"

# -----------------------------
# 2. APPLICATIONS
# -----------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "drf_spectacular",
    "django_filters",
    "djoser",

    # Your apps
    "users",
    "orders",
    "restaurants",
    "delivery",
]

# -----------------------------
# 3. MIDDLEWARE
# -----------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # must be high
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    
]

ROOT_URLCONF = "delivery.urls"


STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "frontend_build" / "assets"]  # React JS/CSS
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "frontend_build"],
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

# -----------------------------
# 4. DATABASE
# -----------------------------
#DATABASES = {
 #   "default": {
  #      "ENGINE": "django.db.backends.postgresql",
   #     "NAME": "Delivery",
    #    "USER": "postgres",
    #    "PASSWORD": "postgres",
     #   "HOST": "localhost",
      #  "PORT": "5432",
   #}}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# Static & Media


# -----------------------------
# 5. Django REST Framework (DRF)
# -----------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # Keeps IsAuthenticated globally. Djoser will typically handle permissions 
    # for /users/ registration automatically (AllowAny).
    "DEFAULT_PERMISSION_CLASSES": (
       "rest_framework.permissions.AllowAny",
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
}

# -----------------------------
# 6. DJOSER CONFIGURATION (CRITICAL for User Endpoints)
# -----------------------------
DJOSER = {
    # Ensures password confirmation is required during registration
    'USER_CREATE_PASSWORD_RETYPE': False, 
    # Use JWT for token management
    'TOKEN_MODEL': None, 
    'SERIALIZERS': {
        'user_create': 'djoser.serializers.UserCreateSerializer',
        'user': 'djoser.serializers.UserSerializer',
    }
}

# -----------------------------
# 7. SIMPLE JWT CONFIGURATION
# -----------------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": "YOUR_SUPER_SECRET_KEY", # !!! REPLACE WITH A REAL, SECRET KEY !!!
    "VERIFYING_KEY": None,
    "AUDIENCE": None,
    "ISSUER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
}


# -----------------------------
# 8. CORS & API Docs
# -----------------------------

# API docs
SPECTACULAR_SETTINGS = {
    "TITLE": "Food Delivery API",
    "DESCRIPTION": "Local food delivery backend (restaurants, menus, orders)",
    "VERSION": "1.0.0",
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_HEADERS = list(default_headers) + [
    "authorization",
    "content-type",
]

CORS_ALLOW_CREDENTIALS = True 
CORS_ALLOW_ALL_ORIGINS = True

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"



# ... other settings

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', 'postgres://user:pass@host:port/dbname'),
        conn_max_age=600
    )
}