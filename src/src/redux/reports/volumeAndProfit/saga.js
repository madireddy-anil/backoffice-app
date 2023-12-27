import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'

import _ from 'lodash'
import axiosMethod from '../../../utilities/apiCaller'
import Variables from '../../../utilities/variables'

import actions from './actions'

import { formatDate, amountFormatter } from '../../../utilities/transformer'

const { txnPrivateGet } = axiosMethod
const { globalMessages } = Variables

const estimateExcelColumn = data => {
  let excelCol = [
    'Trade Number',
    'Customer Name',
    'Date Of Initiate',
    'Date Of Deposit',
    'Deposit Currency',
    'Deposit Amount',
    'Deposit Amount In USD',
    'Settlement Currency',
    'Settlement Amount',
    'PC Spread',
    'Trade Status',
  ]

  const reportData = []

  data.map(trade =>
    trade.fees.map(fee => {
      if (fee.feeType && fee.routeType) {
        excelCol.push(
          `${_.upperFirst(_.toLower(fee.feeType))}${'-'}${_.upperFirst(_.toLower(fee.routeType))}`,
        )
        reportData.push(...addExcelColumnData(trade, fee))
      } else if (fee.feeType || fee.routeType) {
        excelCol.push(
          fee.feeType
            ? `${_.upperFirst(_.toLower(fee.feeType))}`
            : `${_.upperFirst(_.toLower(fee.routeType))}`,
        )
        reportData.push(...addExcelColumnData(trade, fee))
      }
      return null
    }),
  )

  excelCol = _.uniq(excelCol)

  const newData = prepareInitialDownloadData(data, reportData, excelCol)

  return { excelCol, newData }
}

const addExcelColumnData = (data, fees) => {
  const colData = []
  colData.push({
    tradeRef: data.tradeNumber,
    feeCurrency: fees.feeCurrency,
    feeAmount: amountFormatter(fees.feeAmount),
    feeType: fees.feeType,
    routeType: fees.routeType,
  })
  return colData
}

