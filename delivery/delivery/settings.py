import os
from pathlib import Path
from corsheaders.defaults import default_headers
from datetime import timedelta 
import dj_database_url
# Use a library for robust environment management, like python-decouple or environ
# For simplicity, we'll stick to os.environ for demonstration.

# --- Environment Setup (CRITICAL CHANGE) ---
# Fetch the SECRET_KEY from an environment variable. 
# Only use the hardcoded default for local development.
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY", 
    "django-insecure-CHANGE_THIS_TO_A-RANDOM-SECRET-KEY" # ⚠️ SAFE DEFAULT for Dev Only
) 

# Set DEBUG based on an environment variable, default to True for local development
DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

BASE_DIR = Path(__file__).resolve().parent.parent

# -----------------------------
# 1. CORE SECURITY & ENVIRONMENT
# -----------------------------
if not DEBUG:
    # ⚠️ PRODUCTION MODE: Must list exact allowed hosts (domains and subdomains)
    # Get hosts from an environment variable (e.g., "host1.com,host2.com")
    try:
        ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS").split(",")
    except Exception:
         # Fallback to specific URLs if ENV var is missing, but best to use ENV
         ALLOWED_HOSTS = [
             "delivery-b5az.vercel.app",
             "delivery-production-252e.up.railway.app"
         ]
else:
    # DEVELOPMENT MODE
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
    
    # ⚠️ Recommended for cloud storage if not using WhiteNoise for media
    # "storages", 

    # Your apps
    "users",
    "orders",
    "restaurants",
    "delivery",
]

# -----------------------------
# 3. MIDDLEWARE (WhiteNoise moved up for performance)
# -----------------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware", 
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware", # ⬆️ Moved up: Recommended by WhiteNoise docs
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "delivery.urls"


# -----------------------------
# Static & Media (Note on Cloud Storage)
# -----------------------------
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "frontend_build" / "assets"]  # React JS/CSS
STATIC_ROOT = BASE_DIR / "staticfiles"

# ⚠️ For production, consider using django-storages and S3/GCS for MEDIA
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
# 4. DATABASE (Use a robust DB in production)
# -----------------------------
# ⚠️ If using a production DB (like Postgres), you should use a library 
# like dj-database-url to parse the ENV var.
# Example Production DB Setup (Requires 'pip install dj-database-url psycopg2-binary')
 # Import at the top

# ... inside DATABASES ...
# settings.py (Check this in your committed code)

# ...
DATABASES = {
    'default': dj_database_url.config(
        # This line must be present to read the Railway ENV variable
        default='sqlite:///' + os.path.join(BASE_DIR, 'db.sqlite3'), 
        conn_max_age=600,
    )
}
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

# -----------------------------
# 5. Django REST Framework (DRF)
# -----------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
       "rest_framework.permissions.AllowAny", # Fine for a public API, restrict in views
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
# 6. DJOSER CONFIGURATION
# -----------------------------
DJOSER = {
    'USER_CREATE_PASSWORD_RETYPE': False, 
    'TOKEN_MODEL': None, 
    'SERIALIZERS': {
        'user_create': 'djoser.serializers.UserCreateSerializer',
        'user': 'djoser.serializers.UserSerializer',
    }
}

# -----------------------------
# 7. SIMPLE JWT CONFIGURATION (CRITICAL CHANGE)
# -----------------------------
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    # ⚠️ Security Fix: SIGNING_KEY must be a secret. Using DJANGO_SECRET_KEY as a fallback.
    "SIGNING_KEY": os.environ.get("JWT_SIGNING_KEY", SECRET_KEY), 
    "ROTATE_REFRESH_TOKENS": False,
    "ALGORITHM": "HS256",
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
# 8. CORS & API Docs (CRITICAL CHANGE)
# -----------------------------

# API docs
SPECTACULAR_SETTINGS = {
    "TITLE": "Food Delivery API",
    "DESCRIPTION": "Local food delivery backend (restaurants, menus, orders)",
    "VERSION": "1.0.0",
}

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://delivery-b5az.vercel.app",
]
# ⚠️ Security Fix: Use DEBUG to control all-origins access. 
# Only True in development, False in production.
CORS_ALLOW_ALL_ORIGINS = DEBUG

CORS_ALLOW_HEADERS = list(default_headers) + [
    "authorization",
    "content-type",
]

CORS_ALLOW_CREDENTIALS = True 

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

CSRF_TRUSTED_ORIGINS = [
    "https://midnightmunch.in",
    "https://www.midnightmunch.in",
    "https://*.railway.app",
    "https://*.up.railway.app",
]
ALLOWED_HOSTS = [
    "midnightmunch.in",
    "www.midnightmunch.in",
    ".railway.app",
    ".up.railway.app",
    "localhost",
    "127.0.0.1",
]
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
