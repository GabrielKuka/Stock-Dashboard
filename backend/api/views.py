from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from rest_framework import status
from rest_framework.authtoken.models import Token

import requests
from .config import IEX_API_KEY, IEX_BASE_URL

from .models import StockList
from .serializers import StockListSerializer

@api_view(['GET'])
def get_stock_lists(request):

    # Retrieve user id from token
    token = request.headers['Authorization']
    user_id = Token.objects.get(key=token).user_id

    lists = StockList.objects.filter(user=user_id)

    serializer = StockListSerializer(lists, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


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
