import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
// import { push } from 'react-router-redux'
import caTxnActions from '../caTransactions/actions'
import actions from './actions'

import axiosMethod from '../../utilities/apiCaller'

const { cAPrivatePost } = axiosMethod

const initiateManualCredit = (id, value, token) => {
  return cAPrivatePost(`accounts/${id}/balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* manualCredit(values) {
  const { id, value, token } = values
  try {
    const response = yield call(initiateManualCredit, id, value, token)
    yield put({
      type: actions.INITIATE_MANUAL_CREDIT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    yield put({
      type: caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
      Id: id,
      value: {
        limit: 50,
        activePage: 1,
      },
      token,
    })
  } catch (err) {
    if (err.response.data.message === null) {
      yield put({
        type: actions.INITIATE_MANUAL_CREDIT_FAILURE,
        payload: err.response.data.data.errors,
      })
    } else {
      notification.error({
        message: err.response.data.message,
      })
    }
  }
}

const initiateManualDebit = (id, value, token) => {
  return cAPrivatePost(`accounts/${id}/balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* manualDebit(values) {
  const { id, value, token } = values
  try {
    const response = yield call(initiateManualDebit, id, value, token)
    yield put({
      type: actions.INITIATE_MANUAL_DEBIT_SUCCESS,
      value: response,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    yield put({
      type: caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
      Id: id,
      value: {
        limit: 50,
        activePage: 1,
      },
      token,
    })

    notification.success({
      message: response.message,
    })
    // yield put(push(`/payments-accounts-list`))
  } catch (err) {
    if (err.response.data.message === null) {
      yield put({
        type: actions.INITIATE_MANUAL_DEBIT_FAILURE,
        payload: err.response.data.data.errors,
      })
    } else {
      notification.error({
        message: err.response.data.message,
      })
    }
  }
}

const initiateVendorManualCredit = (value, token) => {
  return cAPrivatePost(`balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* vendorManualCredit(values) {
  const { value, token } = values
  try {
    const response = yield call(initiateVendorManualCredit, value, token)
    yield put({
      type: actions.INITIATE_VENDOR_MANUAL_CREDIT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    // yield put({
    //   type : caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
    //   Id:id,
    //   value:{
    //     limit : 50,
    //     activePage:1
    //   },
    //   token
    // })
  } catch (err) {
    yield put({
      type: actions.INITIATE_VENDOR_MANUAL_CREDIT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const initiateVendorManualDebit = (value, token) => {
  return cAPrivatePost(`balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* vendorManualDebit(values) {
  const { value, token } = values
  try {
    const response = yield call(initiateVendorManualDebit, value, token)
    yield put({
      type: actions.INITIATE_VENDOR_MANUAL_DEBIT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    // yield put({
    //   type : caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
    //   Id:id,
    //   value:{
    //     limit : 50,
    //     activePage:1
    //   },
    //   token
    // })
  } catch (err) {
    yield put({
      type: actions.INITIATE_VENDOR_MANUAL_DEBIT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

// Vendor Client

const initiateVendorClientManualCredit = (id, value, token) => {
  return cAPrivatePost(`accounts/${id}/balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* vendorClientManualCredit(values) {
  const { id, value, token } = values
  try {
    const response = yield call(initiateVendorClientManualCredit, id, value, token)
    yield put({
      type: actions.INITIATE_VENDOR_CLIENT_MANUAL_CREDIT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    yield put({
      type: caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
      Id: id,
      value: {
        limit: 50,
        activePage: 1,
      },
      token,
    })
  } catch (err) {
    yield put({
      type: actions.INITIATE_VENDOR_CLIENT_MANUAL_CREDIT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const initiateVendorClientManualDebit = (id, value, token) => {
  return cAPrivatePost(`accounts/${id}/balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* vendorClientManualDebit(values) {
  const { id, value, token } = values
  try {
    const response = yield call(initiateVendorClientManualDebit, id, value, token)
    yield put({
      type: actions.INITIATE_VENDOR_CLIENT_MANUAL_DEBIT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    yield put({
      type: caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
      Id: id,
      value: {
        limit: 50,
        activePage: 1,
      },
      token,
    })
  } catch (err) {
    yield put({
      type: actions.INITIATE_VENDOR_CLIENT_MANUAL_DEBIT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

// Vendor PL

const initiateVendorPLManualCredit = (id, value, token) => {
  return cAPrivatePost(`accounts/${id}/balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* vendorPLManualCredit(values) {
  const { id, value, token } = values
  try {
    const response = yield call(initiateVendorPLManualCredit, id, value, token)
    yield put({
      type: actions.INITIATE_VENDOR_PL_MANUAL_CREDIT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    yield put({
      type: caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
      Id: id,
      value: {
        limit: 50,
        activePage: 1,
      },
      token,
    })
  } catch (err) {
    yield put({
      type: actions.INITIATE_VENDOR_PL_MANUAL_CREDIT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const initiateVendorPLManualDebit = (id, value, token) => {
  return cAPrivatePost(`accounts/${id}/balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* vendorPLManualDebit(values) {
  const { id, value, token } = values
  try {
    const response = yield call(initiateVendorPLManualDebit, id, value, token)
    yield put({
      type: actions.INITIATE_VENDOR_PL_MANUAL_DEBIT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    yield put({
      type: caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
      Id: id,
      value: {
        limit: 50,
        activePage: 1,
      },
      token,
    })
  } catch (err) {
    yield put({
      type: actions.INITIATE_VENDOR_PL_MANUAL_DEBIT_FAILURE,
      payload: err,
    })

    notification.error({
      message: err.response.data.message,
    })
  }
}

const initiatepAndLManualCredit = (id, value, token) => {
  return cAPrivatePost(`accounts/${id}/balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* pAndLManualCredit(values) {
  const { id, value, token } = values
  try {
    const response = yield call(initiatepAndLManualCredit, id, value, token)
    yield put({
      type: actions.INITIATE_PL_MANUAL_CREDIT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    yield put({
      type: caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
      Id: id,
      value: {
        limit: 50,
        activePage: 1,
      },
      token,
    })
  } catch (err) {
    yield put({
      type: actions.INITIATE_PL_MANUAL_CREDIT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const initiatepAndLManualDebit = (id, value, token) => {
  return cAPrivatePost(`accounts/${id}/balance-adjustment`, value, token).then(response => {
    return response.data
  })
}

export function* pAndLManualDebit(values) {
  const { id, value, token } = values
  try {
    const response = yield call(initiatepAndLManualDebit, id, value, token)
    yield put({
      type: actions.INITIATE_PL_MANUAL_DEBIT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
    yield put({
      type: caTxnActions.UPDATE_SELECED_PAYMENT_TYPE,
      value: '',
    })

    yield put({
      type: caTxnActions.GET_FIAT_BALANCE_TRANSACTIONS_BY_ID,
      Id: id,
      value: {
        limit: 50,
        activePage: 1,
      },
      token,
    })
  } catch (err) {
    yield put({
      type: actions.INITIATE_PL_MANUAL_DEBIT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.message,
    })
  }
}

const initiatePayment = (headerParam, body, token) => {
  return cAPrivatePost(`accounts/${headerParam}/transactions`, body, token).then(response => {
    return response.data
  })
}

export function* initiateCryptoPayment(values) {
  const { id, value, token } = values
  try {
    const response = yield call(initiatePayment, id, value, token)
    yield put({
      type: actions.INITIATE_CRYPTO_PAYMENT_SUCCESS,
      value: response,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.INITIATE_CRYPTO_PAYMENT_FAILURE,
      payload: err,
    })
    notification.error({
      message: err.response.data.data.detail,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.INITIATE_MANUAL_CREDIT, manualCredit),
    takeLatest(actions.INITIATE_MANUAL_DEBIT, manualDebit),

    // remove
    takeLatest(actions.INITIATE_VENDOR_MANUAL_CREDIT, vendorManualCredit),
    takeLatest(actions.INITIATE_VENDOR_MANUAL_DEBIT, vendorManualDebit),

    // new
    // vendor client
    takeLatest(actions.INITIATE_VENDOR_CLIENT_MANUAL_CREDIT, vendorClientManualCredit),
    takeLatest(actions.INITIATE_VENDOR_CLIENT_MANUAL_DEBIT, vendorClientManualDebit),
    // vendor pl
    takeLatest(actions.INITIATE_VENDOR_PL_MANUAL_CREDIT, vendorPLManualCredit),
    takeLatest(actions.INITIATE_VENDOR_PL_MANUAL_DEBIT, vendorPLManualDebit),

    takeLatest(actions.INITIATE_PL_MANUAL_CREDIT, pAndLManualCredit),
    takeLatest(actions.INITIATE_PL_MANUAL_DEBIT, pAndLManualDebit),
    takeLatest(actions.INITIATE_CRYPTO_PAYMENT, initiateCryptoPayment),
  ])
}
