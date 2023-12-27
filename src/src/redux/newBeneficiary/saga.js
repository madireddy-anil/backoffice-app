import { all, takeLatest, put, call } from 'redux-saga/effects'
import { notification } from 'antd'

import axiosMethod from '../../utilities/apiCaller'

import actions from './actions'

const { txnPrivatePost } = axiosMethod

const createBeneficiary = (values, token) => {
  // const body = {
  //   clientId: values.clientId,
  //   bankAccountDetails: {
  //     nameOnAccount: values.nameOnBankAccount ? values.nameOnBankAccount : '',
  //     bankName: values.bankName ? values.bankName : '',
  //     bankAccountCurrency: values.selectedCurrency ? values.selectedCurrency : '',
  //     accountNumber: values.accountNumber ? values.accountNumber : '',
  //     branchCode: values.branchCode ? values.branchCode : '',
  //     iban: values.iban ? values.iban : '',
  //     bicswift: values.bicSwift ? values.bicSwift : '',
  //     beneficiaryReference: values.beneReference ? values.beneReference : '',
  //   },
  //   beneficiaryDetails: {
  //     beneName: values.nameOnBankAccount ? values.nameOnBankAccount : '',
  //     beneficiaryType: values.beneficiaryType ? values.beneficiaryType : '',
  //     beneficiaryCountry: values.beneficiaryCountry ? values.beneficiaryCountry : '',
  //     beneficiaryStreet: values.beneficiaryStreet ? values.beneficiaryStreet : '',
  //     beneficiaryCity: values.benefciaryCity ? values.benefciaryCity : '',
  //     beneficiaryStateOrProvince: values.stateProvince ? values.stateProvince : '',
  //     beneficiaryZipOrPostalCode: values.zipCode ? values.zipCode : '',
  //   },
  //   // intermediaryBankDetails: {
  //   //   intermediarySwiftOrBicCode: '',
  //   //   intermediaryIban: '',
  //   //   intermediaryAccountNumber: '',
  //   //   intermediaryBranchCode: '',
  //   //   intermediaryReference: '',
  //   // },
  // }
  return txnPrivatePost(`tx-service/beneficiary`, values, token).then(response => {
    return response.data.data
  })
}

export function* createNewBeneficiary(values) {
  try {
    const response = yield call(createBeneficiary, values.value, values.token)
    yield put({
      type: actions.CREATE_BENEFICIARY_SUCCESS,
      value: response,
    })
    notification.success({
      message: 'Success!',
      description: 'Created successfully',
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_BENEFICIARY_FAILURE,
      payload: err,
    })
  }
}

export default function* rootSaga() {
  yield all([takeLatest(actions.CREATE_BENEFICIARY, createNewBeneficiary)])
}
