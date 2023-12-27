import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import _ from 'lodash'

import axiosMethod from '../../../utilities/apiCaller'
import Variables from '../../../utilities/variables'
import { amountFormatter } from '../../../utilities/transformer'
import actions from './actions'

const { reportsPrivatePost } = axiosMethod
const { globalMessages } = Variables

const estimateColumn = tradeSummaryReportData => {
  const currencies = []
  if (tradeSummaryReportData) {
    for (let i = 0; i < tradeSummaryReportData.length; i += 1) {
      for (let j = 0; j < tradeSummaryReportData[i].currencySummary.length; j += 1) {
        currencies.push(tradeSummaryReportData[i].currencySummary[j].currency)
      }
    }
    return _.uniq(currencies)
  }
  return null
}

const getColumns = (tradeSummaryReportData, period) => {
  const columns = estimateColumn(tradeSummaryReportData)
  let initialColumn = [
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      align: 'center',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: `Client Name`,
      key: 'clientName',
      dataIndex: 'clientName',
      align: 'center',
      width: 200,
      sorter: (a, b) => a.clientName.length - b.clientName.length,
    },
    {
      title: 'Total No of Trades',
      dataIndex: 'grandNoOfTrades',
      key: 'grandNoOfTrades',
      align: 'center',
    },
    {
      title: 'Total Trade Value (In USD)',
      dataIndex: 'grandDepositAmountInUSD',
      key: 'grandDepositAmountInUSD',
      align: 'center',
      render: data => (data ? amountFormatter(data) : 0),
    },
    {
      title: 'Profit (In USD)',
      dataIndex: 'grandPCRevenueInUSD',
      key: 'grandPCRevenueInUSD',
      align: 'center',
      render: data => (data ? amountFormatter(data) : 0),
    },
  ]
  let currencyColumns = []

  const monthColumn = {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
    align: 'center',
    sorter: (a, b) => a.month.length - b.month.length,
  }

  const weekColumn = {
    title: 'week',
    dataIndex: 'week',
    key: 'week',
    align: 'center',
  }

  if (period) {
    initialColumn = period.includes('monthly')
      ? [...initialColumn.slice(0, 1), monthColumn, ...initialColumn.slice(1, initialColumn.length)]
      : initialColumn
  }

  if (period) {
    initialColumn = period.includes('weekly')
      ? [...initialColumn.slice(0, 2), weekColumn, ...initialColumn.slice(2, initialColumn.length)]
      : initialColumn
  }

  for (let i = 0; i < columns.length; i += 1) {
    const newColumn = {}

    newColumn.title = `Trade Value In ${columns[i]}`
    newColumn.children = [
      {
        title: `No of Trades`,
        dataIndex: `grandNoOfTrades_${columns[i]}`,
        key: `grandNoOfTrades_${columns[i]}`,
        align: 'center',
      },
      {
        title: `Trade Value ${columns[i]}`,
        dataIndex: columns[i],
        key: columns[i],
        align: 'center',
      },
      {
        title: `Trade Value ${columns[i]} In USD`,
        dataIndex: `${columns[i]}_USD`,
        key: `${columns[i]}_USD`,
        align: 'center',
      },
    ]

    if (columns[i] === 'USD') {
      newColumn.children.length = 2
    }

    currencyColumns.push(newColumn)
  }

  for (let i = 0; i < initialColumn.length; i += 1) {
    if (initialColumn[i].dataIndex === 'grandNoOfTrades') {
      currencyColumns = [
        ...initialColumn.slice(0, i + 1),
        ...currencyColumns,
        ...initialColumn.slice(i + 1, initialColumn.length),
      ]
    }
  }

  return currencyColumns
}

const renderDataForColumn = (data, currency, type) => {
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].currency === currency) {
      switch (type) {
        case 'trade':
          return data[i].numberOfTrades
        case 'value':
          return amountFormatter(data[i].totalDepositAmount)
        case 'value_in_usd':
          return amountFormatter(data[i].totalDepositAmountInUSD)
        default:
          return 0
      }
    }
  }
  return '0'
}

