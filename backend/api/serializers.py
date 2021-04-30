from rest_framework import serializers
from .models import StockList, Stock


class StockListSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockList
        fields = ('__all__')

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ('__all__')