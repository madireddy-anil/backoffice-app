import { all, takeEvery, put, call } from 'redux-saga/effects'
// import { getPaymentsClients, getPaymentsVendor, getCompanies } from 'utilities/transformer'
import axiosMethod from '../../utilities/apiCaller'

import actions from './actions'

const { txnPrivateGet, cAPrivateGet, clientConnectPrivateGet } = axiosMethod

const getCurrencies = token => {
  return cAPrivateGet('currencies?limit=0', token).then(response => {
    return response.data.data.currency
  })
}

export function* getAllCurrencies(values) {
  const { token } = values
  try {
    const response = yield call(getCurrencies, token)
    yield put({
      type: actions.GET_CURRENCIES_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CURRENCIES_FAILURE,
      payload: err,
    })
  }
}

const getCountries = token => {
  return cAPrivateGet('countries?limit=0', token).then(response => {
    return response.data.data.country
  })
}

export function* getAllCountries(values) {
  const { token } = values
  try {
    const response = yield call(getCountries, token)
    yield put({
      type: actions.GET_COUNTRIES_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_COUNTRIES_FAILURE,
      payload: err,
    })
  }
}

const getCurrenciesByAccountID = (accountID, token) => {
  return txnPrivateGet(`currency/supported-currencies/${accountID}`, token).then(response => {
    return response.data.data
  })
}

export function* getCurrenciesByAccountId(payload) {
  const { accountId, token } = payload
  try {
    const response = yield call(getCurrenciesByAccountID, accountId, token)
    yield put({
      type: actions.GET_CURRENCIES_BY_ACCOUNT_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CURRENCIES_BY_ACCOUNT_ID_FAILURE,
      payload: err,
    })
  }
}

const getIntroducers = token => {
  return clientConnectPrivateGet(`entities/introducers?limit=0`, token).then(response => {
    const introducers = response.data.data.entities.filter(
      item => !!item.genericInformation.registeredCompanyName,
    )
    return introducers
  })
}

export function* getAllIntroducers(values) {
  const { token } = values
  try {
    const response = yield call(getIntroducers, token)
    yield put({
      type: actions.GET_INTRODUCERS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_INTRODUCERS_FAILURE,
      payload: err,
    })
  }
}

const getMerchants = token => {
  return clientConnectPrivateGet(`entities/clients?limit=0`, token).then(response => {
    const merchants = response.data.data.entities.filter(
      item => !!item.genericInformation.registeredCompanyName,
    )
    return merchants
  })
}

export function* getAllMerchants(values) {
  const { token } = values
  try {
    const response = yield call(getMerchants, token)
    yield put({
      type: actions.GET_MERCHANTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_MERCHANTS_FAILURE,
      payload: err,
    })
  }
}

// const getClients = token => {
//   return txnPrivateGet(`tx-service/clients?limit=0`, token).then(response => {
//     return response.data.data
//   })
// }

const getClients = token => {
  return clientConnectPrivateGet(`entities/clients?limit=0`, token).then(response => {
    const clients = response.data.data.entities.filter(
      item => !!item.genericInformation.registeredCompanyName,
    )
    return clients
  })
}

export function* getAllClients(values) {
  const { token } = values
  try {
    const response = yield call(getClients, token)
    yield put({
      type: actions.GET_CLIENTS_SUCCESS,
      value: response,
      // newClients: getPaymentsClients(response),
      // newVendors: getPaymentsVendor(response),
      // companies: getCompanies(response),
    })
  } catch (err) {
    yield put({
      type: actions.GET_CLIENTS_FAILURE,
      payload: err,
    })
  }
}

const getPassedClients = token => {
  return clientConnectPrivateGet(
    `entities/clients?limit=0&kycInformation.kycStatus=pass`,
    token,
  ).then(response => {
    const clients = response.data.data.entities.filter(
      item => !!item.genericInformation.registeredCompanyName,
    )
    return clients
  })
}

export function* getAllClientsByKycStatusPass(values) {
  const { token } = values
  try {
    const response = yield call(getPassedClients, token)
    yield put({
      type: actions.GET_CLIENTS_BY_KYC_STATUS_PASS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CLIENTS_BY_KYC_STATUS_PASS_FAILURE,
      payload: err,
    })
  }
}

const getEntities = token => {
  return clientConnectPrivateGet(`entities?limit=0`, token).then(response => {
    const clients = response.data.data.entities.filter(
      item => !!item.genericInformation.registeredCompanyName,
    )
    return clients
  })
}

export function* getAllEntities(values) {
  const { token } = values
  try {
    const response = yield call(getEntities, token)
    yield put({
      type: actions.GET_ALL_ENTITIES_SUCCESS,
      value: response,
      // newClients: getPaymentsClients(response),
      // newVendors: getPaymentsVendor(response),
      // companies: getCompanies(response),
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_ENTITIES_FAILURE,
      payload: err,
    })
  }
}

