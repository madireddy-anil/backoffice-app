import actions from './action'

const initialState = {
  beneficiaries: [],
}

export default function beneficiaryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.CREATE_NEW_BENEFICIARY_SUCCESS:
      return {
        ...state,
        beneficiaries: action.value,
      }

    default:
      return state
  }
}
