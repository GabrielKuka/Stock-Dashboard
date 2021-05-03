from django.urls import path, include

from . import views

urlpatterns = [
    path('lists/get_lists', views.get_stock_lists, name='stock-lists'),
    path('lists/get_list/<str:title>', views.get_list, name='stock-list'),
    path('lists/delete/<int:id>', views.delete_list, name='delete-list'),
    path('lists/addlist', views.add_list, name='add-list'),
    path('lists/editlist/<int:id>', views.edit_list, name='edit-list'),
    path('lists/checktitle/<str:title>', views.check_title, name='check-title'),

    path('lists/toplist/gettoplist', views.get_top_list, name='get-top-list'),
    path('lists/toplist/edittoplist', views.edit_top_list, name='edit-top-list'),
    path('lists/toplist/deletetoplist', views.delete_top_list, name='delete-top-list'),
    path('lists/toplist/createtoplist', views.create_top_list, name='create-top-list')
]
