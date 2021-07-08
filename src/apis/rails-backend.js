export const baseURL = 'https://drdelivery2.herokuapp.com';
export const loginAPI = baseURL + '/api/v1/login';
export const customerAPI = baseURL + '/api/v1/customers';
export const custAddressAPI = baseURL + '/api/v1/customers/2/addresses'; // TEMPORARY
export const merchantAPI = baseURL + '/api/v1/merchants';
export const newOrderAPI = baseURL + '/api/v1/newOrder';
export const websocketAPI = 'ws://' + baseURL + '/api/v1/cable';