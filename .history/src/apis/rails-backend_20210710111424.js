// export const baseURL = 'https://drdelivery2.herokuapp.com';
export const baseURL = 'localhost:3000';
// export const baseURL = 'https://hurailstest.herokuapp.com';
export const loginAPI = 'https://' + baseURL + '/api/v1/login';
export const customerAPI = 'https://' + baseURL + '/api/v1/customers';
export const custAddressAPI = 'https://' + baseURL + '/api/v1/customers/2/addresses'; // TEMPORARY
export const merchantAPI = 'https://' + baseURL + '/api/v1/merchants';
export const newOrderAPI = 'https://' + baseURL + '/api/v1/newOrder';

export const websocketAPI = 'ws://' + baseURL + '/api/v1/cable';
