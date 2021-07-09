export const baseURL = 'https://drdelivery2.herokuapp.com';
// export const baseURL = 'http://localhost:3000';
// export const baseURL = 'https://hurailstest.herokuapp.com';
export const loginAPI = baseURL + '/api/v1/login';
export const customerAPI = baseURL + '/api/v1/customers';
export const merchantAPI = baseURL + '/api/v1/merchants';
export const newOrderAPI = baseURL + '/api/v1/newOrder';

export const websocketAPI = 'ws://' + baseURL.substring(8) + '/api/v1/cable';
