from rest_framework import serializers
from .models import StockList, Stock, TopList


class StockListSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockList
        fields = ('__all__')

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ('__all__')

class TopListSerializer(serializers.ModelSerializer):
    stocks = StockSerializer(many=True)
    class Meta:
        model = TopList 
        fields = ('__all__')