const getIntroducerClients = (clientId, token) => {
  return clientConnectPrivateGet(
    `entities/clients?limit=0&genericInformation.parentId=${clientId}`,
    token,
  ).then(response => {
    const introducers = response.data.data.entities.filter(
      item => !!item.genericInformation.registeredCompanyName,
    )
    return introducers
  })
}

export function* getSelectedIntroducerClients(values) {
  try {
    const response = yield call(getIntroducerClients, values.value, values.token)
    yield put({
      type: actions.GET_INTRODUCERS_CLIENTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_INTRODUCERS_CLIENTS_FAILURE,
      value: err,
    })
  }
}

const getMerchantClients = (clientId, token) => {
  return clientConnectPrivateGet(
    `entities/clients?limit=0&genericInformation.parentId=${clientId}`,
    token,
  ).then(response => {
    const merchants = response.data.data.entities.filter(
      item => !!item.genericInformation.registeredCompanyName,
    )
    return merchants
  })
}

export function* getSelectedMerchantClients(values) {
  try {
    const response = yield call(getMerchantClients, values.value, values.token)
    yield put({
      type: actions.GET_MERCHANTS_CLIENTS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_MERCHANTS_CLIENTS_FAILURE,
      value: err,
    })
  }
}

const getBeneficiaries = token => {
  return txnPrivateGet(`tx-service/beneficiaries?limit=0`, token).then(response => {
    return response.data.data
  })
}

export function* getAllBeneficiaries(values) {
  const { token } = values
  try {
    const response = yield call(getBeneficiaries, token)
    yield put({
      type: actions.GET_ALL_BENEFICIARIES_SUCCESS,
      value: response.beneficiaries,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_BENEFICIARIES_FAILURE,
      payload: err,
    })
  }
}

const getVendors = token => {
  return txnPrivateGet(`tx-service/vendors?limit=0`, token).then(response => {
    const vendors = response.data.data.vendor
    const swapVendors = []
    const fxVendors = []
    const otcVendors = []
    const liquidateVendors = []
    const cryptoWalletVendors = []
    const rentalAccountsVendors = []
    const fiatDepositVendors = []
    const formatedVendor = vendors.map(vendor => {
      const { servicesOffering } = vendor.profile
      const swap = servicesOffering.find(el => el === 'swap')
      const fx = servicesOffering.find(el => el === 'fx')
      const crypto = servicesOffering.find(el => el === 'crypto')
      const accountsOnly = servicesOffering.find(el => el === 'accounts_only')
      const fiatDeposit = servicesOffering.find(el => el === 'fiat_deposit')

      return {
        ...vendor,
        isSwap: swap !== undefined || false,
        isFx: fx !== undefined || false,
        isCrypto: crypto !== undefined || false,
        isAccountOnly: accountsOnly !== undefined || false,
        isFiatDeposit: fiatDeposit !== undefined || false,
      }
    })

    for (let i = 0; i < vendors.length; i += 1) {
      const { servicesOffering } = vendors[i].profile
      const vendor = vendors[i]
      for (let j = 0; j < servicesOffering.length; j += 1) {
        switch (servicesOffering[j]) {
          case 'swap':
            swapVendors.push(vendor)
            break
          case 'fx':
            fxVendors.push(vendor)
            break
          case 'otc':
            otcVendors.push(vendor)
            break
          case 'crypto_wallet':
            cryptoWalletVendors.push(vendor)
            break
          case 'liquidate':
            liquidateVendors.push(vendor)
            break
          case 'accounts_only':
            rentalAccountsVendors.push(vendor)
            break
          case 'fiat_deposit':
            fiatDepositVendors.push(vendor)
            break
          default:
            break
        }
      }
    }

    return {
      vendors: formatedVendor,
      total: response.data.data.total,
      classifiedVendors: {
        swap: swapVendors,
        fx: fxVendors,
        otc: otcVendors,
        liquidate: liquidateVendors,
        accounts_only: rentalAccountsVendors,
        crypto_wallet: cryptoWalletVendors,
        fiat_deposit: fiatDepositVendors,
      },
    }
  })
}

export function* getAllVendors(values) {
  const { token } = values
  try {
    const response = yield call(getVendors, token)
    yield put({
      type: actions.GET_VENDORS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_VENDORS_FAILURE,
      payload: err,
    })
  }
}

const getAllChannels = token => {
  return txnPrivateGet(`tx-service/stream-channels`, token).then(response => {
    return response.data.data
  })
}

const getCryptoBeneficiary = token => {
  return txnPrivateGet(`tx-service/crypto-beneficiaries?limit=0`, token).then(response => {
    return response.data.data
  })
}