const reStructureColumnData = data => {
  const currencies = estimateColumn(data)
  const newResponse = []
  for (let i = 0; i < data.length; i += 1) {
    const item = {}
    item.month = data[i].month
    item.week = data[i].week
    item.year = data[i].year
    item.clientName = data[i].clientName
    item.grandNoOfTrades = data[i].grandNoOfTrades
    for (let j = 0; j < currencies.length; j += 1) {
      item[`grandNoOfTrades_${currencies[j]}`] = renderDataForColumn(
        data[i].currencySummary,
        currencies[j],
        'trade',
      )
      item[currencies[j]] = renderDataForColumn(data[i].currencySummary, currencies[j], 'value')
      if (currencies[j] !== 'USD') {
        const USD = `${currencies[j]}_USD`
        item[USD] = renderDataForColumn(data[i].currencySummary, currencies[j], 'value_in_usd')
      }
    }
    item.grandDepositAmountInUSD = Math.round(data[i].grandDepositAmountInUSD * 100) / 100
    item.grandPCRevenueInUSD = Math.round(data[i].grandPCRevenueInUSD * 100) / 100
    newResponse.push({ ...item })
  }
  return newResponse
}

const getDownloadAllData = data => {
  const downloadData = data.map(dataItem => {
    let firstThreeColumnData = {
      year: dataItem.year.toString(),
      clientName: dataItem.clientName,
      numberOfTrades: dataItem.grandNoOfTrades,
    }

    if (data[0].month) {
      firstThreeColumnData = {
        year: dataItem.year.toString(),
        month: dataItem.month,
        clientName: dataItem.clientName,
        numberOfTrades: dataItem.grandNoOfTrades,
      }
    }

    if (data[0].week) {
      firstThreeColumnData = {
        year: dataItem.year.toString(),
        month: dataItem.month,
        week: dataItem.week,
        clientName: dataItem.clientName,
        numberOfTrades: dataItem.grandNoOfTrades,
      }
    }

    const lastTwoColumnData = {
      grandDepositAmountInUSD: dataItem.grandDepositAmountInUSD,
      grandPCRevenueInUSD: dataItem.grandPCRevenueInUSD,
    }
    const currencies = estimateColumn(data)

    const currencyColumnsData = {}
    currencies.forEach(currency => {
      const stringCurrencyVariable = `${currency}`
      currencyColumnsData[stringCurrencyVariable] = renderDataForColumnForDownload(
        dataItem.currencySummary,
        currency,
        false,
      )
      if (currency !== 'USD') {
        const stringCurrencyVariableInUSD = `${currency}InUSD`
        currencyColumnsData[stringCurrencyVariableInUSD] = renderDataForColumnForDownload(
          dataItem.currencySummary,
          currency,
          true,
        )
      }
    })
    return { ...firstThreeColumnData, ...currencyColumnsData, ...lastTwoColumnData }
  })
  return downloadData
}

const renderDataForColumnForDownload = (data, currency, isUSD) => {
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].currency === currency) {
      return isUSD ? data[i].totalDepositAmountInUSD : data[i].totalDepositAmount
    }
  }
  return 0
}

const getCustomizeColumn = columns => {
  for (let i = 0; i < columns.length; i += 1) {
    if (columns[i].dataIndex === 'grandNoOfTrades') {
      return columns.slice(i + 1, columns.length).map(x => x.title)
    }
  }
  return []
}

const getallCustomerSummaryReport = values => {
  const { value } = values
  const body = {
    groupBy: value.period || ['yearly', 'monthly'],
    category: 'summary',
    query: {
      dateFilterBy: 'progressLogs.tradeRequestedAt',
      dateFrom: value.dateFrom || '',
      dateTo: value.dateTo || '',
      depositCurrencies: value.depositCurrency || [],
      clientIds: value.clientId || [],
    },
  }
  return reportsPrivatePost(`trade-summary-report `, body, value.token).then(res => {
    let tableColumn = []
    let newResponse = []
    try {
      tableColumn = getColumns(res.data.data.tradeSummaryReport, body.groupBy)
      newResponse = reStructureColumnData(res.data.data.tradeSummaryReport)
    } catch (e) {
      console.log(e)
    }
    const year = []
    const month = []
    const clientName = []
    for (let i = 0; i < newResponse.length; i += 1) {
      year.push(newResponse[i].year.toString())
      if (newResponse[i].month) {
        month.push(newResponse[i].month)
      }
      clientName.push(newResponse[i].clientName)
    }
    return {
      tableColumns: tableColumn,
      response: newResponse,
      reportDownload: getDownloadAllData(res.data.data.tradeSummaryReport),
      customizeValue: {
        year: _.uniq(year),
        month: _.uniq(month),
        customizeColumns: getCustomizeColumn(tableColumn),
        clients: _.uniq(clientName),
      },
    }
  })
}

export function* getCustomerSummaryReportList(values) {
  try {
    const response = yield call(getallCustomerSummaryReport, values)
    yield put({
      type: actions.GET_CUSTOMER_SUMMARY_REPORT_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_CUSTOMER_SUMMARY_REPORT_FAILURE,
      value: e,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.GET_CUSTOMER_SUMMARY_REPORT, getCustomerSummaryReportList)])
}
