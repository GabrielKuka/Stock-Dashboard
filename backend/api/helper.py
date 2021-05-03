import requests

def get_stock_data(stonk):
    from .config import IEX_API_KEY, IEX_BASE_URL
    url = '{}stable/stock/{}/company?token={}'.format(IEX_BASE_URL, stonk, IEX_API_KEY)
    url_for_logo = '{}stable/stock/{}/logo?token={}'.format(IEX_BASE_URL, stonk, IEX_API_KEY)

    logo = requests.get(url_for_logo).json()['url']

    data_response = requests.get(url).json()

    company = {
        'ticker': stonk,
        'name': data_response['companyName'],
        'logo': logo,
        'description': data_response['description'],
        'industry': data_response['industry'],
        'sector': data_response['sector'],
        'issueType': data_response['issueType'],
        'ceo': data_response['CEO'],
    } 

    return company