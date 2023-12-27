const actions = {
  CREATE_NEW_BENEFICIARY: 'CREATE_NEW_BENEFICIARY',
  CREATE_NEW_BENEFICIARY_SUCCESS: 'CREATE_NEW_BENEFICIARY_SUCCESS',
  CREATE_NEW_BENEFICIARY_FAILURE: 'CREATE_NEW_BENEFICIARY_FAILURE',

  // TODO: When update api ready, will uncomment this
  // UPDATE_NEW_BENEFICIARY: 'UPDATE_NEW_BENEFICIARY',
  // UPDATE_NEW_BENEFICIARY_SUCCESS: 'UPDATE_NEW_BENEFICIARY_SUCCESS',
  // UPDATE_NEW_BENEFICIARY_FAILURE: 'UPDATE_NEW_BENEFICIARY_FAILURE',
}

export default actions

export const createNewBeneficiary = (value, token) => {
  return {
    type: actions.CREATE_NEW_BENEFICIARY,
    value,
    token,
  }
}

// export const updateNewBeneficiary = (value, token) => {
//   return {
//     type: actions.UPDATE_NEW_BENEFICIARY,
//     value,
//     token,
//   }
// }
