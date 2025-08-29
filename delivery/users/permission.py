from rest_framework.permissions import BasePermission


class IsRestaurantOwner(BasePermission):
 def has_permission(self, request, view):
  return request.user.is_authenticated and request.user.role == 'restaurant'


class IsDeliveryPartner(BasePermission):
 def has_permission(self, request, view):
  return request.user.is_authenticated and request.user.role == 'delivery'