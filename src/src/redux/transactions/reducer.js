import { getLocalDepositAccountNames } from 'utilities/transformer'
import actions from './actions'
import cryptoActions from '../cryptoTransactions/actions'

const initialState = {
  allTransactions: [],
  createBuyRateLoading: false,
  totalTransactions: 0,
  txnConfirmReceivedAmountLoading: false,
  txnConfirmRemittedFundsLoading: false,
  selectedTransaction: {
    id: '',
    clientId: '',
    vendorId: '',
    vendorName: '',
    sourceAmount: '',
    sourceCurrency: '',
    beneficiary: {
      bankAccountDetails: { nameOnAccount: '', accountNumber: '' },
    },
    localDepositAccounts: [],
    progressLogs: {
      transactionRequestedAt: '',
      bankAccountsRequestedToVendorAt: '',
      bankAccountsReceivedByVendorAt: '',
      depositsReceiptConfirmationByVendorAt: '',
    },
    depositsInPersonalAccount: 0,
    depositsInCorporateAccount: 0,
    amountSold: 0,
  },
  deletionLoadingTransactions: false,
  selectedRemittanceSlipsAccountsOnly: [],
  selectedRemittanceSlipsSwap: [],
  selectedRemittanceSlipsFX: [],
  accountsOnlyRemmitanceSlipTotal: 0,
  swapRemmitanceSlipTotal: 0,
  fxRemmitanceSlipTotal: 0,
  txnLoading: false,
  isEditTxnMode: false,

  isTransactionDetailsFetched: false,
  isBeneficiarySelected: false,
  isAccountsRequestedToVendor: false,
  isAccountsReceivedFromVendor: false,
  isLocalAccountsProvided: false,
  isReceivedAmountConfirmed: false,
  isRemittanceSlipUploadedAccountsOnly: false,
  isRemittanceSlipUploadedSwap: false,
  isRemittanceSlipUploadedFx: false,
  isQuoteConfirmed: false,
  isAmountSoldConfirmed: false,
  isRemittedFundsConfirmed: false,
  currentRouteType: '',
  selectedVendorInNew: {},
  selectedBeneficiaryInNew: {},
  sourceAmountInNew: '',
  sourceCurrencyInNew: '',
  updateTxnAmountLoader: false,
  confirmAmountSoldLoader: false,
  conformReceivedAmountLoader: false,
  txnValuesUpdateLoader: false,
  fxBaseRatesByVendor: [],
  rate: {
    isInverse: false,
    isDayRate: false,
    isPrecisionApply: false,
    precision: '',
    rateAppliedAt: '',
    tradeCurrency: '',
    targetCurrency: '',
    baseAmount: 1,
    tradeAmount: '',
    expectedRemittanceAmount: '',
    expectedSpread: '',
    expectedRate: '',
    actualRemittanceAmount: '',
    actualSpread: '',
    actualRate: '',
    fxProvider: '',
    fxRate: '',
    spreadDifference: '',
    inputRate: '',
    sellRate: '',
  },
  selectedVendor: {},
  fees: [],
  rates: [],

  // local deposists
  allBankAccounts: [],
  selectedAccountNames: [],
  updateBankAccLoading: false,
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  fxRateByVendorLoader: false,
}

