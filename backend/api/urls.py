from django.urls import path, include

from .views import (get_stock_data_view,
                    get_stock_lists,
                    get_list,
                    delete_list,
                    add_list
                     )

urlpatterns = [
    path('data/<str:stonk>', get_stock_data_view, name='stock-data'),
    path('lists/get_lists', get_stock_lists, name='stock-lists'),
    path('lists/get_list/<str:title>', get_list, name='stock-list'),
    path('lists/delete/<int:id>', delete_list, name='delete-list'),
    path('lists/addlist', add_list, name='add-list'),
]
