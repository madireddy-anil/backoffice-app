import { all, put, call, takeLatest } from 'redux-saga/effects'
import { notification } from 'antd'
import NProgress from 'nprogress'
import { push } from 'react-router-redux'

import axiosMethod from '../../utilities/apiCaller'
import Variables from '../../utilities/variables'
import { formatNumberDecimal } from '../../utilities/transformer'

import actions from './actions'
import chatActions from '../chat/actions'
import newTradeActions from '../newTrade/actions'
import transactionAction from '../transactions/actions'
import routingEngineAction from '../routingEngine/actions'
import cryptoTransactionAction from '../cryptoTransactions/actions'

const { txnPrivateGet, txnPrivatePut, txnPublicPut, txnPrivatePost, txnPrivateDelete } = axiosMethod
const { globalMessages } = Variables

const updateExistingSellRate = (values, token) => {
  const body = {
    agreedSpread: values.agreedSpread,
    baseAmount: values.baseAmount,
    depositCurrency: values.depositCurrency,
    inverseAmount: values.inverseAmount,
    isIndicative: values.isIndicative,
    quoteStatus: values.quoteStatus,
    sellRate: values.sellRate,
    sellRateInverse: values.sellRateInverse,
    settlementAmount: values.settlementAmount,
    settlementCurrency: values.settlementCurrency,
    targetAmount: values.targetAmount,
    totalDepositAmount: values.totalDepositAmount,
    tradeId: values.tradeId,
    rateCategory: values.rateCategory,
    rateStatus: values.rateStatus,
  }
  return txnPrivatePut(`tx-service/sell-rates/${values.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* confirmExistingSellRate(values) {
  try {
    const response = yield call(updateExistingSellRate, values.value, values.token)
    yield put({
      type: actions.CONFIRM_EXISTING_SELL_RATE_SUCESS,
      value: response,
    })
    // if (values.value.quoteStatus === 'quote_confirmed') {
    //   yield put({
    //     type: actions.UPDATE_TRADE_DETAILS,
    //     value: values.value.tradeUpdateData,
    //     tradeId: values.value.tradeId,
    //     token: values.token,
    //   })
    // }
  } catch (err) {
    yield put({
      type: actions.CONFIRM_EXISTING_SELL_RATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

function* apiCallAfterTradeFetch(trade, token) {
  try {
    yield put({
      type: actions.GET_ROUTE_BY_TRADE_ID,
      value: trade.id,
      token,
    })
    yield put({
      type: actions.GET_RATES_BY_TRADE_ID,
      value: trade.id,
      token,
    })
    yield put({
      type: actions.GET_FEES_BY_TRADE_ID,
      value: trade.id,
      token,
    })
    if (trade.cryptoBeneficiary) {
      yield put({
        type: newTradeActions.GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID,
        value: trade.clientId,
        token,
      })
    } else {
      yield put({
        type: newTradeActions.GET_BENEFICIARY_BY_CLIENT_ID,
        value: trade.clientId,
        token,
      })
    }
  } catch (err) {
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export function getTrade(tradeId, token) {
  return txnPrivateGet(`tx-service/trades/${tradeId}`, token).then(response => {
    if (response.data.data.cryptoBeneficiary) {
      response.data.data.beneficiary = response.data.data.cryptoBeneficiary
    }
    let { sellRates, cryptoTransactions, transactions } = response.data.data
    if (sellRates.length !== 0) {
      sellRates = sellRates.map(rate => {
        rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
        rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
        rate.sellRateInverse = rate.sellRateInverse ? formatNumberDecimal(rate.sellRateInverse) : 0
        rate.settlementAmount = rate.settlementAmount
          ? formatNumberDecimal(rate.settlementAmount)
          : 0
        rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
        return rate
      })
    }
    response.data.data.sellRates = sellRates

    if (cryptoTransactions.length !== 0) {
      cryptoTransactions = cryptoTransactions.map(cryptoTransaction => {
        const { buyRates } = cryptoTransaction

        const newBuyRates = buyRates.map(rate => {
          rate.baseAmount = rate.baseAmount ? formatNumberDecimal(rate.baseAmount) : 0
          rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
          rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
          rate.sellRateInverse = rate.sellRateInverse
            ? formatNumberDecimal(rate.sellRateInverse)
            : 0
          rate.settlementAmount = rate.settlementAmount
            ? formatNumberDecimal(rate.settlementAmount)
            : 0
          rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
          return rate
        })
        cryptoTransaction.buyRates = newBuyRates
        return cryptoTransaction
      })
      response.data.data.cryptoTransactions = cryptoTransactions
    }

    if (transactions.length !== 0) {
      transactions = transactions.map(transaction => {
        const { buyRates } = transaction

        const newBuyRates = buyRates.map(rate => {
          rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
          rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
          rate.sellRateInverse = rate.sellRateInverse
            ? formatNumberDecimal(rate.sellRateInverse)
            : 0
          rate.settlementAmount = rate.settlementAmount
            ? formatNumberDecimal(rate.settlementAmount)
            : 0
          rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
          return rate
        })
        transaction.buyRates = newBuyRates
        return transaction
      })
      response.data.data.transactions = transactions
    }

    return response.data.data
  })
}

export function* getTradeDetailsById(values) {
  try {
    yield put(push('/trade'))
    const response = yield call(getTrade, values.value, values.token)
    yield put({
      type: actions.GET_TRADE_DETAILS_BY_ID_SUCCESS,
      value: response,
    })
    yield call(apiCallAfterTradeFetch, response, values.token)
  } catch (err) {
    yield put({
      type: actions.GET_TRADE_DETAILS_BY_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getRoute = (tradeId, token) => {
  return txnPrivateGet(`tx-service/trade-routes?tradeId=${tradeId}&sortBy=asc`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getRouteByTradeId(values) {
  try {
    const response = yield call(getRoute, values.value, values.token)
    yield put({
      type: actions.GET_ROUTE_BY_TRADE_ID_SUCCESS,
      value: response.tradeRouters,
    })
  } catch (err) {
    yield put({
      type: actions.GET_ROUTE_BY_TRADE_ID_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateRoute = (values, token) => {
  return txnPrivatePut(`tx-service/trade-routes/${values.id}`, values, token).then(response => {
    return response.data.data
  })
}

export function* updateRouteById(values) {
  try {
    const response = yield call(updateRoute, values.value, values.token)
    yield put({
      type: actions.UPDATE_ROUTE_VALUE_SUCCESS,
      value: response,
    })
    // yield put({
    //   type: actions.GET_ROUTE_BY_TRADE_ID,
    //   value: values.tradeId,
    // })
  } catch (err) {
    yield put({
      type: actions.UPDATE_ROUTE_VALUE_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateClient = (value, token) => {
  const body = {
    client: value.updatedClient,
  }
  return txnPublicPut(`tx-service/trades/${value.tradeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateTradeClient(values) {
  try {
    const response = yield call(updateClient, values.value, values.token)
    yield put({
      type: actions.UPDATE_SELECTED_CLIENT_SUCCESS,
      value: response,
    })
    yield put({
      type: newTradeActions.GET_BENEFICIARY_BY_CLIENT_ID,
      value: response.clientId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_SELECTED_CLIENT_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateSource = (value, token) => {
  const body = {
    depositCurrency: value.sourceCurrency,
    depositsInPersonalAccount: value.depositsInPersonalAccount,
    depositsInCorporateAccount: value.depositsInCorporateAccount,
  }
  return txnPrivatePut(`tx-service/trades/${value.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateSourceDetails(values) {
  try {
    const response = yield call(updateSource, values.value, values.token)
    yield put({
      type: actions.UPDATE_SOURCE_DETAILS_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_ROUTE_BY_TRADE_ID,
      value: values.value.id,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_SOURCE_DETAILS_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateBeneficiary = (value, token) => {
  let body
  if (value.updatedBeneficiary.cryptoCurrency) {
    body = {
      cryptoBeneficiary: value.updatedBeneficiary,
      beneficiary: '',
      settlementCurrency: value.updatedBeneficiary.cryptoCurrency,
    }
  } else {
    body = {
      beneficiary: value.updatedBeneficiary,
      cryptoBeneficiary: '',
      settlementCurrency: value.updatedBeneficiary.bankAccountDetails.bankAccountCurrency,
    }
  }
  return txnPrivatePut(`tx-service/trades/${value.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateBeneficiaryDetails(values) {
  try {
    const response = yield call(updateBeneficiary, values.value, values.token)
    yield put({
      type: actions.UPDATE_BENEFICIARY_DETAILS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_BENEFICIARY_DETAILS_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateDeposit = (value, token) => {
  const body = {
    depositsInPersonalAccount: value.depositsInPersonalAccount,
    depositsInCorporateAccount: value.depositsInCorporateAccount,
    progressLogs: { ...value.progressLogs, depositConfirmedByClientAt: value.date },
    tradeStatus: 'deposits_confirmed',
  }
  return txnPrivatePut(`tx-service/trades/${value.tradeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateDepositDetails(values) {
  try {
    const response = yield call(updateDeposit, values.value, values.token)
    yield put({
      type: actions.UPDATE_DEPOSITED_AMOUNT_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_ROUTE_BY_TRADE_ID,
      value: values.value.tradeId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_DEPOSITED_AMOUNT_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateTradeAmount = (value, token) => {
  const body = {
    depositsInPersonalAccount: value.depositsInPersonalAccount,
    depositsInCorporateAccount: value.depositsInCorporateAccount,
  }
  return txnPrivatePut(`tx-service/trades/${value.tradeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateTradeAmountAsDeposit(values) {
  try {
    const response = yield call(updateTradeAmount, values.value, values.token)
    yield put({
      type: actions.UPDATE_TRADE_AMOUNT_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Update successfully!',
      description: 'Updated Trade Amount successfully.',
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_TRADE_AMOUNT_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const confirmFinalFunds = (value, token) => {
  const body = {
    fundReceiptConfirmAmountByClient: value.amount,
    fundReceiptConfirmDateByClient: value.date,
    progressLogs: { ...value.progressLogs, fundsRecceiptConfirmationByClientAt: value.date },
    tradeStatus: 'completed',
  }
  return txnPrivatePut(`tx-service/trades/${value.tradeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* confirmFinalFundsByClient(values) {
  try {
    const response = yield call(confirmFinalFunds, values.value, values.token)
    yield put({
      type: actions.CONFIRM_FINAL_FUNDS_SUCCESS,
      value: response,
    })
    yield call(endTradeChat, values.value, values.value.chatToken)
    notification.success({
      message: ' Funds Confirmed successfully!',
      description: 'Final recived funds confirmed for the trade.',
    })
  } catch (err) {
    yield put({
      type: actions.CONFIRM_FINAL_FUNDS_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export function* endTradeChat(value, token) {
  yield put({
    type: chatActions.END_CHANNEL,
    value,
    token,
  })
}

const manualRouteCreation = (values, token) => {
  const body = {
    tradeId: values.tradeId,
    routeReference: values.routeReference,
    routeStatus: values.routeStatus,
    sequence: values.sequence,
    depositCurrency: values.depositCurrency,
    settlementCurrency: values.settlementCurrency,
    totalDepositAmount: values.totalDepositAmount,
    vendorName: values.vendorName,
    routeType: values.routeType,
    clientId: values.clientId,
  }
  return txnPrivatePost(`tx-service/trade-routes`, body, token).then(response => {
    return response.data.data
  })
}

export function* createManualRoute(values) {
  try {
    const response = yield call(manualRouteCreation, values.value, values.token)
    yield put({
      type: actions.CREATE_MANUAL_ROUTE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_MANUAL_ROUTE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export function* onRouteChange(value) {
  try {
    const res = yield call(manualRouteCreation, value.values.forNewRoute, value.token)
    value.values.forTrasactionCreation = {
      ...value.values.forTrasactionCreation,
      id: res.id,
    }
    yield put({
      type: actions.CREATE_MANUAL_ROUTE_SUCCESS,
      value: res,
    })
    if (value.values.isCrypto) {
      yield put({
        type: cryptoTransactionAction.CREATE_CRYPTO_TRANSACTION,
        value: value.values.forTrasactionCreation,
        token: value.token,
      })
    } else {
      yield put({
        type: transactionAction.CREATE_TRANSACTION,
        value: value.values.forTrasactionCreation,
        token: value.token,
      })
    }
  } catch (err) {
    yield put({
      type: actions.CREATE_MANUAL_ROUTE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const autoRouteCreation = (values, token) => {
  const body = {
    tradeId: values.tradeId,
    routeStatus: values.routeStatus,
    sequence: values.sequence,
    depositCurrency: values.depositCurrency,
    settlementCurrency: values.settlementCurrency,
    depositsInPersonalAccount: values.depositsInPersonalAccount,
    depositsInCorporateAccount: values.depositsInCorporateAccount,
    clientId: values.clientId,
  }
  return txnPrivatePost(`tx-service/trade-routes`, body, token).then(response => {
    return response.data.data
  })
}

export function* autoCreateRoute(values) {
  try {
    const response = yield call(autoRouteCreation, values.value, values.token)
    yield put({
      type: actions.CREATE_ROUTE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_ROUTE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateRouteCTxn = (values, token) => {
  const body = {
    routeStatus: 'cancelled',
  }
  return txnPrivatePut(`tx-service/trade-routes/${values.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateRouteOnCancelTxn(values) {
  try {
    const response = yield call(updateRouteCTxn, values.value, values.token)
    yield put({
      type: actions.UPDATE_ROUTE_ON_CANCEL_TXN_SUCCESS,
      value: response,
    })
    // yield put({
    //   type: actions.GET_ROUTE_BY_TRADE_ID,
    //   value: values.tradeId,
    // })
  } catch (err) {
    yield put({
      type: actions.UPDATE_ROUTE_ON_CANCEL_TXN_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateRouteDelTxn = (values, token) => {
  const body = {
    routeStatus: 'new',
    routeType: '',
    vendorName: '',
    allSequenceComplete: false,
    depositCurrency: '',
    settlementCurrency: '',
    totalDepositAmount: null,
    transactionId: '',
  }
  return txnPrivatePut(`tx-service/trade-routes/${values.id}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateRouteOnDeleteTxn(values) {
  try {
    const response = yield call(updateRouteDelTxn, values.value, values.token)
    yield put({
      type: actions.UPDATE_ROUTE_ON_DELETE_TXN_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_ROUTE_BY_TRADE_ID,
      value: values.tradeId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_ROUTE_ON_DELETE_TXN_FAILURE,
      payload: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateSequence = (values, token) => {
  const body = {
    allSequenceComplete: values.allSequenceComplete,
  }
  return txnPrivatePut(`tx-service/trade-routes/${values.routeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateRouteSequence(values) {
  try {
    const response = yield call(updateSequence, values.value, values.token)
    yield put({
      type: actions.UPDATE_ROUTE_SEQUENCE_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_ROUTE_BY_TRADE_ID,
      value: values.tradeId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_ROUTE_SEQUENCE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateStatus = (values, token) => {
  const body = {
    routeStatus: values.status,
  }
  return txnPrivatePut(`tx-service/trade-routes/${values.routeId}`, body, token).then(response => {
    return response.data.data
  })
}

export function* updateRouteStatus(values) {
  try {
    const response = yield call(updateStatus, values.value, values.token)
    yield put({
      type: actions.UPDATE_ROUTE_STATUS_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_ROUTE_BY_TRADE_ID,
      value: values.tradeId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_ROUTE_STATUS_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getRatesByTrade = (tradeId, token) => {
  return txnPrivateGet(`tx-service/sell-rates?tradeId=${tradeId}`, token).then(response => {
    return response.data.data.sellRates.map(rate => {
      rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
      rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
      rate.sellRateInverse = rate.sellRateInverse ? formatNumberDecimal(rate.sellRateInverse) : 0
      rate.settlementAmount = rate.settlementAmount ? formatNumberDecimal(rate.settlementAmount) : 0
      rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
      return rate
    })
  })
}

export function* getRatesByTradeId(values) {
  try {
    const response = yield call(getRatesByTrade, values.value, values.token)
    yield put({
      type: actions.GET_RATES_BY_TRADE_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_RATES_BY_TRADE_ID_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getFeesByTrade = (tradeId, token) => {
  return txnPrivateGet(`tx-service/fees?tradeId=${tradeId}`, token).then(response => {
    return response.data.data
  })
}

export function* getFeesByTradeId(values) {
  try {
    const response = yield call(getFeesByTrade, values.value, values.token)
    yield put({
      type: actions.GET_FEES_BY_TRADE_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_FEES_BY_TRADE_ID_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getRate = (values, token) => {
  const body = {
    tradeAmount: values.totalDepositAmount,
    accountId: values.clientId,
    clientName: values.clientName,
    tradeId: values.tradeId,
    tradeCurrency: values.depositCurrency,
    targetCurrency: values.settlementCurrency,
    tradeConfirmedDateTime: values.tradeRequestedAt,
    depositConfirmedDateTime: values.depositConfirmedByClientAt,
    fxRateDateAndTime: values.rateAppliedAt,
    IsInverse: values.isInverseRate,
    isNewCalculation: values.isNewCalculation,
    precision: values.precision,
    rateType: 'SELLRATE',
    isSellRate: true,
  }
  return txnPrivatePost(`tx-service/rate-calculate`, body, token).then(response => {
    NProgress.done()
    return response.data.data
  })
}

export function* getTradeRate(values) {
  try {
    NProgress.start()
    const response = yield call(getRate, values.value, values.token)
    yield put({
      type: actions.GET_RATE_SUCCESS,
      value: response,
    })
    notification.success({
      message: ' Fetch rate successfully!',
    })
  } catch (err) {
    NProgress.done()
    yield put({
      type: actions.GET_RATE_FAILURE,
      value: err,
    })
    if (err.response.status === 400) {
      notification.error({
        message: err.response.data.message,
      })
    }
  }
}

const createRate = (values, token) => {
  return txnPrivatePost(`tx-service/sell-rates`, values, token).then(response => {
    NProgress.done()
    return response.data.data
  })
}

export function* triggerTradeFetchCall(value, token) {
  try {
    const tradeResponse = yield call(getTrade, value.tradeId, token)
    yield put({
      type: actions.GET_TRADE_DETAILS_BY_ID_SUCCESS,
      value: tradeResponse,
    })
  } catch (err) {
    notification.error({
      message: "Can't Get Trade Details",
      description: globalMessages.errorDescription,
    })
  }
}

export function* createRateRecord(values) {
  const { value, token } = values
  try {
    NProgress.start()
    const response = yield call(createRate, value, token)
    yield put({
      type: actions.CREATE_RATE_RECORD_SUCCESS,
      value: response,
    })
    // if (value.quoteStatus === 'quote_confirmed') {
    //   yield put({
    //     type: actions.UPDATE_TRADE_DETAILS,
    //     value: tradeValue,
    //     tradeId: value.tradeId,
    //     token,
    //   })
    // }
    yield call(triggerTradeFetchCall, values.value, values.token)
  } catch (err) {
    NProgress.done()
    yield put({
      type: actions.CREATE_RATE_RECORD_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateSellRate = (values, tradeId, token) => {
  if (tradeId) {
    values.tradeId = tradeId
  }

  return txnPrivatePut(`tx-service/sell-rates/${values.id}`, values, token).then(response => {
    const resData = response.data.data
    resData.inverseAmount = resData.inverseAmount ? formatNumberDecimal(resData.inverseAmount) : 0
    resData.sellRate = resData.sellRate ? formatNumberDecimal(resData.sellRate) : 0
    resData.sellRateInverse = resData.sellRateInverse
      ? formatNumberDecimal(resData.sellRateInverse)
      : 0
    resData.settlementAmount = resData.settlementAmount
      ? formatNumberDecimal(resData.settlementAmount)
      : 0
    resData.targetAmount = resData.targetAmount ? formatNumberDecimal(resData.targetAmount) : 0
    return resData
  })
}

export function* updateTradeSellRate(values) {
  try {
    const response = yield call(
      updateSellRate,
      values.value.payload,
      values.value.tradeId,
      values.value.token,
    )
    yield put({
      type: actions.UPDATE_SELL_RATE_SUCCESS,
      value: response,
    })
    // yield put({
    //   type: actions.GET_RATES_BY_TRADE_ID,
    //   value: values.tradeId,
    //   token: values.token,
    // })
  } catch (err) {
    yield put({
      type: actions.UPDATE_SELL_RATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateFee = values => {
  return txnPrivatePut(`tx-service/fees/${values.value.id}`, values.value, values.token).then(
    response => {
      return response.data.data
    },
  )
}

export function* updateTradeFee(values) {
  try {
    const response = yield call(updateFee, values)
    yield put({
      type: actions.UPDATE_FEE_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_FEES_BY_TRADE_ID,
      value: values.tradeId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_FEE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateIntroducerFee = values => {
  return txnPrivatePut(`tx-service/fees/${values.value.id}`, values.value, values.token).then(
    response => {
      return response.data.data
    },
  )
}

export function* updateTradeIntroducerFee(values) {
  try {
    const response = yield call(updateIntroducerFee, values)
    yield put({
      type: actions.UPDATE_INTRODUCERS_CLIENT_SUCCESS,
      value: response,
    })
    yield put({
      type: actions.GET_FEES_BY_TRADE_ID,
      value: values.tradeId,
      token: values.token,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_INTRODUCERS_CLIENT_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getAllDepositSlips = (tradeId, token) => {
  return txnPrivateGet(`tx-service/files?tradeId=${tradeId}&limit=0`, token).then(response => {
    return response.data.data
  })
}

export function* getDepositSlipsByTradeId(values) {
  try {
    const response = yield call(getAllDepositSlips, values.value, values.token)
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRADE_ID_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DEPOSIT_SLIPS_BY_TRADE_ID_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const updateTradeValues = (values, tradeId, token) => {
  return txnPrivatePut(`tx-service/trades/${tradeId}`, values, token).then(response => {
    return response.data.data
  })
}

export function* updateTradeDetails(values) {
  try {
    const response = yield call(updateTradeValues, values.value, values.tradeId, values.token)
    yield put({
      type: actions.UPDATE_TRADE_DETAILS_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_TRADE_DETAILS_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getCommision = (values, token) => {
  return txnPrivatePost(`tx-service/commission`, values, token).then(response => {
    return response.data.data
  })
}

export function* getIntroducerCommision(values) {
  try {
    const response = yield call(getCommision, values.value, values.token)
    yield put({
      type: actions.GET_INTRODUCER_COMMISION_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_INTRODUCER_COMMISION_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getPcMargin = (tradeId, token) => {
  return txnPrivateGet(`tx-service/fees/trade/${tradeId}`, token).then(response => {
    return response.data.data
  })
}

export function* getTradePcMargin(values) {
  try {
    const response = yield call(getPcMargin, values.tradeId, values.token)
    yield put({
      type: actions.GET_TRADE_PC_MARGIN_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_TRADE_PC_MARGIN_FAILURE,
      value: err,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const updatePcMargin = (transactionId, token) => {
  const body = {
    transactionId,
  }
  return txnPrivatePost(`tx-service/fees/fee-calculate`, body, token).then(response => {
    return response.data.data
  })
}

export function* updatePcMarginInFees(values) {
  try {
    const response = yield call(updatePcMargin, values.value, values.token)
    yield put({
      type: actions.UPDATE_FEES_PC_MARGIN_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_FEES_PC_MARGIN_FAILURE,
      value: err,
    })
    notification.error({
      message: err.response.data.message || globalMessages.errorMessage,
    })
  }
}

const manualRateCreation = (values, token) => {
  return txnPrivatePost(`tx-service/sell-rates`, values, token).then(response => {
    return response.data.data
  })
}

export function* createManualRate(values) {
  try {
    const response = yield call(manualRateCreation, values.value, values.token)
    yield put({
      type: actions.CREATE_MANUAL_RATE_SUCCESS,
      value: response,
    })
    if (values.value.transactionId) {
      yield put({
        type: transactionAction.GET_TXN_RATES_BY_TXN_ID,
        value: values.value.transactionId,
        token: values.token,
      })
    }
  } catch (err) {
    yield put({
      type: actions.CREATE_MANUAL_RATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const manualFeesCreation = (values, token) => {
  return txnPrivatePost(`tx-service/fees`, values, token).then(response => {
    return response.data.data
  })
}

export function* createManualFees(values) {
  try {
    const response = yield call(manualFeesCreation, values.value, values.token)
    yield put({
      type: actions.CREATE_MANUAL_FEES_SUCCESS,
      value: response,
    })
    if (values.value.transactionId) {
      yield put({
        type: transactionAction.GET_TXN_FEES_BY_TXN_ID,
        value: values.value.transactionId,
        token: values.token,
      })
    }
  } catch (err) {
    yield put({
      type: actions.CREATE_MANUAL_RATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteTradeRate = (id, token) => {
  return txnPrivateDelete(`tx-service/sell-rates/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteTradeRates(values) {
  try {
    const response = yield call(deleteTradeRate, values.values.sellRateId, values.token)
    yield put({
      type: actions.DELETE_TRADE_RATE_SUCCESS,
      value: response,
    })
    if (values.values.tradeId) {
      yield put({
        type: actions.GET_RATES_BY_TRADE_ID,
        value: values.values.tradeId,
        token: values.token,
      })
    } else {
      yield put({
        type: transactionAction.GET_TXN_RATES_BY_TXN_ID,
        value: values.values.transactionId,
        token: values.token,
      })
    }
  } catch (err) {
    yield put({
      type: actions.DELETE_TRADE_RATE_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteTradeFees = (id, token) => {
  return txnPrivateDelete(`tx-service/fees/${id}`, token).then(response => {
    return response.data.data
  })
}

export function* deleteTradeFee(values) {
  try {
    const response = yield call(deleteTradeFees, values.values.feesId, values.token)
    yield put({
      type: actions.DELETE_TRADE_FEES_SUCCESS,
      value: response,
    })
    if (values.values.tradeId) {
      yield put({
        type: actions.GET_FEES_BY_TRADE_ID,
        value: values.values.tradeId,
        token: values.token,
      })
    } else {
      yield put({
        type: transactionAction.GET_TXN_FEES_BY_TXN_ID,
        value: values.values.transactionId,
        token: values.token,
      })
    }
  } catch (err) {
    yield put({
      type: actions.DELETE_TRADE_FEES_FAILURE,
      value: err,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const deleteSlip = (id, token) => {
  return txnPrivateDelete(`tx-service/files/${id}`, token).then(response => {
    return response.data
  })
}

export function* deleteDepositSlip(values) {
  const { id, token } = values
  try {
    yield call(deleteSlip, id, token)
    yield put({
      type: actions.DELETE_DEPOSIT_SLIP_SUCCESS,
      value: id,
    })
  } catch (err) {
    yield put({
      type: actions.DELETE_DEPOSIT_SLIP_FAILURE,
      value: err,
    })
  }
}

const updateTradeDate = values => {
  const { value } = values
  return txnPrivatePut(`tx-service/trades/${value.tradeID}`, value.newDate, values.token).then(
    response => {
      return response.data.data
    },
  )
}

export function* updateBackDatedTrade(value) {
  try {
    const response = yield call(updateTradeDate, value)
    yield put({
      type: actions.UPDATE_BACKDATED_TRADE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.UPDATE_BACKDATED_TRADE_FAILURE,
      value: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.UPDATE_BACKDATED_TRADE, updateBackDatedTrade),
    takeLatest(actions.DELETE_DEPOSIT_SLIP, deleteDepositSlip),
    takeLatest(actions.GET_TRADE_DETAILS_BY_ID, getTradeDetailsById),
    takeLatest(actions.GET_ROUTE_BY_TRADE_ID, getRouteByTradeId),
    takeLatest(actions.UPDATE_ROUTE_VALUE, updateRouteById),
    takeLatest(actions.UPDATE_SELECTED_CLIENT, updateTradeClient),
    takeLatest(actions.UPDATE_SOURCE_DETAILS, updateSourceDetails),
    takeLatest(actions.UPDATE_BENEFICIARY_DETAILS, updateBeneficiaryDetails),
    takeLatest(actions.UPDATE_DEPOSITED_AMOUNT, updateDepositDetails),
    takeLatest(actions.UPDATE_TRADE_AMOUNT, updateTradeAmountAsDeposit),
    takeLatest(actions.CONFIRM_FINAL_FUNDS, confirmFinalFundsByClient),
    takeLatest(actions.CREATE_ROUTE, autoCreateRoute),
    takeLatest(actions.CREATE_MANUAL_ROUTE, createManualRoute),
    takeLatest(actions.UPDATE_ROUTE_ON_CANCEL_TXN, updateRouteOnCancelTxn),
    takeLatest(actions.UPDATE_ROUTE_ON_DELETE_TXN, updateRouteOnDeleteTxn),
    takeLatest(actions.UPDATE_ROUTE_SEQUENCE, updateRouteSequence),
    takeLatest(actions.UPDATE_ROUTE_STATUS, updateRouteStatus),
    takeLatest(actions.GET_RATES_BY_TRADE_ID, getRatesByTradeId),
    takeLatest(actions.GET_FEES_BY_TRADE_ID, getFeesByTradeId),
    takeLatest(actions.GET_RATE, getTradeRate),
    takeLatest(actions.CREATE_RATE_RECORD, createRateRecord),
    takeLatest(actions.UPDATE_SELL_RATE, updateTradeSellRate),
    takeLatest(actions.UPDATE_FEE, updateTradeFee),
    takeLatest(actions.UPDATE_INTRODUCER_FEE, updateTradeIntroducerFee),
    takeLatest(actions.GET_DEPOSIT_SLIPS_BY_TRADE_ID, getDepositSlipsByTradeId),
    takeLatest(actions.UPDATE_TRADE_DETAILS, updateTradeDetails),
    takeLatest(actions.GET_INTRODUCER_COMMISION, getIntroducerCommision),
    takeLatest(actions.GET_TRADE_PC_MARGIN, getTradePcMargin),
    takeLatest(actions.UPDATE_FEES_PC_MARGIN, updatePcMarginInFees),
    takeLatest(actions.CREATE_MANUAL_RATE, createManualRate),
    takeLatest(actions.CREATE_MANUAL_FEES, createManualFees),
    takeLatest(actions.DELETE_TRADE_RATE, deleteTradeRates),
    takeLatest(actions.DELETE_TRADE_FEES, deleteTradeFee),
    takeLatest(actions.CONFIRM_EXISTING_SELL_RATE, confirmExistingSellRate),
    takeLatest(routingEngineAction.HANDLE_ON_ROUTE_CHANGE, onRouteChange),
  ])
}
