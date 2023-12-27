const actions = {
  INITIATE_NEW_BENEFICIARY: 'INITIATE_NEW_BENEFICIARY',

  CREATE_BENEFICIARY: 'CREATE_BENEFICIARY',
  CREATE_BENEFICIARY_SUCCESS: 'CREATE_BENEFICIARY_SUCCESS',
  CREATE_BENEFICIARY_FAILURE: 'CREATE_BENEFICIARY_FAILURE',
}
export default actions

export const initiateNewBeneficiary = () => {
  return {
    type: actions.INITIATE_NEW_BENEFICIARY,
  }
}

export const createBeneficiary = (value, token) => {
  return {
    type: actions.CREATE_BENEFICIARY,
    value,
    token,
  }
}
