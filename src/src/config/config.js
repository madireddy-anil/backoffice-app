const authApi = process.env.REACT_APP_AUTH_API_URL
const transactionsApi = process.env.REACT_APP_TRANSACTIONS_API_URL
const currencyAccountsApi = process.env.REACT_APP_CURRENCY_ACCOUNTS_API_URL
const clientConnectApi = process.env.REACT_APP_CLIENT_CONNECT_API_URL
const reportsApi = process.env.REACT_APP_REPORTS_API_URL
const chatApi = process.env.REACT_APP_CHAT_API_URL
const env = process.env.REACT_APP_ENVIRONMENT
const fileUploadApi = process.env.REACT_APP_FILE_UPLOAD_API
const websocketURL = process.env.REACT_APP_WEBSOCKET_URL
const gppURL = process.env.REACT_APP_GPP_URL
const ppBeneficiaryApi = process.env.REACT_APP_BENEFICIARY_URL

export default {
  authApi,
  transactionsApi,
  reportsApi,
  chatApi,
  env,
  fileUploadApi,
  websocketURL,
  currencyAccountsApi,
  clientConnectApi,
  gppURL,
  ppBeneficiaryApi,
}
