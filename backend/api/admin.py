from django.contrib import admin

from .models import StockList, Stock, TopList

admin.site.register(StockList)
admin.site.register(Stock) 
admin.site.register(TopList) 