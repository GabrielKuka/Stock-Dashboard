from django.urls import path, include

from . import views

urlpatterns = [

    path('register/', views.CreateUserView.as_view(), name='create-user'),
    path('token/', views.CreateTokenView.as_view(), name='create-token'),
    path('me/', views.ManageUserView.as_view(), name='me')

]