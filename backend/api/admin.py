from django.contrib import admin

from .models import StockList, Stock

admin.site.register(StockList)
admin.site.register(Stock)