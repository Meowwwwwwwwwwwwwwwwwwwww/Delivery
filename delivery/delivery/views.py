from rest_framework import viewsets
from .models import MenuCategory
from .serializers import MenuCategorySerializer
from django.http import HttpResponse

class MenuCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuCategory.objects.prefetch_related("items")
    serializer_class = MenuCategorySerializer

def home(request):
    return HttpResponse("Welcome to the Food Delivery API!")