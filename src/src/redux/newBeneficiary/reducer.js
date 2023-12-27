import actions from './actions'

const initialState = {
  selectedCountry: '',
  selectedCurrency: '',
  nameOnAccount: '',
  bankName: '',
  bankAccountCurrency: '',
  bicswift: '',
  accountNumber: '',
  beneficiaryCountry: '',
  beneficiaryType: '',
  beneficiaryCity: '',
  beneficiaryStreet: '',
  beneficiaryState: '',
  beneficiaryZipCode: '',
  loading: false,
  beneficiaryConfirmed: false,
}

export default function newBeneficiaryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.INITIATE_NEW_BENEFICIARY:
      return {
        ...state,
        ...initialState,
      }
    case actions.CREATE_BENEFICIARY:
      return {
        ...state,
        loading: true,
      }
    case actions.CREATE_BENEFICIARY_SUCCESS:
      return {
        ...state,
        loading: false,
        beneficiaryConfirmed: true,
      }
    case actions.CREATE_BENEFICIARY_FAILURE:
      return {
        ...state,
        loading: false,
        beneficiaryConfirmed: false,
      }
    default:
      return state
  }
}
