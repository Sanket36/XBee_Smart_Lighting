from django.db import models


class Node(models.Model):
    NodeId = models.CharField(max_length=50)
    HexAddr = models.CharField(max_length=50)


class InsValue(models.Model):
    NodeId = models.ForeignKey(Node, on_delete=models.CASCADE)
    datetime = models.DateTimeField(auto_now_add=True)
    CurrValue = models.IntegerField(blank=False, null=False)
    TempValue = models.IntegerField(blank=False, null=False)
