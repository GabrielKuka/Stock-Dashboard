from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import HttpResponse

from rest_framework import status
from rest_framework.authtoken.models import Token

from .config import IEX_API_KEY, IEX_BASE_URL

from .models import StockList, Stock, TopList
from .serializers import StockListSerializer, StockSerializer, TopListSerializer

from accounts.models import User
from api import helper

import requests

@api_view(['GET'])
def get_stock_lists(request):

    # Retrieve user id from token
    token = request.headers['Authorization']
    user_id = Token.objects.get(key=token).user_id

    lists = StockList.objects.filter(user=user_id)

    serializer = StockListSerializer(lists, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_list(request, title):

    # Retrieve token
    token = request.headers['Authorization']
    user_id = Token.objects.get(key=token).user_id

    try:
        my_list = StockList.objects.get(title=title, user=user_id)

        serializer = StockListSerializer(my_list)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except StockList.DoesNotExist as e:
        return Response({'Error': 'Does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def add_list(request):

    # Retrieve user id
    token = request.headers['Authorization']
    user = Token.objects.get(key=token).user

    payload = request.data

    print(payload)

    try:
        new_list = StockList(user=user, title=payload['title'])
        new_list.save()
        for stock in payload['stocks']:
            new_stock = Stock().add_stock(stock)
            new_list.stocks.add(new_stock)
    except:
        return Response({'status': 'Error creating list'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_201_CREATED)

@api_view(['PUT'])
def edit_list(request, id):
    # Retrieve user id
    token = request.headers['Authorization']
    user = Token.objects.get(key=token).user

    payload = request.data
    title = payload['title']
    tickers = payload['tickers']

    try:
        # Get the list
        list_item = StockList.objects.filter(user=user, id=id).first()

        # Store result
        data = {}

        # Update list 
        list_item.stocks.clear()
        list_item.title = title

        # Add new stocks
        for ticker in tickers:
            new_stock = Stock().add_stock(ticker)
            list_item.stocks.add(new_stock) 

        # Save list
        list_item.save()
        data['status'] = 'Update successful'

        return Response(data=data)
    except StockList.DoesNotExist as e:
        return Response({'status': str(e)}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def check_title(request, title):

    # Retrieve user id
    token = request.headers['Authorization']
    user = Token.objects.get(key=token).user

    try:
        query = StockList.objects.get(title=title, user=user)
    except:
        return Response({'status': True}, status=status.HTTP_200_OK)
    
    return Response({'status': False}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_list(request, id):

    try:
        my_list = StockList.objects.get(id=id)
    except StockList.DoesNotExist as e:
        return Response({"Error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    data = {}

    operation = my_list.delete()

    if operation:
        data['success'] = 'Delete successful'
    else:
        data['failure'] = 'Delete failed'
    
    return Response(data=data, status=status.HTTP_204_NO_CONTENT)

# Top List Views
@api_view(['GET'])
def get_top_list(request):
     
    # Retrieve token
    token = request.headers['Authorization']
    user = Token.objects.get(key=token).user

    try:
        toplist = TopList.objects.get(user=user)
        serializer = TopListSerializer(toplist)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except TopList.DoesNotExist as e:
        return Response({"Error":str(e)}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def edit_top_list(request):

    # Retrieve token
    token = request.headers['Authorization']
    user_id = Token.objects.get(key=token).user_id

    payload = request.data

    # Edit list here
    return Response({"status": 'Not ready'}, status=status.HTTP_200_OK)
        
@api_view(['DELETE'])
def delete_top_list(request):

    # Retrieve token
    token = request.headers['Authorization']
    user_id = Token.objects.get(key=token).user_id

    # Delete list here
    return Response({"status": 'Not ready'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_top_list(request):

    user_email = request.data['user_email']
    user = User.objects.get(email=user_email)

    try:
        # Create toplist
        toplist = TopList(user=user)
        toplist.save()

        # Create the list of stocks
        stonks = []
        stonks.append(Stock().add_stock('SPY'))
        stonks.append(Stock().add_stock('QQQ'))
        stonks.append(Stock().add_stock('DIA'))

        # Add them to toplist
        toplist.stocks.add(*stonks)

        return Response({"status":'Created'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"status":str(e)}, status=status.HTTP_400_BAD_REQUEST) 
