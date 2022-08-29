export const env = () => {
  const {
    VUE_APP_BASE_ROUTE: BASE_ROUTE = '/',
    VUE_APP_GENERATE_ID: GENERATE_ID = 'https://generateid.staging.ror.org/generateid',
    VUE_APP_ADDRESS_URL: ADDRESS_URL = 'https://generateid.staging.ror.org/address',
    NODE_ENV
  } = process.env
  return { BASE_ROUTE, GENERATE_ID, ADDRESS_URL, NODE_ENV }
}
