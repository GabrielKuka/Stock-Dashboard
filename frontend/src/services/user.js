import axios from 'axios'

const baseURL = 'http://localhost:8000/'
const accountsURL = `${baseURL}accounts/`
let token = null

const setToken = (newToken) => {
    token = `token ${newToken}`
}

const login = async (credentials) => {
    const response = await axios.post(`${accountsURL}token/`, credentials)
    return response.data
}

const getUser = async () => {
    const config = {
        headers: { Authorization: `${token}`},
    }
    const response = await axios.get(`${accountsURL}me/`, config)
    return response.data
}

const register = async (credentials) => {
    const response = await axios.post(`${accountsURL}register/`, credentials)
    return response.data
}


export default {login, getUser, register, setToken};
