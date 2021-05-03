from django.test import TestCase, Client
from django.urls import reverse
import json
from api import helper 
import requests
from accounts.models import User

class TestApi(TestCase):
    """ API tests """
    API_URL = 'http://localhost:8000/api'

    def setUp(self):
        self.client = Client()

    def test_get_stock_data(self):
        result = helper.get_stock_data(stonk='AAPL') 
        self.assertEqual('Apple Inc', result['name'])
        self.assertEquals(8, len(result))

    def test_create_top_list(self):
        view_url = reverse('create-top-list')
        test_user = User.objects.create(email='test@test.com', 
                                            name='test', 
                                            phone='0698567596', 
                                            birthday='1998-03-24', 
                                            password='test')
        data = {'user_email':'test@test.com'}

        response = self.client.post(view_url, data)
        print(response.content)

        self.assertEquals(response.status_code, 201)