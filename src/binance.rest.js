import axios from 'axios';

export const getAccountInfo = () => {
    return axios.get(`https://api.binance.com/api/v3/exchangeInfo`);
}