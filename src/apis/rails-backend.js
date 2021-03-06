export const baseURL = 'drdelivery2.herokuapp.com';
// export const baseURL = 'localhost:3000';
// export const baseURL = 'https://hurailstest.herokuapp.com';
const webProtocol = 'https://'
export const loginAPI = webProtocol + baseURL + '/api/v1/login';
export const customerAPI = webProtocol + baseURL + '/api/v1/customers';
export const merchantAPI = webProtocol + baseURL + '/api/v1/merchants';
export const newOrderAPI = webProtocol + baseURL + '/api/v1/newOrder';

export const websocketAPI = 'wss://' + baseURL + '/api/v1/cable';
