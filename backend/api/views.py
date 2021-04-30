from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework import status
from rest_framework.authtoken.models import Token

from .config import IEX_API_KEY, IEX_BASE_URL

from .models import StockList, Stock, TopList
from .serializers import StockListSerializer, StockSerializer, TopListSerializer

from accounts.models import User

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
        stonks = serializer.data['stocks']
        serializer.data.pop('stocks')

        for i in range(0, len(stonks)):
            s = Stock.objects.get(ticker=stonks[i])
            stonks[i] = {'ticker': s.ticker, 'issueType': s.issueType}

        serializer.data['stocks'] = stonks

        return Response(serializer.data, status=status.HTTP_200_OK)

    except StockList.DoesNotExist as e:
        return Response({'Error': 'Does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def add_list(request):

    # Retrieve user id
    token = request.headers['Authorization']
    user = Token.objects.get(key=token).user

    payload = request.data

    try:
        new_list = StockList(user=user, title=payload['title'])
        new_list.save()
        for stock in payload['stocks']:
            new_stock = Stock().add_stock(stock)
            new_list.stocks.add(new_stock)
    except:
        return Response({'error': 'Error creating list'}, status=status.HTTP_400_BAD_REQUEST)

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
        list_item = StockList.objects.filter(user=user, id=id).first()
    except StockList.DoesNotExist as e:
        return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

    data = {}

    # Update list 
    list_item.stocks.clear()
    list_item.title = title
    for ticker in tickers:
        new_stock = Stock().add_stock(ticker)
        list_item.stocks.add(new_stock) 
    list_item.save()
    data['success'] = 'Update successful'

    return Response(data=data)


@api_view(['GET'])
def check_title(request, title):

    try:
        query = StockList.objects.get(title=title)
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

@api_view(['GET'])
def get_stock_data_view(request, stonk):

    url = '{}stable/stock/{}/company?token={}'.format(IEX_BASE_URL, stonk, IEX_API_KEY)
    url_for_logo = '{}stable/stock/{}/logo?token={}'.format(IEX_BASE_URL, stonk, IEX_API_KEY)

    logo = requests.get(url_for_logo).json()['url']

    data_response = requests.get(url).json()

    company = {
        'name': data_response['companyName'],
        'logo': logo,
        'description': data_response['description'],
        'industry': data_response['industry'],
        'ceo': data_response['CEO'],
    } 

    return Response(company)

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

        toplist = TopList(user=user)
        toplist.save()

        stonks = []

        stonks.append(Stock().add_stock({'ticker': 'SPY', 'issueType': 'et'}))
        stonks.append(Stock().add_stock({'ticker': 'QQQ', 'issueType': 'et'}))
        stonks.append(Stock().add_stock({'ticker': 'DIA', 'issueType': 'et'}))

        for stonk in stonks:
            stonk.toplist = toplist
            stonk.save()

        return Response({"status":'Created'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"status":str(e)}, status=status.HTTP_400_BAD_REQUEST) 
