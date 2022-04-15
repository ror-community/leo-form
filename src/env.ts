export const env = () => {
    const {
      VUE_APP_BASE_ROUTE: BASE_ROUTE = '/',
      VUE_APP_GENERATE_ID: GENERATE_ID = 'http://localhost:5000/generateid?mode=dev',
      VUE_APP_ADDRESS_URL: ADDRESS_URL = 'http://localhost:5000/address',
      NODE_ENV
    } = process.env;
    return { BASE_ROUTE, GENERATE_ID, ADDRESS_URL, NODE_ENV };
  };