export default function transactionsReducer(state = initialState, action) {
  switch (action.type) {
    case cryptoActions.UPDATE_ROUTE_TYPE:
      return {
        ...state,
        currentRouteType: action.value,
      }
    case actions.HANDLE_TXN_FEE_CALCULATION_SUCCESS:
      if (action.value.feeType !== 'pc_revenue') {
        return {
          ...state,
          fees: [action.value, ...state.fees],
        }
      }
      return {
        ...state,
      }

    case actions.HANDLE_TXN_FEE_CALCULATION_FAILURE:
      return {
        ...state,
      }
    case actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_ACCOUNTS_ONLY:
      return {
        ...state,
        selectedRemittanceSlipsAccountsOnly: action.value.payslips,
        isRemittanceSlipUploadedAccountsOnly: action.value.payslips
          ? action.value.payslips.length !== 0
          : false,
        accountsOnlyRemmitanceSlipTotal: action.value.total,
      }
    case actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_SWAP:
      return {
        ...state,
        selectedRemittanceSlipsSwap: action.value.payslips,
        isRemittanceSlipUploadedSwap: action.value.payslips
          ? action.value.payslips.length !== 0
          : false,
        swapRemmitanceSlipTotal: action.value.total,
      }

    case actions.GET_DEPOSIT_SLIPS_BY_TRANSACTION_ID_SUCCESS_FX:
      return {
        ...state,
        selectedRemittanceSlipsFX: action.value.payslips,
        isRemittanceSlipUploadedFx: action.value.payslips
          ? action.value.payslips.length !== 0
          : false,
        fxRemmitanceSlipTotal: action.value.total,
      }

    case actions.CREATE_REMITTANCE_SLIP_SUCCESS_ACCOUNTS_ONLY:
      return {
        ...state,
        selectedRemittanceSlipsAccountsOnly: [
          ...action.value,
          ...state.selectedRemittanceSlipsAccountsOnly,
        ],
        isRemittanceSlipUploadedAccountsOnly: action.value ? action.value.length !== 0 : false,
      }

    case actions.CREATE_REMITTANCE_SLIP_SUCCESS_SWAP:
      return {
        ...state,
        selectedRemittanceSlipsSwap: [...action.value, ...state.selectedRemittanceSlipsSwap],
        isRemittanceSlipUploadedSwap: action.value ? action.value.length !== 0 : false,
      }

    case actions.CREATE_REMITTANCE_SLIP_SUCCESS_FX:
      return {
        ...state,
        selectedRemittanceSlipsFX: [...action.value, ...state.selectedRemittanceSlipsFX],
        isRemittanceSlipUploadedFx: action.value ? action.value.length !== 0 : false,
      }

    case actions.INITIATE_TRANSACTION:
      return {
        ...state,
        ...initialState,
      }
    case actions.GET_ALL_TRANSACTIONS:
      return {
        ...state,
        txnLoading: true,
      }
    case actions.GET_ALL_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        txnLoading: false,
        allTransactions: action.value.transactions,
        totalTransactions: action.value.total,
        pagination: {
          ...state.pagination,
          current: action.value.transactions.length > 0 ? state.pagination.current : 1,
          total: action.value.total,
        },
      }
    case actions.GET_ALL_TRANSACTIONS_FAILURE:
      return {
        ...state,
        txnLoading: false,
      }
    case actions.GET_TRANSACTIONS_BY_CLIENT_ID:
      return {
        ...state,
        txnLoading: true,
      }
    case actions.GET_TRANSACTIONS_BY_CLIENT_ID_SUCCESS:
      return {
        ...state,
        txnLoading: false,
        allTransactions: action.value.transactions,
      }
    case actions.GET_TRANSACTIONS_BY_CLIENT_ID_FAILURE:
      return {
        ...state,
        txnLoading: false,
      }
    case actions.CHANGE_EDIT_TXN_MODE:
      return {
        ...state,
        isEditTxnMode: !action.value,
      }
    case actions.SELECTED_VENDOR:
      return {
        ...state,
        selectedVendorInNew: action.value,
      }
    case actions.GET_TRANSACTIONS_BY_ID: {
      return {
        ...state,
        ...initialState,
        txnLoading: true,
        isTransactionDetailsFetched: false,
      }
    }
    case actions.GET_TRANSACTIONS_BY_ID_SUCCESS: {
      const returnNames = getLocalDepositAccountNames(action.value.localDepositAccounts)
      const bene = action.value.beneficiary || {}
      const checkAccRequest = progressLogs => {
        if (progressLogs.bankAccountsRequestedToVendorAt) {
          return progressLogs.bankAccountsRequestedToVendorAt !== null
        }
        return false
      }
      const checkAccReceived = progressLogs => {
        if (progressLogs.bankAccountsReceivedByVendorAt) {
          return progressLogs.bankAccountsReceivedByVendorAt !== null
        }
        return false
      }
      const checkReceivedAmount = progressLogs => {
        if (progressLogs.depositsReceiptConfirmationByVendorAt) {
          return progressLogs.depositsReceiptConfirmationByVendorAt !== null
        }
        return false
      }
      const checkRemittedFunds = progressLogs => {
        if (progressLogs.fundsRemittedByVendorAt) {
          return progressLogs.fundsRemittedByVendorAt !== null
        }
        return false
      }
      const checkQuoteConfirm = progressLogs => {
        if (progressLogs.quoteConfirmedToVendorAt) {
          return progressLogs.quoteConfirmedToVendorAt !== null
        }
        return false
      }
      return {
        ...state,
        selectedAccountNames: returnNames,
        selectedTransaction: {
          ...state.selectedTransaction,
          ...action.value,
          beneficiary: bene,
          sourceCurrency: action.value.depositCurrency,
          sourceAmount: action.value.totalDepositAmount,
        },
        isTransactionDetailsFetched: true,
        isBeneficiarySelected: Object.entries(bene).length !== 0,
        isAccountsRequestedToVendor: action.value.progressLogs
          ? checkAccRequest(action.value.progressLogs)
          : false,
        isAccountsReceivedFromVendor: action.value.progressLogs
          ? checkAccReceived(action.value.progressLogs)
          : false,
        isLocalAccountsProvided: action.value.localDepositAccounts
          ? action.value.localDepositAccounts.length !== 0
          : false,
        isReceivedAmountConfirmed: action.value.progressLogs
          ? checkReceivedAmount(action.value.progressLogs)
          : false,
        isRemittedFundsConfirmed: action.value.progressLogs
          ? checkRemittedFunds(action.value.progressLogs)
          : false,
        txnLoading: false,
        rate: {
          ...state.rate,
          ...(action.value.rateDetails || state.rate),
        },
        isQuoteConfirmed: action.value.progressLogs
          ? checkQuoteConfirm(action.value.progressLogs)
          : false,
        isAmountSoldConfirmed: action.value.amountSold ? action.value.amountSold !== 0 : false,
      }
    }
    case actions.GET_TRANSACTIONS_BY_ID_FAILURE: {
      return {
        ...state,
        txnLoading: false,
      }
    }
    case actions.UPDATE_SELECTED_BENEFICIARY_SUCCESS:
      return {
        ...state,
        selectedTransaction: action.value,
        isBeneficiarySelected: true,
        txnLoading: false,
      }
    case actions.UPDATE_SELECTED_VENDOR_SUCCESS: {
      const bene = action.value.beneficiary || {}
      return {
        ...state,
        selectedTransaction: {
          ...action.value,
          beneficiary: bene,
        },
      }
    }
    case actions.SELECTED_ACCOUNT_REQUESTED_DATE:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          progressLogs: {
            ...state.selectedTransaction.progressLogs,
            bankAccountsRequestedToVendorAt: action.value,
          },
        },
      }
    case actions.SELECTED_ACCOUNT_RECEIVED_DATE:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          progressLogs: {
            ...state.selectedTransaction.progressLogs,
            bankAccountsReceivedByVendorAt: action.value,
          },
        },
      }
    case actions.CONFIRM_ACCOUNT_REQUESTED_DATE_SUCCESS:
      return {
        ...state,
        selectedTransaction: action.value,
        isAccountsRequestedToVendor: true,
      }
    case actions.CONFIRM_ACCOUNT_RECEIVED_DATE_SUCCESS:
      return {
        ...state,
        selectedTransaction: action.value,
        isAccountsReceivedFromVendor: true,
      }
    case actions.CANCEL_TRANSACTION_SUCCESS: {
      const bene = action.value.beneficiary || {}
      return {
        ...state,
        selectedTransaction: {
          ...action.value,
          beneficiary: bene,
        },
      }
    }
    case actions.ENTERED_RECEIVED_AMOUNT: {
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          depositsInPersonalAccount: state.selectedTransaction.isDepositsInPersonalAccount
            ? action.value
            : 0,
          depositsInCorporateAccount: state.selectedTransaction.isDepositsInCorporateAccount
            ? action.value
            : 0,
        },
      }
    }
    case actions.SELECTED_RECEIVED_AMOUNT_CONFIRMATION_DATE:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          progressLogs: {
            ...state.selectedTransaction.progressLogs,
            depositsReceiptConfirmationByVendorAt: action.value,
          },
        },
      }

    case actions.CONFIRM_RECEIVED_AMOUNT:
      return {
        ...state,
        txnConfirmReceivedAmountLoading: true,
      }
    case actions.UPDATE_TRANSACTION_AMOUNT_SUCCESS:
      return {
        ...state,
        selectedTransaction: action.value,
        isReceivedAmountConfirmed: action.value.progressLogs.depositsReceiptConfirmationByVendorAt,
        txnConfirmReceivedAmountLoading: false,
      }
    case actions.ENTERED_REMITTED_AMOUNT:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          settlementAmount: action.value,
        },
      }
    case actions.SELECTED_REMITED_AMOUNT_CONFIRMATION_DATE:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          progressLogs: {
            ...state.selectedTransaction.progressLogs,
            fundsRemittedByVendorAt: action.value,
          },
        },
      }
    case actions.CONFIRM_REMITED_FUNDS:
      return {
        ...state,
        txnConfirmRemittedFundsLoading: true,
      }
    case actions.CONFIRM_REMITED_FUNDS_SUCCESS:
      return {
        ...state,
        selectedTransaction: action.value,
        isRemittedFundsConfirmed: action.value.progressLogs.fundsRemittedByVendorAt,
        txnConfirmRemittedFundsLoading: false,
      }
    case actions.UPDATE_VENDOR_DETAILS:
      return {
        ...state,
        selectedVendor: action.value,
        rate: {
          ...state.rate,
          isInverse: action.value?.profile?.tradingPreference?.isInverse || false,
        },
      }
    case actions.GET_FX_BASE_RATE_BY_VENDOR:
      return {
        ...state,
        fxRateByVendorLoader: true,
      }
    case actions.GET_FX_BASE_RATE_BY_VENDOR_SUCCESS:
      return {
        ...state,
        fxBaseRatesByVendor: action.value,
        fxRateByVendorLoader: false,
      }
    case actions.GET_FX_BASE_RATE_BY_VENDOR_FAILURE:
      return {
        ...state,
        fxRateByVendorLoader: false,
      }
    case actions.GET_BUY_RATE:
      return {
        ...state,
        rate: {
          ...state.rate,
          rateAppliedAt: action.value.rateAppliedAt,
        },
      }
    case actions.GET_BUY_RATE_SUCCESS:
      return {
        ...state,
        rate: {
          ...state.rate,
          ...action.value,
        },
      }
    case actions.GET_BUY_RATE_FAILURE:
      return {
        ...state,
      }
    case actions.CHANGE_DAY_RATE:
      return {
        ...state,
        rate: {
          ...state.rate,
          isDayRate: action.value,
        },
      }
    case actions.UPDATE_DAY_RATE:
      return {
        ...state,
        rate: {
          ...state.rate,
          rateAppliedAt: action.value,
        },
      }
    case actions.CHANGE_INVERSE_RATE:
      return {
        ...state,
        rate: {
          ...state.rate,
          isInverse: action.value,
        },
      }
    case actions.CHECK_PRECISION:
      return {
        ...state,
        rate: {
          ...state.rate,
          isPrecisionApply: action.value,
        },
      }
    case actions.UPDATE_PRECISION:
      return {
        ...state,
        rate: {
          ...state.rate,
          precision: action.value,
        },
      }
    case actions.ENTERED_NEW_RATE:
      return {
        ...state,
        rate: {
          ...state.rate,
          inputRate: action.value,
        },
      }
    case actions.UPDATE_TRANSACTION_VALUES:
      return {
        ...state,
        txnValuesUpdateLoader: true,
        confirmAmountSoldLoader:
          action.value.amountSold !== 0 || action.value.amountSold !== null || false,
      }
    case actions.UPDATE_TRANSACTION_VALUES_SUCCESS:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          ...action.value,
        },
        isAmountSoldConfirmed: action.value.amountSold !== 0,
        confirmAmountSoldLoader: false,
        txnValuesUpdateLoader: false,
      }
    case actions.UPDATE_TRANSACTION_VALUES_FAILURE:
      return {
        ...state,
        confirmAmountSoldLoader: false,
        txnValuesUpdateLoader: false,
      }
    case actions.GET_TXN_FEES_BY_TXN_ID_SUCCESS:
      return {
        ...state,
        fees: action.value,
      }
    case actions.GET_TXN_RATES_BY_TXN_ID_SUCCESS:
      return {
        ...state,
        rates: action.value,
      }
    case actions.CREATE_TXN_FEES_SUCCESS:
      return {
        ...state,
        fees: [action.value, ...state.fees],
      }
    case actions.CREATE_TXN_RATES:
      return {
        ...state,
        createBuyRateLoading: true,
      }
    case actions.CREATE_TXN_RATES_SUCCESS:
      return {
        ...state,
        rates: [action.value, ...state.rates],
        rate: {
          ...state.rate,
          ...action.value,
        },
        isQuoteConfirmed: action.value.quoteStatus === 'quote_confirmed',
        createBuyRateLoading: false,
      }

    // local deposits
    case actions.GET_ALL_BANK_ACCOUNTS_BY_VENDOR_SUCCESS:
      return {
        ...state,
        allBankAccounts: action.value,
      }
    case actions.SELECTED_BANK_ACCOUNTS:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          localDepositAccounts: action.values,
        },
        selectedAccountNames: action.accountNames,
      }
    // case actions.UPDATE_LOCAL_AMOUNT:
    //   return {
    //     ...state,
    //     // selectedTransaction: {
    //     //   ...state.selectedTransaction,
    //     //   localDepositAccounts: action.value,
    //     // },
    //   }
    case actions.DELETE_SELECTED_ACCOUNT:
      return {
        ...state,
      }
    case actions.DELETE_SELECTED_ACCOUNT_SUCCESS: {
      const { localDepositAccounts, selectedAccountNames } = action.value
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          localDepositAccounts,
        },
        selectedAccountNames,
      }
    }

    case actions.DELETE_SELECTED_ACCOUNT_FAILURE:
      return {
        ...state,
      }

    case actions.UPDATE_SWAP_TXN_SOURCE_CURRENCY:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          sourceCurrency: action.value,
        },
      }

    case actions.UPDATE_SWAP_TXN_SOURCE_AMOUNT:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          sourceAmount: action.value,
          depositsInPersonalAccount: state.selectedTransaction.isDepositsInPersonalAccount
            ? action.value
            : 0,
          depositsInCorporateAccount: state.selectedTransaction.isDepositsInCorporateAccount
            ? action.value
            : 0,
        },
      }

    case actions.UPDATE_SWAP_TXN_SOURCE_DETAILS:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          depositCurrency: action.value.sourceCurrency,
          depositsInPersonalAccount: state.selectedTransaction.isDepositsInPersonalAccount
            ? action.value.sourceAmount
            : 0,
          depositsInCorporateAccount: state.selectedTransaction.isDepositsInCorporateAccount
            ? action.value.sourceAmount
            : 0,
        },
      }

    case actions.ENTERED_AMOUNT_SOLD:
      return {
        ...state,
        selectedTransaction: {
          ...state.selectedTransaction,
          amountSold: action.value,
        },
      }
    case actions.UPDATE_LOCAL_BANK_ACCOUNTS:
      return {
        ...state,
        updateBankAccLoading: true,
      }
    case actions.UPDATE_LOCAL_BANK_ACCOUNTS_SUCCESS:
      return {
        ...state,
        updateBankAccLoading: false,
        localDepositAccounts: action.value,
      }
    case actions.UPDATE_LOCAL_BANK_ACCOUNTS_FAILURE:
      return {
        ...state,
        updateBankAccLoading: false,
      }
    case actions.HANDLE_TXN_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    case actions.DELETE_REMITTANCE_SLIP_SWAP:
      return {
        ...state,
        deletionLoadingTransactions: true,
      }
    case actions.DELETE_REMITTANCE_SLIP_SUCCESS_ACCOUNTS_ONLY:
      return {
        ...state,
        selectedRemittanceSlipsAccountsOnly: state.selectedRemittanceSlipsAccountsOnly.filter(
          file => file.id !== action.value,
        ),
        deletionLoadingTransactions: false,
      }
    case actions.DELETE_REMITTANCE_SLIP_SUCCESS_SWAP:
      return {
        ...state,
        selectedRemittanceSlipsSwap: state.selectedRemittanceSlipsSwap.filter(
          file => file.id !== action.value,
        ),
        deletionLoadingTransactions: false,
      }
    case actions.DELETE_REMITTANCE_SLIP_FAILURE_SWAP:
      return {
        ...state,
        deletionLoadingTransactions: false,
      }
    case actions.DELETE_REMITTANCE_SLIP_FX:
      return {
        ...state,
        deletionLoadingTransactions: true,
      }
    case actions.DELETE_REMITTANCE_SLIP_SUCCESS_FX:
      return {
        ...state,
        selectedRemittanceSlipsFX: state.selectedRemittanceSlipsFX.filter(
          file => file.id !== action.value,
        ),
        deletionLoadingTransactions: false,
      }
    case actions.DELETE_REMITTANCE_SLIP_FAILURE_FX:
      return {
        ...state,
        deletionLoadingTransactions: false,
      }
    default:
      return state
  }
}
