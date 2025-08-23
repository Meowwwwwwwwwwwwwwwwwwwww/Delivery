from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer
from .models import User


class RegisterView(generics.CreateAPIView):
queryset = User.objects.all()
serializer_class = RegisterSerializer
permission_classes = [permissions.AllowAny]a


class MeView(generics.RetrieveUpdateAPIView):
serializer_class = UserSerializer
def get_object(self):
return self.request.user