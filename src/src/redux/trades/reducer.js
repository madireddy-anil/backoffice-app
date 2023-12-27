import { formatNumberDecimal } from 'utilities/transformer'
import actions from './actions'

const initialState = {
  totalTransfer: [],
  // pagination: {},
  clientName: '',
  loading: false,
  activeChannel: {},
  pagination: {
    pageSize: 10,
    current: 1,
    total: 0,
  },
  isDownloadDisabled: false,
  allTradesDownload: [],
  totalTradesDownload: 0,
  previousChangeStreamIndex: 0,
  appliedTradeFilters: {},
}

export default function tradesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_TRADES_FILTERS:
      return {
        ...state,
        appliedTradeFilters: action.value,
      }
    case actions.GET_TRADES:
      return {
        ...state,
        loading: true,
        isDownloadDisabled: true,
      }
    case actions.GET_TRADES_SUCCESS:
      return {
        ...state,
        totalTransfer: action.value.trades,
        allTradesDownload: action.value.trades,
        loading: false,
        isDownloadDisabled: false,
        pagination: {
          ...state.pagination,
          current: action.value.trades.length > 0 ? state.pagination.current : 1,
          total: action.value.total,
        },
        clientName: action.value.trades.length
          ? action.value.trades[0].clientName
          : state.clientName,
      }
    case actions.GET_TRADES_FAILURE:
      return {
        ...state,
        totalTransfer: [],
        loading: false,
        clientName: '',
        isDownloadDisabled: false,
      }

    case actions.UPDATE_TRADES_SUCCESS:
      return {
        ...state,
        pagination: action.tradesData,
        loading: false,
      }
    case actions.UPDATE_TRADES_FAILURE:
      return {
        ...state,
        loading: false,
      }

    case actions.UPDATE_DAY_FROM:
      return {
        ...state,
        dateFrom: action.dayFrom,
      }
    case actions.UPDATE_DAY_TO:
      return {
        ...state,
        dateTo: action.dayTo,
      }
    case actions.CLEAR_DATES:
      return {
        ...state,
        dateFrom: '',
        dateTo: '',
      }
    case actions.SET_ACTIVE_CHANNEL:
      return {
        ...state,
        activeChannel: action.value,
      }
    case actions.INSERT_CS_NEW_TRADE: {
      const { trade, changeStramIndex } = action.payload
      if (changeStramIndex !== state.previousChangeStreamIndex) {
        const totalTransfer = [...state.totalTransfer]
        const index = totalTransfer.findIndex(e => e.id === trade.id)
        if (index === -1) {
          return {
            ...state,
            totalTransfer: [trade, ...state.totalTransfer],
            previousChangeStreamIndex: changeStramIndex,
          }
        }
      }
      return {
        ...state,
      }
    }

    case actions.GET_TRADES_BULK_DOWNLOAD:
      return {
        ...state,
        isDownloadDisabled: true,
        loading: true,
      }
    case actions.GET_TRADES_BULK_DOWNLOAD_SUCCESS:
      return {
        ...state,
        totalTransfer: action.value.trades,
        allTradesDownload: action.value.trades,
        totalTradesDownload: action.value.total,
        isDownloadDisabled: false,
        loading: false,
        pagination: {
          ...state.pagination,
          current: action.value.trades.length > 0 ? state.pagination.current : 1,
          total: action.value.total,
        },
      }
    case actions.GET_TRADES_BULK_DOWNLOAD_FAILURE:
      return {
        ...state,
        isDownloadDisabled: false,
        loading: false,
      }
    case actions.HANDLE_TRADES_PAGINATION:
      return {
        ...state,
        pagination: action.value,
      }
    case actions.UPDATE_DOWNLOADABLE_DATA:
      return {
        ...state,
        allTradesDownload: action.value,
        totalTradesDownload: action.value.length,
      }
    case actions.UPDATE_CS_TRDAE: {
      const { trade, changeStramIndex } = action.payload
      if (changeStramIndex !== state.previousChangeStreamIndex) {
        const totalTransfer = [...state.totalTransfer]
        const index = totalTransfer.findIndex(e => e.id === trade.id)

        let { sellRates, cryptoTransactions, transactions } = trade
        if (sellRates.length !== 0) {
          sellRates = sellRates.map(rate => {
            rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
            rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
            rate.sellRateInverse = rate.sellRateInverse
              ? formatNumberDecimal(rate.sellRateInverse)
              : 0
            rate.settlementAmount = rate.settlementAmoun
              ? formatNumberDecimal(rate.settlementAmount)
              : 0
            rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
            return rate
          })
        }
        trade.sellRates = sellRates

        if (cryptoTransactions.length !== 0) {
          cryptoTransactions = cryptoTransactions.map(cryptoTransaction => {
            const { buyRates } = cryptoTransaction

            const newBuyRates = buyRates.map(rate => {
              rate.baseAmount = rate.baseAmount ? formatNumberDecimal(rate.baseAmount) : 0
              rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
              rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
              rate.sellRateInverse = rate.sellRateInverse
                ? formatNumberDecimal(rate.sellRateInverse)
                : 0
              rate.settlementAmount = rate.settlementAmount
                ? formatNumberDecimal(rate.settlementAmount)
                : 0
              rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
              return rate
            })
            cryptoTransaction.buyRates = newBuyRates
            return cryptoTransaction
          })
          trade.cryptoTransactions = cryptoTransactions
        }

        if (transactions.length !== 0) {
          transactions = transactions.map(transaction => {
            const { buyRates } = transaction

            const newBuyRates = buyRates.map(rate => {
              rate.inverseAmount = rate.inverseAmount ? formatNumberDecimal(rate.inverseAmount) : 0
              rate.sellRate = rate.sellRate ? formatNumberDecimal(rate.sellRate) : 0
              rate.sellRateInverse = rate.sellRateInverse
                ? formatNumberDecimal(rate.sellRateInverse)
                : 0
              rate.settlementAmount = rate.settlementAmount
                ? formatNumberDecimal(rate.settlementAmount)
                : 0
              rate.targetAmount = rate.targetAmount ? formatNumberDecimal(rate.targetAmount) : 0
              return rate
            })
            transaction.buyRates = newBuyRates
            return transaction
          })
          trade.transactions = transactions
        }

        if (index !== -1) {
          totalTransfer[index] = trade
          return {
            ...state,
            totalTransfer,
            previousChangeStreamIndex: changeStramIndex,
          }
        }
      }

      return {
        ...state,
      }
    }

    default:
      return state
  }
}
