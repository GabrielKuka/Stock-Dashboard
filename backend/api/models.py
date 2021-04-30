from django.db import models
from django.conf import settings

from accounts.models import User

class TopList(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    updated_on = models.DateTimeField(auto_now=True)

class Stock(models.Model):

    ISSUETYPES = [
        ('Common Stock', ('cs')),
        ('ETF', ('et')),
        ('Preferred Stock', ('ps')),
        ('Unit', ('ut')),
        ('Warrant', ('wt')),
        ('ADR', ('ad')),
        ('Closed End Fund', ('cef')),
        ('Open Ended Fund', ('oef')),
        ('Right', ('rt')),
        ('Structured Product', ('struct')),
        ('When Issued', ('wi')),
        ('Other', ('')),
    ]

    toplist = models.ForeignKey(TopList, models.SET_NULL, null=True, related_name='stocks')
    ticker = models.CharField(max_length=5, primary_key=True)
    issueType = models.CharField(max_length=50, choices=ISSUETYPES, default='')

    def add_stock(self, stock):
        exists = Stock.objects.filter(ticker=stock['ticker'])
        if(exists.count() > 0):
            # Stock already exists
            print('It already exists')
            return exists.first()
        else:
            new_stock = Stock(ticker=stock['ticker'], issueType=stock['issueType']) 
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