from django.urls import path, include

from .views import (get_stock_data_view,
                    get_stock_lists,
                     )

urlpatterns = [
    path('data/<str:stonk>', get_stock_data_view, name='stock-data'),
    path('lists/get_lists', get_stock_lists, name='stock-lists'),
]
