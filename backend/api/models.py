from django.db import models
from django.conf import settings

from accounts.models import User

class TopList(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    updated_on = models.DateTimeField(auto_now=True)

class Stock(models.Model):

    toplist = models.ForeignKey(TopList, models.SET_NULL, null=True)
    ticker = models.CharField(max_length=5, primary_key=True)
    isETF = models.BooleanField(False)

    def add_stock(self, stock):
        exists = Stock.objects.filter(ticker=stock['ticker'])
        if(exists.count() > 0):
            # Stock already exists
            print('it already exists')
            return exists.first()
        else:
            new_stock = Stock(ticker=stock['ticker'], isETF=stock['isETF']) 
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