export function* getAllStreamChannels(values) {
  const { token } = values
  try {
    const response = yield call(getAllChannels, token)
    yield put({
      type: actions.GET_ALL_STREAM_CHANNELS_SUCCESS,
      value: response.changeStreamChannels,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_STREAM_CHANNELS_FAILURE,
      value: null,
    })
  }
}

export function* getCryptoBeneficiaries(values) {
  const { token } = values
  try {
    const response = yield call(getCryptoBeneficiary, token)
    yield put({
      type: actions.GET_ALL_CRYPTO_BENEFICIARIES_SUCCESS,
      value: response.beneficiaries,
      total: response.total,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ALL_CRYPTO_BENEFICIARIES_FAILURE,
      payload: err,
    })
  }
}

const getCurrencyPairs = token => {
  return cAPrivateGet('vendor-trade-currency-pairs?limit=0', token).then(response => {
    return response.data.data.vendorTradeCurrencyPairs
  })
}

export function* getAllCurrencyPairs(values) {
  const { token } = values
  try {
    const response = yield call(getCurrencyPairs, token)
    yield put({
      type: actions.GET_CURRENCY_PAIRS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_CURRENCY_PAIRS_FAILURE,
      payload: err,
    })
  }
}

const getVendorsList = token => {
  return clientConnectPrivateGet(`entities/vendors?limit=0`, token).then(response => {
    return response.data.data.entities
  })
}

export function* getAllVendorsList(values) {
  const { token } = values
  try {
    const response = yield call(getVendorsList, token)
    yield put({
      type: actions.GET_NEW_VENDORS_LIST_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_NEW_VENDORS_LIST_FAILURE,
      payload: err,
    })
  }
}

const getCompaniesList = token => {
  return clientConnectPrivateGet(`entities/companies?limit=0`, token).then(response => {
    return response.data.data.entities
  })
}

export function* getAllCompaniesList(values) {
  const { token } = values
  try {
    const response = yield call(getCompaniesList, token)
    yield put({
      type: actions.GET_COMPANIES_LIST_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_COMPANIES_LIST_FAILURE,
      payload: err,
    })
  }
}

const getAllProducts = token => {
  return clientConnectPrivateGet(`products`, token).then(response => {
    return response.data.data
  })
}

export function* getAllProductsList(values) {
  const { token } = values
  try {
    const response = yield call(getAllProducts, token)
    yield put({
      type: actions.GET_PRODUCTS_SUCCESS,
      value: response.product,
    })
  } catch (err) {
    yield put({
      type: actions.GET_PRODUCTS_FAILURE,
      payload: err,
    })
  }
}

const getAllBrands = token => {
  return clientConnectPrivateGet(`brands`, token).then(response => {
    return response.data.data
  })
}

export function* getAllBrandsList(values) {
  const { token } = values
  try {
    const response = yield call(getAllBrands, token)
    yield put({
      type: actions.GET_BRANDS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_BRANDS_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_CURRENCIES, getAllCurrencies),
    takeEvery(actions.GET_COUNTRIES, getAllCountries),
    takeEvery(actions.GET_INTRODUCERS, getAllIntroducers),
    takeEvery(actions.GET_MERCHANTS, getAllMerchants),
    takeEvery(actions.GET_CLIENTS, getAllClients),
    takeEvery(actions.GET_CLIENTS_BY_KYC_STATUS_PASS, getAllClientsByKycStatusPass),
    takeEvery(actions.GET_ALL_BENEFICIARIES, getAllBeneficiaries),
    takeEvery(actions.GET_CURRENCIES_BY_ACCOUNT_ID, getCurrenciesByAccountId),
    takeEvery(actions.GET_VENDORS, getAllVendors),
    takeEvery(actions.GET_INTRODUCERS_CLIENTS, getSelectedIntroducerClients),
    takeEvery(actions.GET_MERCHANTS_CLIENTS, getSelectedMerchantClients),
    takeEvery(actions.GET_ALL_STREAM_CHANNELS, getAllStreamChannels),
    takeEvery(actions.GET_ALL_CRYPTO_BENEFICIARIES, getCryptoBeneficiaries),
    takeEvery(actions.GET_CURRENCY_PAIRS, getAllCurrencyPairs),
    takeEvery(actions.GET_NEW_VENDORS_LIST, getAllVendorsList),
    takeEvery(actions.GET_COMPANIES_LIST, getAllCompaniesList),
    takeEvery(actions.GET_PRODUCTS, getAllProductsList),
    takeEvery(actions.GET_BRANDS, getAllBrandsList),
    takeEvery(actions.GET_ALL_ENTITIES, getAllEntities),
  ])
}
