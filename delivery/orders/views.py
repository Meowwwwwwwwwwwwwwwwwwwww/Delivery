from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer

# ViewSet for the /orders/ endpoint
# In your orders app's views.py
from rest_framework import generics

# Make sure you are using a class that supports POST (Create)
class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    # You might also need to override perform_create to set the user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# In your main project urls.py or app urls.py
from django.urls import path
from .views import OrderListCreateView

urlpatterns = [
    # This path maps the ListCreateView to the /orders/ URL
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'), 
]

#### **2. If you are using a `ViewSet` (Recommended):**

#Ensure your `OrderViewSet` inherits from `ModelViewSet` or at least includes the necessary mixins (`ListModelMixin`, `CreateModelMixin`). If you're using a router, this is usually automatic:

#```python
# In your orders app's views.py
from rest_framework import viewsets

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    # ModelViewSet supports both GET (List) and POST (Create) out of the box.

#Once you've made the necessary changes to your Django backend, restart your server, and the `Place Order & Pay` button should successfully send the `POST` request. Let me know when you've updated the backend and are ready to test again!