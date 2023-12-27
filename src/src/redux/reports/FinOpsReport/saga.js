import { all, takeLatest, put, call, takeEvery } from 'redux-saga/effects'

import axiosMethod from '../../../utilities/apiCaller'

import actions from './actions'

import { formatDate } from '../../../utilities/transformer'

const { reportsPrivateGet } = axiosMethod

const prepareColumns = () => {
  const commonRouteHeader = [
    'Sequence',
    'Vendor Name',
    'Source Currency',
    'Received Amount',
    'Beneficiary',
    'Remittance Currency',
    'Final Funds Remitted',
    'Comment',
  ]

  const routes = ['Swap', 'Fx', 'Otc', 'Liquidate', 'Cryto Wallet', 'Rental Accounts']

  const tableColumnHeaders = [
    'Trade Date',
    'Trade ID',
    'Customer Name',
    'Source Currency',
    'Beneficiary',
    'Destination Currency',
    'Converted Amount',
    'PC Revenue',
    'Comment',
  ]

  for (let i = 0; i < routes.length; i += 1) {
    for (let j = 0; j < commonRouteHeader.length; j += 1) {
      tableColumnHeaders.push(`${routes[i]} ${commonRouteHeader[j]}`)
    }
  }

  return tableColumnHeaders
}

const segregateRoutes = data => {
  const routes = {
    swap: 0,
    fx: 0,
    otc: 0,
    cryptoWallet: 0,
    liquidate: 0,
    rentalAccounts: 0,
  }
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].routeName !== undefined || data[i].routeName !== '') {
      switch (data[i].routeName) {
        case 'swap':
          routes.swap = { isPresent: true, pos: i }
          break
        case 'fx':
          routes.fx = { isPresent: true, pos: i }
          break
        case 'otc':
          routes.otc = { isPresent: true, pos: i }
          break
        case 'crypto_wallet':
          routes.cryptoWallet = { isPresent: true, pos: i }
          break
        case 'accounts_only':
          routes.rentalAccounts = { isPresent: true, pos: i }
          break
        case 'liquidate':
          routes.liquidate = { isPresent: true, pos: i }
          break
        default:
          break
      }
    }
  }

  return routes
}

