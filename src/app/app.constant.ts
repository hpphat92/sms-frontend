export const AppConstant = {
  clientId: '1',
  clientSecret: '',
  domain: VARS.API_DOMAIN,
  accountId: VARS.ACCOUNT_ID,
  auth0: {
    domain: VARS.auth0.domain,
    clientID: VARS.auth0.clientID,
    redirectUri: VARS.auth0.redirectUri,
    connection: VARS.auth0.connection
  },
  format: {
    fullDate: 'MM/dd/yyyy HH:mm',
    moment: {
      sortDate: 'YYYY-MM-DD'
    }
  },
  idleTimeout: 1800 // seconds
};
