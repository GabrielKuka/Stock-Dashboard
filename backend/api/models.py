from django.db import models
from django.conf import settings

class Stock(models.Model):

    ticker = models.CharField(max_length=5, primary_key=True)

    def add_stock(self, stock):
        exists = Stock.objects.filter(ticker=stock)
        if(exists.count() > 0):
            # Stock already exists
            print('it already exists')
            return exists.first()
        else:
            new_stock = Stock(ticker=stock) 
            new_stock.save()
            return new_stock

    def __str__(self):
        return self.ticker

class StockList(models.Model):

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=20, unique=True) 
    stocks = models.ManyToManyField(Stock)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