const prepareInitialDownloadData = (value, partiallyClassifiedData, allColumns) => {
  const data = []
  const nullSymbol = '---'
  for (let i = 0; i < value.length; i += 1) {
    const report = value[i]
    const reportData = []
    reportData.push({
      value: report.tradeNumber ? report.tradeNumber : nullSymbol,
      style: { alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: report.customerName ? report.customerName : nullSymbol,
      style: { alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: report.tradeRequestedDate ? formatDate(report.tradeRequestedDate) : nullSymbol,
      style: { alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: report.dateOfDeposit ? formatDate(report.dateOfDeposit) : nullSymbol,
      style: { alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: report.depositCurrency ? report.depositCurrency : nullSymbol,
      style: { alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: report.depositAmount ? report.depositAmount : 0,
      style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: report.depositAmountinUSD ? amountFormatter(report.depositAmountinUSD) : 0,
      style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: report.settlementCurrency ? report.settlementCurrency : nullSymbol,
      style: { alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: report.settlementAmount ? report.settlementAmount : 0,
      style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: report.pcSpread ? report.pcSpread : nullSymbol,
      style: { numFmt: '0.00\\%', alignment: { horizontal: 'center' } },
    })
    reportData.push({
      value: _.upperCase(report.tradeStatus),
      style: { alignment: { horizontal: 'center' } },
    })
    reportData.push(...getTheDataForExcel(report.tradeNumber, partiallyClassifiedData, allColumns))
    data.push(reportData)
  }

  return data
}

const getTheDataForExcel = (tradeRef, partiallyClassifiedData, allColumns) => {
  const presentColHeaders = []
  partiallyClassifiedData.map(value => {
    if (value.tradeRef === tradeRef) {
      presentColHeaders.push(value)
    }
    return null
  })
  const len = allColumns.length - 11
  const colData = []
  presentColHeaders.map(values => {
    let col
    if (values.feeType && values.routeType) {
      col = `${_.upperFirst(_.toLower(values.feeType))}${'-'}${_.upperFirst(
        _.toLower(values.routeType),
      )}`
    } else if (values.feeType || values.routeType) {
      col = values.feeType
        ? `${_.upperFirst(_.toLower(values.feeType))}`
        : `${_.upperFirst(_.toLower(values.routeType))}`
    }
    colData[allColumns.indexOf(col) - 11] = {
      value: `${values.feeCurrency}${' '}${values.feeAmount}`,
      style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
    }
    return null
  })
  for (let i = 0; i < colData.length; i += 1) {
    if (colData[i] === undefined) {
      colData[i] = {
        value: 0,
        style: { alignment: { horizontal: 'center' } },
      }
    }
  }
  if (colData.length !== len) {
    for (let i = colData.length; i < len; i += 1) {
      if (colData[i] === undefined) {
        colData[i] = {
          value: 0,
          style: { alignment: { horizontal: 'center' } },
        }
      }
    }
  }
  return colData
}

const getallVolumeAndProfit = (value, token) => {
  const page = value.page ? encodeURI(`&page=${value.page}`) : ''
  const limit = value.limit ? encodeURI(`&limit=${value.limit}`) : ''
  const tradeNumber = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''
  // const dateOfDeposit = value.DateAndTime ? encodeURI(`&dateOfDeposit=${value.DateAndTime}`) : ''
  const customerName = value.customerName ? encodeURI(`&clientId=${value.customerName}`) : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const depositAmount = value.depositAmount
    ? encodeURI(`&totalDepositAmount=${value.depositAmount}`)
    : ''
  const settlementCurrency = value.settlementCurrency
    ? encodeURI(`&settlementCurrency=${value.settlementCurrency}`)
    : ''
  const settlementAmount = value.settlementAmount
    ? encodeURI(`&settlementAmount=${value.settlementAmount}`)
    : ''

  let dayFromString = ''
  let dayToString = ''
  if (value.dateFromOfInitiate || value.dateToOfInitiate) {
    dayFromString = value.dateFromOfInitiate
      ? encodeURI(`&dateFrom=${value.dateFromOfInitiate}`)
      : ''
    dayToString = value.dateToOfInitiate ? encodeURI(`&dateTo=${value.dateToOfInitiate}`) : ''
  }
  if (value.dateFromOfDeposit || value.dateToOfDeposit) {
    dayFromString = value.dateFromOfDeposit ? encodeURI(`&dateFrom=${value.dateFromOfDeposit}`) : ''
    dayToString = value.dateToOfDeposit ? encodeURI(`&dateTo=${value.dateToOfDeposit}`) : ''
  }

  const tradeStatus = value.status ? encodeURI(`&tradeStatus=${value.status}`) : ''
  const orderBy = encodeURI('?orderBy=progressLogs.tradeRequestedAt')

  let dateFilterBy = ''
  if (value.dateFromOfInitiate || value.dateToOfInitiate) {
    dateFilterBy = encodeURI('&dateFilterBy=progressLogs.tradeRequestedAt')
  }
  if (value.dateFromOfDeposit || value.dateToOfDeposit) {
    dateFilterBy = encodeURI('&dateFilterBy=progressLogs.depositConfirmedByClientAt')
  }

  return txnPrivateGet(
    `tx-service/trade-volume-report${orderBy}${page}${limit}${tradeNumber}${customerName}${depositCurrency}${depositAmount}${settlementCurrency}${settlementAmount}${dayFromString}${dayToString}${tradeStatus}${dateFilterBy}`,
    token,
  ).then(response => {
    const forExcel = estimateExcelColumn(response.data.data.tradeSummary)
    return {
      tradeSummary: response.data.data.tradeSummary,
      forExcel,
      total: response.data.data.total,
    }
  })
}

export function* getVolumeAndProfitList(values) {
  try {
    const response = yield call(getallVolumeAndProfit, values.value, values.token)
    yield put({
      type: actions.GET_VOLUMEANDPROFIT_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_VOLUMEANDPROFIT_FAILURE,
      value: e,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

const getVoluemAndProfitDownload = (value, token) => {
  const page = value.page ? encodeURI(`&page=${value.page}`) : ''
  const limit = encodeURI(`&limit=${value.limit}`)
  const tradeNumber = value.tradeReference
    ? encodeURI(`&tradeReference=${value.tradeReference}`)
    : ''

  const customerName = value.customerName ? encodeURI(`&clientId=${value.customerName}`) : ''
  const depositCurrency = value.depositCurrency
    ? encodeURI(`&depositCurrency=${value.depositCurrency}`)
    : ''
  const depositAmount = value.depositAmount
    ? encodeURI(`&totalDepositAmount=${value.depositAmount}`)
    : ''
  const settlementCurrency = value.settlementCurrency
    ? encodeURI(`&settlementCurrency=${value.settlementCurrency}`)
    : ''
  const settlementAmount = value.settlementAmount
    ? encodeURI(`&settlementAmount=${value.settlementAmount}`)
    : ''

  let dayFromString = ''
  let dayToString = ''
  if (value.dateFromOfInitiate || value.dateToOfInitiate) {
    dayFromString = value.dateFromOfInitiate
      ? encodeURI(`&dateFrom=${value.dateFromOfInitiate}`)
      : ''
    dayToString = value.dateToOfInitiate ? encodeURI(`&dateTo=${value.dateToOfInitiate}`) : ''
  }
  if (value.dateFromOfDeposit || value.dateToOfDeposit) {
    dayFromString = value.dateFromOfDeposit ? encodeURI(`&dateFrom=${value.dateFromOfDeposit}`) : ''
    dayToString = value.dateToOfDeposit ? encodeURI(`&dateTo=${value.dateToOfDeposit}`) : ''
  }

  const tradeStatus = value.status ? encodeURI(`&tradeStatus=${value.status}`) : ''
  const orderBy = encodeURI('?orderBy=progressLogs.tradeRequestedAt')

  let dateFilterBy = ''
  if (value.dateFromOfInitiate || value.dateToOfInitiate) {
    dateFilterBy = encodeURI('&dateFilterBy=progressLogs.tradeRequestedAt')
  }
  if (value.dateFromOfDeposit || value.dateToOfDeposit) {
    dateFilterBy = encodeURI('&dateFilterBy=progressLogs.depositConfirmedByClientAt')
  }

  return txnPrivateGet(
    `tx-service/trade-volume-report${orderBy}${page}${limit}${tradeNumber}${customerName}${depositCurrency}${depositAmount}${settlementCurrency}${settlementAmount}${dayFromString}${dayToString}${tradeStatus}${dateFilterBy}`,
    token,
  ).then(response => {
    const forExcel = estimateExcelColumn(response.data.data.tradeSummary)
    return {
      tradeSummary: response.data.data.tradeSummary,
      forExcel,
      total: response.data.data.total,
    }
  })
}

export function* getVoluemAndProfitBulkDownload(values) {
  try {
    const response = yield call(getVoluemAndProfitDownload, values.value, values.token)
    yield put({
      type: actions.GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD_SUCCESS,
      value: response,
    })
  } catch (err) {
    yield put({
      type: actions.GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD_FAILURE,
      value: err,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_VOLUMEANDPROFIT, getVolumeAndProfitList),
    takeEvery(actions.GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD, getVoluemAndProfitBulkDownload),
  ])
}
