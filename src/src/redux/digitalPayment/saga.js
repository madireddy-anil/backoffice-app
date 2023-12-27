import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { push } from 'react-router-redux'
import authActions from '../auth0/actions'
import actions from './action'
import axiosMethod from '../../utilities/apiCaller'

const { cAPrivateGet, cAPrivatePost, ppBeneficiaryPrivateGet } = axiosMethod

const getBenficiariesListById = (id, token) => {
  return ppBeneficiaryPrivateGet(`client/${id}`, token).then(response => {
    return response.data.response
  })
}

export function* getBenficiariesById(values) {
  try {
    const response = yield call(getBenficiariesListById, values.id, values.token)
    yield put({
      type: actions.GET_BENEFICIARY_LIST_ID_SUCCESS,
      value: response,
    })
    // notification.success({
    //   message: response.message,
    // })
  } catch (err) {
    yield put({
      type: actions.GET_BENEFICIARY_LIST_ID_FAILURE,
      payload: err,
    })
    // notification.error({
    //   message: err.response.data.message,
    // })
  }
}

const getQuoteDetails = (value, token) => {
  const { sellCurrency, buyCurrency } = value
  const buycurrency = buyCurrency ? `?buyCurrency=${buyCurrency}` : ''
  const sellcurrency = sellCurrency ? `&sellCurrency=${sellCurrency}` : ''
  return cAPrivateGet(`quote${buycurrency}${sellcurrency}`, token).then(response => {
    return response.data.data
  })
}

export function* getQuote(values) {
  try {
    const response = yield call(getQuoteDetails, values.value, values.token)
    yield put({
      type: actions.GET_QUOTE_SUCCESS,
      value: response.quote,
    })
  } catch (err) {
    yield put({
      type: actions.GET_QUOTE_FAILURE,
      payload: err,
    })
    // notification.error({
    //   message: err.response?.data?.data?.errors["invalid-params"]?.sellCurrency,
    // })
  }
}

const gatPaymentData = (body, token) => {
  const {
    entityId,
    accountId,
    creditorAccountId,
    beneficiaryId,
    currencyPair,
    direction,
    type,
    priority,
    amount,
  } = body
  const creditorAccountIdParam = creditorAccountId ? `&creditorAccountId=${creditorAccountId}` : ''
  const beneficiaryIdParam = beneficiaryId ? `&beneficiaryId=${beneficiaryId}` : ''
  return cAPrivateGet(
    `payments/${entityId}/${accountId}/${currencyPair}?direction=${direction}&type=${type}&priority=${priority}&amount=${amount}${creditorAccountIdParam}${beneficiaryIdParam}`,
    token,
  ).then(response => {
    return response.data
  })
}

export function* getPaymentDetails(values) {
  try {
    const response = yield call(gatPaymentData, values.value, values.token)
    yield put({
      type: actions.GET_DIGITAL_PAYMENT_DEATILS_SUCCESS,
      value: response.data,
    })
  } catch (err) {
    yield put({
      type: actions.GET_DIGITAL_PAYMENT_DEATILS_FAILURE,
      payload: err.response.data.data,
    })
    notification.error({
      message:
        err?.response?.data?.data?.title ?? 'Something went wrong! Please try to again .....!',
    })
  }
}

const initiatePayment = (body, token) => {
  return cAPrivatePost(`payments`, body, token).then(response => {
    return response.data
  })
}

export function* newPayment(values) {
  try {
    const response = yield call(initiatePayment, values.value, values.token)
    yield put({
      type: actions.INITIATE_DIGITAL_PAYMENT_SUCCESS,
      value: response.data,
    })
    //
    yield put(push('/new-payment-success'))
    yield put({
      type: authActions.TWO_FA_AUTHORIZATION_MODAL,
      value: false,
    })
    notification.success({
      message: response.message,
    })
  } catch (err) {
    yield put({
      type: actions.INITIATE_DIGITAL_PAYMENT_FAILURE,
      payload: err.response.data.data.errors,
    })
    yield put({
      type: authActions.TWO_FA_AUTHORIZATION_MODAL,
      value: false,
    })
    notification.error({
      message: 'Please check the errors and try to again.....! ',
    })
  }
}

const getBeneficiaryFields = (values, token) => {
  const { beneAccountType, selectedBeneCurrency, selectedBeneCountry } = values
  const type = beneAccountType ? `&type=${beneAccountType}` : ''
  const currency = selectedBeneCurrency ? `?currency=${selectedBeneCurrency}` : ''
  const country = selectedBeneCountry ? `&country=${selectedBeneCountry}` : ''
  return cAPrivateGet(`beneficiaries/validation${currency}${type}${country}`, token).then(
    response => {
      return response.data.data
    },
  )
}

export function* getBeneficiaryFieldList(values) {
  try {
    const response = yield call(getBeneficiaryFields, values.value, values.token)
    yield put({
      type: actions.GET_BENEFICIARY_FIELDS_LIST_SUCCESS,
      value: response,
    })
    // notification.success({
    //   message: response.message,
    // })
  } catch (err) {
    yield put({
      type: actions.GET_BENEFICIARY_FIELDS_LIST_FAILURE,
      payload: err,
    })
    // notification.error({
    //   message: err.response.data.message,
    // })
  }
}

const getLiftFee = value => {
  const entityId = value.entityId ? `&entityId=${value.entityId}` : ''
  const type = value.type ? `&type=${value.type}` : ''
  const currency = value.currency ? `&transactionCurrency=${value.currency}` : ''

  return cAPrivateGet(
    `pricing-payments?${entityId}&direction=outbound${type}&priority=normal${currency}`,
    value.token,
  ).then(response => {
    return response.data.data
  })
}

export function* getLiftingFee(values) {
  try {
    const response = yield call(getLiftFee, values.value)
    yield put({
      type: actions.GET_LIFTING_FEE_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_LIFTING_FEE_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_BENEFICIARY_LIST_ID, getBenficiariesById),
    takeLatest(actions.GET_QUOTE, getQuote),
    takeLatest(actions.GET_DIGITAL_PAYMENT_DEATILS, getPaymentDetails),
    takeLatest(actions.INITIATE_DIGITAL_PAYMENT, newPayment),

    takeLatest(actions.GET_BENEFICIARY_FIELDS_LIST, getBeneficiaryFieldList),
    takeLatest(actions.GET_LIFTING_FEE, getLiftingFee),
  ])
}
