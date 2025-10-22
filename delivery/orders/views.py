# delivery/orders/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer

# This corresponds to the traceback line: rest_framework/viewsets.py line 124
class OrderViewSet(viewsets.ModelViewSet):
    # You were hitting the 'create' action (POST /orders/)
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    # Ensure user is set on the order object
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)