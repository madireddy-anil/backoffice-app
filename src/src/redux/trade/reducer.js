import { updateObjInArray } from 'utilities/transformer'

import actions from './actions'
import newTradeActions from '../newTrade/actions'
import routeEngineActions from '../routingEngine/actions'
import uploadActions from '../upload/actions'

const initialState = {
  tradeId: '',
  isEditMode: false,
  tradeLoading: false,
  updateTradeAmountLoader: false,
  deleteTradeRateLoading: false,
  deleteTradeFeesLoading: false,
  createManualRouteLoading: false,
  createManualFeesLoading: false,
  createManualRateLoading: false,
  conformDepositLoader: false,
  confirmFundsLoader: false,
  tradeValuesUpdateLoader: false,
  showNextStepNotification: true,

  isChatSelected: false,
  isDepositsInPersonalAccount: false,
  isDepositsInCorporateAccount: false,

  isLocalAccountsRequested: false,
  isLocalAccountsFetched: false,
  isPayslipReceived: false,
  isDepositAmountConfirmed: false,
  isRateFetched: false,
  isRateConfirmed: false,
  isCommissionFetched: false,
  isCommisionConfirmed: false,
  isFundsRemitted: false,
  isFundReceiptConfirmed: false,
  isTradeCompleted: false,
  isSlipDeleteEnabled: true,

  isInverseRate: true,
  isNewCalculation: true,
  isPrecisionApply: false,
  precision: null,
  isXeDateTimeApply: false,
  rateAppliedAt: '',

  rateDetails: {},
  introducerCommission: {
    isRevenue: false,
    isSettlement: false,
    isDeposit: false,
  },
  pcMarginDetails: {
    pcMargin: '',
    pcMarginCurrency: '',
    pcPercentage: null,
  },

  paySlips: [],
  tradeSellRates: [],
  tradeFees: [],

  sourceCurrency: '',
  sourceAmount: '',
  totalDepositAmount: null,
  selectedClient: {},
  selectedIntroducerClient: {},
  bankAccounts: [],
  routeEngineData: [],
  chat: { channelId: '' },
  clientId: '',
  parentId: '',
  beneficiary: {
    beneficiaryDetails: { beneName: '' },
    bankAccountDetails: { bankCurrency: '', accountNumber: '', bicswift: '', bankName: '' },
  },
  localDepositAccounts: [],
  confirmedDepositDateByClient: null,
  confirmedDepositAmountByClient: null,
  depositsInPersonalAccount: 0,
  depositsInCorporateAccount: 0,
  progressLogs: {
    tradeRequestedAt: '',
  },
  fundReceiptConfirmAmountByClient: null,
  fundReceiptConfirmDateByClient: null,
  depositSlipTotal: 0,
  deletionLoadingTrade: false,
  previousChangeStreamIndex: 0,
}

