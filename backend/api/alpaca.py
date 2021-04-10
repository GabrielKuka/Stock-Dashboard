import websocket, json

baseUrl = 'https://paper-api.alpaca.markets'
api_key = 'PK2SHB7J8CDRIG2QJYE7'
api_secret = 'dWr71FlmFobNoWRtVVYomEPOP43yp4lP8sBbHgG9'

def on_open(ws):
    print('Opened')


def on_message(ws, message):
    print("Message: {}".format(message))

def on_close(ws):
    print('Closed')

socket = "wss://data.alpaca.markets/stream"

ws = websocket.WebSocketApp(socket, on_open=on_open, on_close=on_close, on_message=on_message)

ws.run_forever()