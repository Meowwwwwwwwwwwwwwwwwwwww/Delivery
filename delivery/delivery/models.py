from django.db import models

class MenuCategory(models.Model):
    name = models.CharField(max_length=100)

class MenuItem(models.Model):
    category = models.ForeignKey(MenuCategory, related_name="items", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    desc = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    img = models.URLField()
    tag = models.CharField(max_length=50, blank=True, null=True)