export default function tradeReducer(state = initialState, action) {
  switch (action.type) {
    case actions.UPDATE_BENEFICIARY_DETAILS_TEMP:
      return {
        ...state,
        beneficiary: {},
      }
    case actions.UPDATE_BACKDATED_TRADE_SUCCESS:
      return {
        ...state,
        ...action.value,
      }

    case actions.UPDATE_BACKDATED_TRADE_FAILURE:
      return {
        ...state,
      }

    case actions.UPDATE_CURRENT_TRADE_ID:
      return {
        ...state,
        tradeId: action.value,
      }

    case actions.UPDATE_CURRENT_CHANNEL_DETAILS:
      return {
        ...state,
        chat: {
          ...state.chat,
          channelId: action.value.channelId,
        },
      }

    case actions.UPDATE_BENEFICIARY_DETAILS_SUCCESS:
      return {
        ...state,
        ...action.value,
        beneficiary: action.value.cryptoBeneficiary
          ? action.value.cryptoBeneficiary
          : action.value.beneficiary,
      }

    case newTradeActions.CREATE_TRADE_SUCCESS:
      return {
        ...state,
        ...action.value,
        tradeId: action.value.id,
        clientId: action.value.clientId,
        beneficiary: action.value.cryptoBeneficiary
          ? action.value.cryptoBeneficiary
          : action.value.beneficiary,
      }

    case newTradeActions.UPDATE_TRADE_STATUS_SUCCESS:
      return {
        ...state,
        ...action.value,
      }

    case actions.GET_TRADE_DETAILS_BY_ID:
      return {
        ...initialState,
        tradeLoading: true,
        routeEngineData: [],
      }

    case actions.GET_TRADE_DETAILS_BY_ID_SUCCESS: {
      const checkLocalAccRequest = progressLogs => {
        if (progressLogs.bankAccountsRequestedByClientAt) {
          return progressLogs.bankAccountsRequestedByClientAt !== null
        }
        return false
      }
      const checkLocalAccReceived = progressLogs => {
        if (progressLogs.bankAccountsSharedToClientAt) {
          return progressLogs.bankAccountsSharedToClientAt !== null
        }
        return false
      }
      const checkDepositConfirm = progressLogs => {
        if (progressLogs.depositConfirmedByClientAt) {
          return progressLogs.depositConfirmedByClientAt !== null
        }
        return false
      }
      const checkQuoteConfirm = progressLogs => {
        if (progressLogs.quoteConfirmedByClientAt) {
          return progressLogs.quoteConfirmedByClientAt !== null
        }
        return false
      }
      const checkFundRemit = progressLogs => {
        if (progressLogs.fundsRemittedToClientAt) {
          return progressLogs.fundsRemittedToClientAt !== null
        }
        return false
      }
      const checkFundReceipt = progressLogs => {
        if (progressLogs.fundsRecceiptConfirmationByClientAt) {
          return progressLogs.fundsRecceiptConfirmationByClientAt !== null
        }
        return false
      }
      const checkIntroducerConfirm = progressLogs => {
        if (progressLogs.introducerCommissionConfirmedAt) {
          return progressLogs.introducerCommissionConfirmedAt !== null
        }
        return false
      }
      return {
        ...state,
        ...action.value,
        tradeId: action.value.id,
        sourceCurrency: action.value.depositCurrency,
        sourceAmount: action.value.totalDepositAmount,
        tradeLoading: false,
        selectedClient: action.value.clientName,
        beneficiary: action.value.cryptoBeneficiary
          ? action.value.cryptoBeneficiary
          : action.value.beneficiary,
        isLocalAccountsRequested: action.value.progressLogs
          ? checkLocalAccRequest(action.value.progressLogs)
          : false,
        isLocalAccountsFetched: action.value.progressLogs
          ? checkLocalAccReceived(action.value.progressLogs)
          : false,
        // isLocalAccountsFetched: action.value.localDepositAccounts
        //   ? action.value.localDepositAccounts.length !== 0
        //   : false,
        isDepositAmountConfirmed: action.value.progressLogs
          ? checkDepositConfirm(action.value.progressLogs)
          : false,
        isRateConfirmed: action.value.progressLogs
          ? checkQuoteConfirm(action.value.progressLogs)
          : false,
        isCommisionConfirmed: action.value.progressLogs
          ? checkIntroducerConfirm(action.value.progressLogs)
          : false,
        isFundsRemitted: action.value.progressLogs
          ? checkFundRemit(action.value.progressLogs)
          : false,
        isFundReceiptConfirmed: action.value.progressLogs
          ? checkFundReceipt(action.value.progressLogs)
          : false,
        isSlipDeleteEnabled: action.value.tradeStatus
          ? action.value.tradeStatus !== 'completed'
          : false,
      }
    }

    case actions.GET_ROUTE_BY_TRADE_ID_SUCCESS:
      return {
        ...state,
        routeEngineData: action.value,
      }

    case actions.ADD_NEW_ROUTE_DATA:
      return {
        ...state,
        routeEngineData: [...state.routeEngineData, action.value],
      }

    case actions.CHANGE_EDIT_MODE:
      return {
        ...state,
        isEditMode: !action.value,
      }

    case actions.CHANGE_CHAT_MODE:
      return {
        ...state,
        isChatSelected: action.value,
      }

    case actions.UPDATE_SELECTED_CLIENT_SUCCESS:
      return {
        ...state,
        ...action.value,
        beneficiary: {
          beneficiaryDetails: { beneName: '' },
          bankAccountDetails: { bankCurrency: '', accountNumber: '', bicswift: '', bankName: '' },
        },
      }

    case actions.UPDATE_SOURCE_DETAILS_SUCCESS:
      return {
        ...state,
        ...action.value,
        beneficiary: action.value.cryptoBeneficiary
          ? action.value.cryptoBeneficiary
          : action.value.beneficiary,
      }

    case actions.SELECTED_INTRODUCERS_CLIENT:
      return {
        ...state,
        selectedIntroducerClient: action.value,
      }

    case actions.ENTERED_DEPOSIT_CONFIRMATION_AMOUNT:
      return {
        ...state,
        depositsInPersonalAccount: state.isDepositsInPersonalAccount ? action.value : 0,
        depositsInCorporateAccount: state.isDepositsInCorporateAccount ? action.value : 0,
      }

    case actions.UPDATE_TRADE_AMOUNT_SUCCESS:
      return {
        ...state,
        ...action.value,
      }

    case actions.SELECTED_DEPOSIT_CONFIRMATION_DATE:
      return {
        ...state,
        progressLogs: {
          ...state.progressLogs,
          depositConfirmedByClientAt: action.value,
        },
      }

    case actions.UPDATE_DEPOSITED_AMOUNT:
      return {
        ...state,
        conformDepositLoader: true,
      }
    case actions.UPDATE_DEPOSITED_AMOUNT_SUCCESS:
      return {
        ...state,
        ...action.value,
        isDepositAmountConfirmed: true,
        conformDepositLoader: false,
      }
    case actions.UPDATE_DEPOSITED_AMOUNT_FAILURE:
      return {
        ...state,
        conformDepositLoader: false,
      }

    case actions.UPDATE_TRADE_DETAILS:
      return {
        ...state,
        tradeValuesUpdateLoader: true,
      }
    case actions.UPDATE_TRADE_DETAILS_SUCCESS:
      return {
        ...state,
        ...action.value,
        tradeValuesUpdateLoader: false,
      }
    case actions.UPDATE_TRADE_DETAILS_FAILURE:
      return {
        ...state,
        tradeValuesUpdateLoader: false,
      }

    case actions.ENTERED_FUNDS_RECEIPT_CONFIRMATION_AMOUNT:
      return {
        ...state,
        fundReceiptConfirmAmountByClient: action.value,
      }

    case actions.SELECTED_FUNDS_RECEIPT_CONFIRMATION_DATE:
      return {
        ...state,
        fundReceiptConfirmDateByClient: action.value,
      }

    case actions.CONFIRM_FINAL_FUNDS:
      return {
        ...state,
        confirmFundsLoader: true,
      }
    case actions.CONFIRM_FINAL_FUNDS_SUCCESS:
      return {
        ...state,
        ...action.value,
        isFundReceiptConfirmed: true,
        confirmFundsLoader: false,
      }
    case actions.CONFIRM_FINAL_FUNDS_FAILURE:
      return {
        ...state,
        confirmFundsLoader: false,
      }

    // case actions.UPDATE_CS_CURRENT_TRADE: {
    //   const { trade, changeStramIndex } = action.payload
    //   if (changeStramIndex !== state.previousChangeStreamIndex) {
    //     const checkLocalAccRequest = progressLogs => {
    //       if (progressLogs.bankAccountsRequestedByClientAt) {
    //         return progressLogs.bankAccountsRequestedByClientAt !== null
    //       }
    //       return false
    //     }
    //     const checkLocalAccReceived = progressLogs => {
    //       if (progressLogs.bankAccountsSharedToClientAt) {
    //         return progressLogs.bankAccountsSharedToClientAt !== null
    //       }
    //       return false
    //     }
    //     const checkDepositConfirm = progressLogs => {
    //       if (progressLogs.depositConfirmedByClientAt) {
    //         return progressLogs.depositConfirmedByClientAt !== null
    //       }
    //       return false
    //     }
    //     const checkQuoteConfirm = progressLogs => {
    //       if (progressLogs.quoteConfirmedByClientAt) {
    //         return progressLogs.quoteConfirmedByClientAt !== null
    //       }
    //       return false
    //     }
    //     const checkFundRemit = progressLogs => {
    //       if (progressLogs.fundsRemittedToClientAt) {
    //         return progressLogs.fundsRemittedToClientAt !== null
    //       }
    //       return false
    //     }
    //     const checkFundReceipt = progressLogs => {
    //       if (progressLogs.fundsRecceiptConfirmationByClientAt) {
    //         return progressLogs.fundsRecceiptConfirmationByClientAt !== null
    //       }
    //       return false
    //     }
    //     const checkIntroducerConfirm = progressLogs => {
    //       if (progressLogs.introducerCommissionConfirmedAt) {
    //         return progressLogs.introducerCommissionConfirmedAt !== null
    //       }
    //       return false
    //     }
    //     let { sellRates, transactions, cryptoTransactions } = trade
    //     if (sellRates.length !== 0) {
    //       sellRates = sellRates.map(rate => {
    //         rate.inverseAmount = formatNumberDecimal(rate.inverseAmount)
    //         rate.sellRate = formatNumberDecimal(rate.sellRate)
    //         rate.sellRateInverse = formatNumberDecimal(rate.sellRateInverse)
    //         rate.settlementAmount = formatNumberDecimal(rate.settlementAmount)
    //         rate.targetAmount = formatNumberDecimal(rate.targetAmount)
    //         return rate
    //       })
    //     }
    //     trade.sellRates = sellRates

    //     if (cryptoTransactions.length !== 0) {
    //       cryptoTransactions = cryptoTransactions.map(cryptoTransaction => {
    //         const { buyRates } = cryptoTransaction

    //         const newBuyRates = buyRates.map(rate => {
    //           rate.baseAmount = rate.baseAmount ? formatNumberDecimal(rate.baseAmount) : 0
    //           rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
    //           rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
    //           rate.sellRateInverse = rate.sellRateInverse
    //             ? formatNumberDecimal(rate.sellRateInverse)
    //             : 0
    //           rate.settlementAmount = rate.settlementAmount
    //             ? formatNumberDecimal(rate.settlementAmount)
    //             : 0
    //           rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
    //           return rate
    //         })
    //         cryptoTransaction.buyRates = newBuyRates
    //         return cryptoTransaction
    //       })
    //       trade.cryptoTransactions = cryptoTransactions
    //     }

    //     if (transactions.length !== 0) {
    //       transactions = transactions.map(transaction => {
    //         const { buyRates } = transaction

    //         const newBuyRates = buyRates.map(rate => {
    //           rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
    //           rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
    //           rate.sellRateInverse = rate.sellRateInverse
    //             ? formatNumberDecimal(rate.sellRateInverse)
    //             : 0
    //           rate.settlementAmount = rate.settlementAmount
    //             ? formatNumberDecimal(rate.settlementAmount)
    //             : 0
    //           rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
    //           return rate
    //         })
    //         transaction.buyRates = newBuyRates
    //         return transaction
    //       })
    //       trade.transactions = transactions
    //     }
    //     return {
    //       ...state,
    //       ...trade,
    //       previousChangeStreamIndex: changeStramIndex,
    //       isLocalAccountsRequested: trade.progressLogs
    //         ? checkLocalAccRequest(trade.progressLogs)
    //         : false,
    //       isLocalAccountsFetched: trade.progressLogs
    //         ? checkLocalAccReceived(trade.progressLogs)
    //         : false,
    //       // isLocalAccountsFetched: action.value.localDepositAccounts
    //       //   ? action.value.localDepositAccounts.length !== 0
    //       //   : false,
    //       isDepositAmountConfirmed: trade.progressLogs
    //         ? checkDepositConfirm(trade.progressLogs)
    //         : false,
    //       isRateConfirmed: trade.progressLogs ? checkQuoteConfirm(trade.progressLogs) : false,
    //       isCommisionConfirmed: trade.progressLogs
    //         ? checkIntroducerConfirm(trade.progressLogs)
    //         : false,
    //       isFundsRemitted: trade.progressLogs ? checkFundRemit(trade.progressLogs) : false,
    //       isFundReceiptConfirmed: trade.progressLogs ? checkFundReceipt(trade.progressLogs) : false,
    //       isSlipDeleteEnabled: trade.tradeStatus ? trade.tradeStatus !== 'completed' : false,
    //     }
    //   }
    //   return {
    //     ...state,
    //   }
    // }

    case actions.CREATE_ROUTE_SUCCESS:
      return {
        ...state,
        routeEngineData: [...state.routeEngineData, action.value],
      }

    case actions.CREATE_MANUAL_ROUTE:
      return {
        ...state,
        createManualRouteLoading: true,
      }
    case actions.CREATE_MANUAL_ROUTE_SUCCESS:
      return {
        ...state,
        routeEngineData: [...state.routeEngineData, action.value],
        createManualRouteLoading: false,
      }
    case actions.CREATE_MANUAL_ROUTE_FAILURE:
      return {
        ...state,
        createManualRouteLoading: false,
      }

    case actions.CREATE_MANUAL_RATE:
      return {
        ...state,
        createManualRateLoading: true,
      }
    case actions.CREATE_MANUAL_RATE_SUCCESS:
      return {
        ...state,
        tradeSellRates: [...state.tradeSellRates, action.value],
        createManualRateLoading: false,
      }
    case actions.CREATE_MANUAL_RATE_FAILURE:
      return {
        ...state,
        createManualRateLoading: false,
      }

    case actions.CREATE_MANUAL_FEES:
      return {
        ...state,
        createManualFeesLoading: true,
      }
    case actions.CREATE_MANUAL_FEES_SUCCESS:
      return {
        ...state,
        tradeFees: [...state.tradeFees, action.value],
        createManualFeesLoading: false,
      }
    case actions.CREATE_MANUAL_FEES_FAILURE:
      return {
        ...state,
        createManualFeesLoading: false,
      }

    case routeEngineActions.UPDATE_ROUTE_DETAILS_SUCCESS: {
      const newArray = updateObjInArray(state.routeEngineData, action.value)
      return {
        ...state,
        routeEngineData: newArray,
      }
    }

    case actions.UPDATE_ROUTE_ON_CANCEL_TXN_SUCCESS: {
      const newArray = updateObjInArray(state.routeEngineData, action.value)
      return {
        ...state,
        routeEngineData: newArray,
      }
    }

    case actions.UPDATE_ROUTE_ON_DELETE_TXN_SUCCESS: {
      const newArray = updateObjInArray(state.routeEngineData, action.value)
      return {
        ...state,
        routeEngineData: newArray,
      }
    }

    case actions.UPDATE_SOURCE_CURRENCY:
      return {
        ...state,
        sourceCurrency: action.value,
      }

    case actions.UPDATE_SOURCE_AMOUNT:
      return {
        ...state,
        sourceAmount: action.value,
        depositsInPersonalAccount: state.isDepositsInPersonalAccount ? action.value : 0,
        depositsInCorporateAccount: state.isDepositsInCorporateAccount ? action.value : 0,
      }

    case actions.UPDATE_SELECTED_SOURCE_DETAILS:
      return {
        ...state,
        depositCurrency: action.value.sourceCurrency,
        depositsInPersonalAccount: state.isDepositsInPersonalAccount
          ? action.value.sourceAmount
          : 0,
        depositsInCorporateAccount: state.isDepositsInCorporateAccount
          ? action.value.sourceAmount
          : 0,
      }

    case actions.CHANGE_INVERSE_RATE:
      return {
        ...state,
        isInverseRate: action.value,
      }

    case actions.CHANGE_NEW_CALCULATION:
      return {
        ...state,
        isNewCalculation: action.value,
      }

    case actions.APPLY_PRECISION_CHECK:
      return {
        ...state,
        isPrecisionApply: action.value,
      }

    case actions.ENTERED_PRECISION:
      return {
        ...state,
        precision: action.value,
      }

    case actions.APPLY_XE_DATE_TIME_CHECK:
      return {
        ...state,
        isXeDateTimeApply: action.value,
      }

    case actions.UPDATE_XE_DATE_TIME:
      return {
        ...state,
        rateAppliedAt: action.value,
      }

    case actions.GET_RATE:
      return {
        ...state,
        isRateFetched: false,
      }

    case actions.GET_RATE_SUCCESS:
      return {
        ...state,
        rateDetails: action.value,
        isRateFetched: true,
      }

    case actions.GET_RATES_BY_TRADE_ID:
      return {
        ...state,
      }
    case actions.GET_RATES_BY_TRADE_ID_SUCCESS:
      return {
        ...state,
        tradeSellRates: action.value,
        ...action.value.sellRates,
      }
    case actions.GET_RATES_BY_TRADE_ID_FAILURE:
      return {
        ...state,
      }

    case actions.UPDATE_SELL_RATE:
      return {
        ...state,
      }
    case actions.UPDATE_SELL_RATE_SUCCESS: {
      const { value } = action
      const sellRates = [...state.sellRates]
      const index = sellRates.findIndex(e => e.id === value.id)

      if (index !== -1) {
        sellRates[index] = value
        return {
          ...state,
          sellRates,
        }
      }

      return {
        ...state,
      }
    }
    case actions.UPDATE_SELL_RATE_FAILURE:
      return {
        ...state,
      }

    case actions.GET_FEES_BY_TRADE_ID_SUCCESS:
      return {
        ...state,
        tradeFees: action.value.fees,
      }

    case actions.CREATE_RATE_RECORD_SUCCESS:
      return {
        ...state,
        tradeSellRates: [...state.tradeSellRates, action.value],
        rateDetails: action.value,
        isRateConfirmed: action.value.quoteStatus === 'quote_confirmed',
      }

    case actions.GET_DEPOSIT_SLIPS_BY_TRADE_ID_SUCCESS:
      return {
        ...state,
        paySlips: action.value.payslips,
        isPayslipReceived: action.value.payslips.length !== 0,
        depositSlipTotal: action.value.total,
      }

    case uploadActions.CREATE_DEPOSIT_SLIP_SUCCESS:
      return {
        ...state,
        paySlips: [...action.value, ...state.paySlips],
        depositSlipTotal: state.depositSlipTotal + action.value.length,
      }

    case actions.UPDATE_CURRENT_TRADE_CLIENT:
      return {
        ...state,
        introducerCommission: {
          ...state.introducerCommission,
          isRevenue: action.value.profile.commissionType === 'onrevenue',
          isSettlement: action.value.profile.commissionType === 'onsettlementamount',
          isDeposit: action.value.profile.commissionType === 'ontradeamount',
        },
      }

    case actions.CHANGE_REVENUE:
      return {
        ...state,
        introducerCommission: {
          ...state.introducerCommission,
          isRevenue: action.value,
          isSettlement: false,
          isDeposit: false,
        },
        isCommissionFetched: false,
      }

    case actions.CHANGE_SETTLEMENT:
      return {
        ...state,
        introducerCommission: {
          ...state.introducerCommission,
          isRevenue: false,
          isSettlement: action.value,
          isDeposit: false,
        },
        isCommissionFetched: false,
      }

    case actions.CHANGE_DEPOSIT:
      return {
        ...state,
        introducerCommission: {
          ...state.introducerCommission,
          isRevenue: false,
          isSettlement: false,
          isDeposit: action.value,
        },
        isCommissionFetched: false,
      }

    case actions.UPDATE_FEES_PC_MARGIN_SUCCESS:
      return {
        ...state,
        pcMarginDetails: {
          ...state.pcMarginDetails,
          pcMargin: action.value.actualFees,
          pcMarginCurrency: action.value.feeCurrency,
        },
      }

    case actions.GET_TRADE_PC_MARGIN_SUCCESS:
      return {
        ...state,
        pcMarginDetails: {
          ...state.pcMarginDetails,
          pcMargin: action.value,
          // pcMarginCurrency: action.value,
          // pcPercentage: action.value,
        },
      }

    case actions.ENTERED_PC_MARGIN_PERCENTAGE:
      return {
        ...state,
        pcMarginDetails: {
          ...state.pcMarginDetails,
          pcPercentage: action.value,
        },
      }
    case actions.GET_INTRODUCER_COMMISION_SUCCESS:
      return {
        ...state,
        introducerCommission: {
          ...state.introducerCommission,
          ...action.value,
        },
        pcMarginDetails: {
          ...state.pcMarginDetails,
          pcMargin: action.value.introducerCommission,
          pcMarginCurrency: action.value.introducerCommissionCurrency,
          pcPercentage: action.value.clientSpread,
        },
        isCommissionFetched: true,
      }

    case actions.GET_INTRODUCER_COMMISION_FAILURE:
      return {
        ...state,
        isCommissionFetched: false,
      }

    case actions.UPDATE_INTRODUCERS_CLIENT_SUCCESS:
      return {
        ...state,
        isCommisionConfirmed: true,
      }
    case actions.UPDATE_INTRODUCERS_CLIENT_FAILURE:
      return {
        ...state,
        isCommisionConfirmed: false,
      }

    case uploadActions.INITIATE_UPLOAD_SUCCESS:
      return {
        ...state,
        isPayslipReceived: true,
      }

    case uploadActions.INITIATE_UPLOAD_FAILURE:
      return {
        ...state,
        isPayslipReceived: false,
      }

    case actions.SHOW_NEXT_STEP_NOTIFICATION:
      return {
        ...state,
        showNextStepNotification: true,
      }
    case actions.CLOSE_NEXT_STEP_NOTIFICATION:
      return {
        ...state,
        showNextStepNotification: false,
      }
    case actions.DELETE_TRADE_RATE:
      return {
        ...state,
        deleteTradeRateLoading: true,
      }
    case actions.DELETE_TRADE_RATE_SUCCESS:
      return {
        ...state,
        deleteTradeRateLoading: false,
      }
    case actions.DELETE_TRADE_RATE_FAILURE:
      return {
        ...state,
        deleteTradeRateLoading: false,
      }

    case actions.DELETE_TRADE_FEES:
      return {
        ...state,
        deleteTradeFeesLoading: true,
      }
    case actions.DELETE_TRADE_FEES_SUCCESS:
      return {
        ...state,
        deleteTradeFeesLoading: false,
      }
    case actions.DELETE_TRADE_FEES_FAILURE:
      return {
        ...state,
        deleteTradeFeesLoading: false,
      }
    case actions.DELETE_DEPOSIT_SLIP:
      return {
        ...state,
        deletionLoadingTrade: true,
      }
    case actions.DELETE_DEPOSIT_SLIP_SUCCESS:
      return {
        ...state,
        paySlips: state.paySlips.filter(file => file.id !== action.value),
        deletionLoadingTrade: false,
      }
    case actions.DELETE_DEPOSIT_SLIP_FAILURE:
      return {
        ...state,
        deletionLoadingTrade: false,
      }
    default:
      return state
  }
}
