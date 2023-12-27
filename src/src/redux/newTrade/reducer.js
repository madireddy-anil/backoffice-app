import { getDepositAccPreference } from 'utilities/transformer'
import actions from './actions'

const initialState = {
  sourceCurrency: '',
  sourceAmount: '',
  introducerOrMerchant: '',
  introducerOrMerchantProfile: '',
  selectedIntroducer: {},
  selectedMerchant: {},
  selectedClient: {},
  selectedIntroducerClient: {},
  selectedMerchantClient: {},
  depositAccountPreference: '',
  depositsInCorporateAccount: 0,
  depositsInPersonalAccount: 0,
  selectedBeneficiary: {},
  loading: false,
  tradeConfirmed: false,
  canShowIntroducerClient: false,
  canShowMerchantClient: false,
  isSettlementPreferenceSelected: false,
  isCrypto: false,
  isBeneficiaryFetching: false,
}

export default function newTradeReducer(state = initialState, action) {
  switch (action.type) {
    case actions.INITIATE_NEW_TRADE:
      return {
        ...state,
        ...initialState,
      }
    case actions.GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID:
      return {
        ...state,
        isBeneficiaryFetching: true,
      }
    case actions.GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_SUCCESS:
      return {
        ...state,
        isBeneficiaryFetching: false,
      }
    case actions.GET_BENEFICIARY_CRYPTO_BY_CLIENT_ID_FAILURE:
      return {
        ...state,
        isBeneficiaryFetching: false,
      }
    case actions.GET_BENEFICIARY_BY_CLIENT_ID:
      return {
        ...state,
        isBeneficiaryFetching: true,
      }
    case actions.GET_BENEFICIARY_BY_CLIENT_ID_SUCCESS:
      return {
        ...state,
        isBeneficiaryFetching: false,
      }
    case actions.GET_BENEFICIARY_BY_CLIENT_ID_FAILURE:
      return {
        ...state,
        isBeneficiaryFetching: false,
      }
    case actions.HANDLE_SETTLEMENT_PREFERENCE:
      return {
        ...state,
        isSettlementPreferenceSelected: action.value,
      }
    case actions.HANDLE_SETTLEMENT_PREFERENCE_FIAT:
      return {
        ...state,
        isCrypto: false,
      }
    case actions.HANDLE_SETTLEMENT_PREFERENCE_CRYPTO:
      return {
        ...state,
        isCrypto: true,
      }
    case actions.UPDATE_INTRODUCER_OR_MERCHANT:
      return {
        ...state,
        ...initialState,
        introducerOrMerchant: action.value,
      }
    case actions.UPDATE_SELECTED_INTRODUCER:
      return {
        ...state,
        selectedIntroducer: action.value,
        introducerOrMerchantProfile: action.value.profile,
        canShowIntroducerClient: action.value.genericInformation.hasPartnerCompanies,
        depositAccountPreference: getDepositAccPreference(action.value),
      }
    case actions.REMOVE_INTRODUCER:
      return {
        ...state,
        selectedIntroducer: {},
        introducerOrMerchantProfile: '',
        selectedIntroducerClient: {},
        selectedMerchantClient: {},
        selectedBeneficiary: {},
        depositAccountPreference: '',
        sourceAmount: '',
        sourceCurrency: '',
        canShowIntroducerClient: false,
        isSettlementPreferenceSelected: false,
      }
    case actions.UPDATE_SELECTED_MERCHANT:
      return {
        ...state,
        selectedMerchant: action.value,
        introducerOrMerchantProfile: action.value.profile,
        canShowMerchantClient: action.value.genericInformation.hasPartnerCompanies,
        depositAccountPreference: getDepositAccPreference(action.value),
      }
    case actions.REMOVE_MERCHANT:
      return {
        ...state,
        selectedMerchant: {},
        selectedIntroducerClient: {},
        introducerOrMerchantProfile: '',
        selectedMerchantClient: {},
        selectedBeneficiary: {},
        depositAccountPreference: '',
        sourceAmount: '',
        sourceCurrency: '',
        canShowMerchantClient: false,
        isSettlementPreferenceSelected: false,
      }
    case actions.UPDATE_SELECTED_INTRODUCER_CLIENT:
      return {
        ...state,
        selectedIntroducerClient: action.value,
        introducerOrMerchantProfile: action.value.profile,
        depositAccountPreference: getDepositAccPreference(action.value),
      }
    case actions.REMOVE_INTRODUCER_CLIENT:
      return {
        ...state,
        selectedIntroducerClient: {},
        selectedMerchantClient: {},
        selectedBeneficiary: {},
        depositAccountPreference: '',
        sourceAmount: '',
        sourceCurrency: '',
        isSettlementPreferenceSelected: false,
      }
    case actions.UPDATE_SELECTED_MERCHANT_CLIENT:
      return {
        ...state,
        selectedMerchantClient: action.value,
        introducerOrMerchantProfile: action.value.profile,
        depositAccountPreference: getDepositAccPreference(action.value),
      }
    case actions.REMOVE_MERCHANT_CLIENT:
      return {
        ...state,
        selectedMerchantClient: {},
        selectedBeneficiary: {},
        depositAccountPreference: '',
        sourceAmount: '',
        sourceCurrency: '',
        isSettlementPreferenceSelected: false,
      }
    case actions.UPDATE_DEPOSIT_CURRENCY:
      return {
        ...state,
        sourceCurrency: action.value,
      }
    case actions.UPDATE_DEPOSIT_AMOUNT:
      return {
        ...state,
        sourceAmount: action.value,
        depositsInPersonalAccount:
          state.depositAccountPreference === 'PersonalAccount' ? action.value : 0,
        depositsInCorporateAccount:
          state.depositAccountPreference === 'CorporateAccount' ? action.value : 0,
      }
    case actions.SELECTED_TRADE_BENEFICIARY:
      return {
        ...state,
        selectedBeneficiary: action.value,
      }
    case actions.UPDATE_ACCOUNT_PREFERENCE:
      return {
        ...state,
        depositAccountPreference: action.value,
      }
    case actions.REMOVE_BENEFICIARY:
      return {
        ...state,
        selectedBeneficiary: {},
      }
    case actions.CREATE_TRADE:
      return {
        ...state,
        loading: true,
      }
    case actions.CREATE_TRADE_SUCCESS:
      return {
        ...state,
        loading: false,
        tradeConfirmed: true,
        canShowIntroducerClient: false,
        canShowMerchantClient: false,
      }
    case actions.CREATE_TRADE_FAILURE:
      return {
        ...state,
        loading: false,
        tradeConfirmed: false,
        canShowIntroducerClient: false,
        canShowMerchantClient: false,
      }
    default:
      return state
  }
}
