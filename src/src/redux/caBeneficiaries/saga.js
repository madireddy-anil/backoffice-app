import { all, takeEvery, put, call } from 'redux-saga/effects'
// import { push } from 'react-router-redux'
import { notification } from 'antd'
import axiosMethod from '../../utilities/apiCaller'
import { flattenObject } from '../../utilities/transformer'
import digitalPaymentActions from '../digitalPayment/action'
import actions from './action'

const { ppBeneficiaryPrivatePost } = axiosMethod

const createBeneficiary = (values, token) => {
  return ppBeneficiaryPrivatePost(`beneficiary/createBeneficiary`, values, token).then(response => {
    return response.data.beneficiary
  })
}

export function* createNewBeneficiary(values) {
  try {
    const response = yield call(createBeneficiary, values.value, values.token)
    yield put({
      type: actions.CREATE_NEW_BENEFICIARY_SUCCESS,
      value: response,
    })
    const transformedObj = flattenObject(response)
    yield put({
      type: digitalPaymentActions.UPDATE_NEW_BENEFICIARY_DATA,
      value: transformedObj,
    })
    notification.success({
      message: 'Success!',
      description: 'Created successfully',
    })
  } catch (err) {
    yield put({
      type: actions.CREATE_NEW_BENEFICIARY_FAILURE,
      payload: err,
    })
  }
}

// const updateBeneficiary = (values, token) => {
//   return ppBeneficiaryPrivatePost(`beneficiary/createBeneficiary`, values, token).then(response => {
//     return response.data.beneficiary
//   })
// }

// export function* updateNewBeneficiary(values) {
//   try {
//     const response = yield call(updateBeneficiary, values.value, values.token)
//     yield put({
//       type: actions.UPDATE_NEW_BENEFICIARY_SUCCESS,
//       value: response,
//     })
//     notification.success({
//       message: 'Success!',
//       description: 'Updated successfully',
//     })
//   } catch (err) {
//     yield put({
//       type: actions.UPDATE_NEW_BENEFICIARY_FAILURE,
//       payload: err,
//     })
//   }
// }

export default function* rootSaga() {
  yield all(
    [takeEvery(actions.CREATE_NEW_BENEFICIARY, createNewBeneficiary)],
    // [takeEvery(actions.UPDATE_NEW_BENEFICIARY, updateNewBeneficiary)]
  )
}
