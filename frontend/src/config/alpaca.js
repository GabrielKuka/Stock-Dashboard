export const alpaca = {
    api_token: 'PK5H79M3BFG7S451J7WD',
    secret_key: 'Dr8MM3XOnAIczPRUHcvzeW0gFBcJlP1Tn2vlOHV1',
    baseURL: 'https://data.alpaca.markets/v1',
    baseStreamURL: 'wss://data.alpaca.markets/stream'
}

export const auth_data = {
    "action": "authenticate",
    "data": {
        "key_id": alpaca.api_token,
        "secret_key": alpaca.secret_key
    }
}
