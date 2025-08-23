from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


class UserSerializer(serializers.ModelSerializer):
class Meta:
model = User
fields = ['id', 'username', 'email', 'role', 'phone', 'address']
read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
password = serializers.CharField(write_only=True)
class Meta:
model = User
fields = ['username', 'email', 'password', 'role', 'phone', 'address']
def validate_password(self, value):
validate_password(value); return value
def create(self, validated_data):
pwd = validated_data.pop('password')
u = User(**validated_data); u.set_password(pwd); u.save(); return u