const reStructureforExcel = data => {
  const columns = prepareColumns(data)
  const nullSymbol = '---'
  const newData = []
  const routes = ['swap', 'fx', 'otc', 'liquidate', 'cryptoWallet', 'rentalAccounts']
  try {
    for (let i = 0; i < data.length; i += 1) {
      const newObj = []
      const currentObj = data[i]
      newObj.push({
        value: currentObj.tradeDate ? formatDate(currentObj.tradeDate) : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      newObj.push({
        value: currentObj.tradeReference || nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      newObj.push({
        value: currentObj.customerName || nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      newObj.push({
        value: currentObj.sourceCurrency || nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      newObj.push({
        value: currentObj.beneficiary || nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      newObj.push({
        value: currentObj.destinationCurrency || nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      newObj.push({
        value: currentObj.convertedAmount || nullSymbol,
        style: { alignment: { horizontal: 'center' }, numFmt: '0,0.00' },
      })
      newObj.push({
        value: currentObj.pcRevenue || nullSymbol,
        style: { alignment: { horizontal: 'center' }, numFmt: '0,0.00' },
      })
      newObj.push({
        value: currentObj.tradeComment
          ? currentObj.tradeComment.length !== 0
            ? currentObj.tradeComment[0]
            : nullSymbol
          : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      const segregatedRoutes = segregateRoutes(currentObj.transactions)

      for (let j = 0; j < routes.length; j += 1) {
        if (segregatedRoutes[routes[j]].isPresent) {
          const position = segregatedRoutes[routes[j]].pos
          newObj.push({
            value: currentObj.transactions[position].sequence || nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: currentObj.transactions[position].vendorName || nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: currentObj.transactions[position].sourceCurrency || nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: currentObj.transactions[position].receivedAmount || nullSymbol,
            style: { alignment: { horizontal: 'center', numFmt: '0,0.00' } },
          })
          newObj.push({
            value: currentObj.transactions[position].beneficiary || nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: currentObj.transactions[position].remittanceCurrency || nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: currentObj.transactions[position].finalFundsRemitted || nullSymbol,
            style: { alignment: { horizontal: 'center', numFmt: '0,0.00' } },
          })
          newObj.push({
            value:
              currentObj.transactions[position].transactionComments.length !== 0
                ? currentObj.transactions[position].transactionComments[0] || nullSymbol
                : nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
        } else {
          newObj.push({
            value: nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: nullSymbol,
            style: { alignment: { horizontal: 'center', numFmt: '0,0.00' } },
          })
          newObj.push({
            value: nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: nullSymbol,
            style: { alignment: { horizontal: 'center', numFmt: '0,0.00' } },
          })
          newObj.push({
            value: nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
          newObj.push({
            value: nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
        }
      }

      newData.push(newObj)
    }
  } catch (exp) {
    console.log('Breaked At', exp)
  }
  return { downloadColumn: columns, downloadData: newData }
}

export const getFinOpsReports = values => {
  const { value } = values

  const page = value.page ? `?page=${value.page}` : ''
  const limit = `&limit=${value.limit}`
  const dateFrom = value.dateFrom ? `&dateFrom=${value.dateFrom}` : ''
  const dateTo = value.dateTo ? `&dateTo=${value.dateTo}` : ''
  const dateFilter =
    value.dateFrom && value.dateTo ? '&dateFilterBy=progressLogs.tradeRequestedAt' : ''

  const tradeRef = value.tradeReference ? `&tradeReference=${value.tradeReference}` : ''
  const clientName = value.clientName ? `&clientId=${value.clientName}` : ''
  const fiatBeneficiary = value.fiatBeneficiaryId
    ? encodeURI(`&beneficiary.id=${value.fiatBeneficiaryId}`)
    : ''
  const cryptoBeneficiary = value.cryptoBeneficiaryId
    ? encodeURI(`&cryptoBeneficiary.id=${value.cryptoBeneficiaryId}`)
    : ''

  const depositCurrencyStr = '&depositCurrency[]='
  let sourceCurrency = ''
  if (value.depositCurrency) {
    for (let i = 0; i < value.depositCurrency.length; i += 1) {
      sourceCurrency += `${depositCurrencyStr}${value.depositCurrency[i]}`
    }
  }
  const sourceAmount = value.totalDepositAmount
    ? `&totalDepositAmount=${value.totalDepositAmount}`
    : ''
  let settlementcurrency = ''
  const settlementCurrencyStr = '&settlementCurrency[]='
  if (value.settlementCurrency) {
    for (let i = 0; i < value.settlementCurrency.length; i += 1) {
      settlementcurrency += `${settlementCurrencyStr}${value.settlementCurrency[i]}`
    }
  }
  const settlementAmount = value.settlementAmount
    ? `&settlementAmount=${value.settlementAmount}`
    : ''

  return reportsPrivateGet(
    `fin-ops-report${page}${limit}${tradeRef}${clientName}${fiatBeneficiary}${cryptoBeneficiary}${dateFrom}${dateTo}${dateFilter}${sourceCurrency}${sourceAmount}${settlementcurrency}${settlementAmount}`,
    value.token,
  ).then(response => {
    return {
      newResponse: response.data.data.finOpsReport,
      ForExcel: reStructureforExcel(response.data.data.finOpsReport),
      total: response.data.data.total,
    }
  })
}

export function* getReports(values) {
  try {
    const response = yield call(getFinOpsReports, values)
    yield put({
      type: actions.GET_FIN_OPS_REPORT_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_FIN_OPS_REPORT_FAILURE,
      value: err,
    })
  }
}

const downloadData = values => {
  const { value } = values

  const limit = `?limit=${value.limit}`
  const dateFrom = value.dateFrom ? `&dateFrom=${value.dateFrom}` : ''
  const dateTo = value.dateTo ? `&dateTo=${value.dateTo}` : ''
  const dateFilter =
    value.dateFrom && value.dateTo ? '&dateFilterBy=progressLogs.tradeRequestedAt' : ''

  const tradeRef = value.tradeReference ? `&tradeReference=${value.tradeReference}` : ''
  const clientName = value.clientName ? `&clientId=${value.clientName}` : ''
  const beneficiary = value.beneficiary
    ? encodeURI(`&beneficiary.bankAccountDetails.nameOnAccount=${value.beneficiary}`)
    : ''
  const depositCurrencyStr = '&depositCurrency[]='
  let sourceCurrency = ''
  if (value.depositCurrency) {
    for (let i = 0; i < value.depositCurrency.length; i += 1) {
      sourceCurrency += `${depositCurrencyStr}${value.depositCurrency[i]}`
    }
  }
  const sourceAmount = value.totalDepositAmount
    ? `&totalDepositAmount=${value.totalDepositAmount}`
    : ''
  let settlementcurrency = ''
  const settlementCurrencyStr = '&settlementCurrency[]='
  if (value.settlementCurrency) {
    for (let i = 0; i < value.settlementCurrency.length; i += 1) {
      settlementcurrency += `${settlementCurrencyStr}${value.settlementCurrency[i]}`
    }
  }
  const settlementAmount = value.settlementAmount
    ? `&settlementAmount=${value.settlementAmount}`
    : ''

  return reportsPrivateGet(
    `fin-ops-report${limit}${tradeRef}${clientName}${beneficiary}${dateFrom}${dateTo}${dateFilter}${sourceCurrency}${sourceAmount}${settlementcurrency}${settlementAmount}`,
    value.token,
  ).then(response => {
    return {
      newResponse: response.data.data.finOpsReport,
      ForExcel: reStructureforExcel(response.data.data.finOpsReport),
      total: response.data.data.total,
    }
  })
}

export function* getDownloadData(value) {
  try {
    const response = yield call(downloadData, value)
    yield put({
      type: actions.GET_FIN_OPS_REPORT_BULK_DOWNLOAD_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_FIN_OPS_REPORT_BULK_DOWNLOAD_FAILURE,
      value: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.GET_FIN_OPS_REPORT, getReports),
    takeEvery(actions.GET_FIN_OPS_REPORT_BULK_DOWNLOAD, getDownloadData),
  ])
}
