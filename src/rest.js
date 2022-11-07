import axios from 'axios';
import { sha256 } from 'js-sha256';

const API_PATH = 'https://ftx.com/api';
const API_KEY = 'oFgcxZFNz5I96fGqsZplCOzTgwsQ0tUAHvwW_suC';
const API_SECRET = 'zkNPaS-evEyv_HlkQ_E33UN6XtKmSOLbzerLxar0';

const convertGetParams = data => {
    var str = [];
    for (var property in data)
        if (data[property] !== undefined)
            str.push(encodeURIComponent(property) + "=" + encodeURIComponent(data[property]));
    return str.join("&");
}

const ftxRequest = (path, method = 'GET', data) => {
    const now = Date.now();
    const getParams = (method === 'GET' && data) ? `?${convertGetParams(data)}` : '';
    const _data = data ? JSON.stringify(data) : '';

    const ftxSign = sha256.hmac(
        API_SECRET,
        now + method + '/api' + path + getParams + _data
    );

    const requestConfig = {
        method,
        url: API_PATH + path + getParams,
        data,
        headers: {
            'FTX-KEY': API_KEY,
            'FTX-TS': now,
            'FTX-SIGN': ftxSign,
            'FTX-SUBACCOUNT': 'shakeOutCatcher',
        },
    };

    const fetch = () => axios(requestConfig)
        .then(data => data.data.result)
        .catch(error => {
            const errorResponse = error && error.response && error.response.data;

            const errorData = [method, path, JSON.stringify(data) || 'no data'];
            console.log(`--==error==--`);
            console.log(`request: ${errorData.join('|')}`);
            console.log(`response: ${errorResponse}`);

            throw new Error(error);
        });

    return fetch();
};
