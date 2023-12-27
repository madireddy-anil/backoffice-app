import _ from 'lodash'

import { all, takeEvery, put, call } from 'redux-saga/effects'

import { amountFormatter } from '../../../utilities/transformer'

import axiosMethod from '../../../utilities/apiCaller'

import actions from './actions'

const { reportsPrivatePost } = axiosMethod

/**
 *
 * @function prepareTableColumns
 *
 * prepare table columns headers and extract special column headers.
 *
 * @param data : array : initial data fetched from server.
 *
 * @returns : Object : table Columns header and table column data Index of special columns.
 *
 */

const prepareTableColumns = data => {
  const weekColumn = {
    title: 'Week',
    dataIndex: 'week',
    key: 'week',
    align: 'center',
    sorter: (a, b) => a.week - b.week,
  }

  const monthColumn = {
    title: 'Month',
    dataIndex: 'month',
    key: 'month',
    align: 'center',
    sorter: (a, b) => a.month.length - b.month.length,
  }

  const yearColumn = {
    title: 'Year',
    dataIndex: 'year',
    key: 'year',
    align: 'center',
    sorter: (a, b) => a.year - b.year,
  }

  let tableColumns = []
  const tableColumnForDataIndex = []

  for (let object = 0; object < data.length; object += 1) {
    const title = `${data[object].depositCurrency} To ${data[object].settlementCurrency}`
    const dataIndex = `${data[object].depositCurrency}_To_${data[object].settlementCurrency}`
    tableColumnForDataIndex.push(dataIndex)
    if (data[object].year !== undefined) {
      tableColumns.push(yearColumn)
    }
    if (data[object].month !== undefined) {
      tableColumns.push(monthColumn)
    }
    if (data[object].week !== undefined) {
      tableColumns.push(weekColumn)
    }
    tableColumns.push({
      title,
      children: [
        {
          title: 'No of Transaction',
          align: 'center',
          dataIndex: `numberOfTransaction_${dataIndex}`,
          key: `${dataIndex}_${Math.random()}`,
        },
        {
          title: 'Min Rate',
          align: 'center',
          dataIndex: `sellRateMin_${dataIndex}`,
          key: `${dataIndex}_${Math.random()}`,
        },
        {
          title: 'Max Rate',
          align: 'center',
          dataIndex: `SellRateMax_${dataIndex}`,
          key: `${dataIndex}_${Math.random()}`,
        },
        {
          title: 'Avg Rate',
          align: 'center',
          dataIndex: `sellRateAvg_${dataIndex}`,
          key: `${dataIndex}_${Math.random()}`,
        },
        {
          title: 'USD Cost',
          align: 'center',
          dataIndex: `totalDepositAmountInUSD_${dataIndex}`,
          key: `${dataIndex}_${Math.random()}`,
        },
      ],
    })
  }

  tableColumns = _.uniqBy(tableColumns, 'title')

  return {
    tableColumns,
    tableColumnForDataIndex: _.uniq(tableColumnForDataIndex),
  }
}

/**
 *
 * @function fillRemainingColumns
 *
 * @param data : array : initial data fetch from server, dataIndex : array : table column header data index
 *
 * @returns : Object : A row in table.
 */

const fillRemainingColumns = (data, dataIndex) => {
  const emptySpaces = {}
  const nullSymbol = 0
  for (let columnIndex = 0; columnIndex < dataIndex.length; columnIndex += 1) {
    emptySpaces[`numberOfTransaction_${dataIndex[columnIndex]}`] = nullSymbol
    emptySpaces[`sellRateMin_${dataIndex[columnIndex]}`] = nullSymbol
    emptySpaces[`SellRateMax_${dataIndex[columnIndex]}`] = nullSymbol
    emptySpaces[`sellRateAvg_${dataIndex[columnIndex]}`] = nullSymbol
    emptySpaces[`totalDepositAmountInUSD_${dataIndex[columnIndex]}`] = nullSymbol
  }
  return { ...data, ...emptySpaces }
}

/**
 *
 * @function getMonthsAndYearAndVendorNameFromData
 *
 * Iterate over the data, extract unique items.
 *
 * @param data : array : initial data fetch from server.
 *
 * @returns : Object : distinct year, month, week arrays.
 *
 */

const getMonthsAndYearAndVendorNameFromData = data => {
  return {
    weeks: _.uniq(
      data.map(obj => {
        return obj.week
      }),
    ),
    months: _.uniq(
      data.map(obj => {
        return obj.month
      }),
    ),
    years: _.uniq(
      data.map(obj => {
        return obj.year
      }),
    ),
  }
}

/**
 *
 * @function prepareValueCustomizeValue
 *
 * @param data : array : initial data fetched from server
 *
 * @returns Object : data for customize value dropdown.
 *
 */

const prepareValueCustomizeValue = data => {
  const week = []
  const month = []
  const year = []

  for (let object = 0; object < data.length; object += 1) {
    if (data[object].week) week.push(data[object].week.toString())
    month.push(data[object].month)
    year.push(data[object].year.toString())
  }

  return { week: _.uniq(week), month: _.uniq(month), year: _.uniq(year) }
}

/**
 *
 * @function prepareDataByMonthsAndYears
 *
 * @param year : string,  month : string, data : initial data fetched from server, dataIndex : arrray of table column index,
 *
 * @returns : Object : A row in a table.
 */

const prepareDataByMonthsAndYears = (year, month, data, dataIndex, week) => {
  const newObject = {}
  const filledIndices = []
  /* Pre filling month and year */
  newObject.year = year
  newObject.month = month
  newObject.week = week
  /* To fill the special columns corresponding to month and year */
  for (let object = 0; object < data.length; object += 1) {
    /* if year and month matches, fill the data and push the filled data index */
    if (data[object].year === year && data[object].month === month && data[object].week === week) {
      const index = `${data[object].depositCurrency}_To_${data[object].settlementCurrency}`
      newObject[`numberOfTransaction_${index}`] = data[object].numberOfTransactions
      newObject[`sellRateMin_${index}`] = data[object].minRate
        ? `${Math.round(data[object].minRate * 100) / 100} %`
        : '0'
      newObject[`SellRateMax_${index}`] = data[object].maxRate
        ? `${Math.round(data[object].maxRate * 100) / 100} %`
        : '0'
      newObject[`sellRateAvg_${index}`] = data[object].avgRate
        ? `${Math.round(data[object].avgRate * 100) / 100} %`
        : '0'
      newObject[`totalDepositAmountInUSD_${index}`] = data[object].totalDepositAmountInUSD
        ? amountFormatter(Math.round(data[object].totalDepositAmountInUSD * 100) / 100)
        : 0
      filledIndices.push(index)
    }
  }
  /* filling the remaining unfilled columns */
  return filledIndices.length > 0
    ? fillRemainingColumns(newObject, _.difference(dataIndex, filledIndices))
    : {}
}

/**
 *
 *  @function getDownloadData
 *
 *  prepare download data for download.
 *
 *  @param data : array : initial data fetched from server.
 *
 *  @returns array of download data
 *
 */

const getDownloadData = (newResponse, tableColumns) => {
  const data = []
  newResponse.forEach(report => {
    const reportData = []
    for (let column = 0; column < tableColumns.length; column += 1) {
      if (tableColumns[column].children) {
        for (let child = 0; child < tableColumns[column].children.length; child += 1) {
          const { dataIndex } = tableColumns[column].children[child]
          reportData.push(fillDownloadData(report, dataIndex))
        }
      } else {
        reportData.push(fillDownloadData(report, tableColumns[column].dataIndex))
      }
    }
    data.push(reportData)
  })
  return data
}

/**
 *
 * @function fillDownloadData
 *
 * @param { Object, dataIndex of column }
 *
 * @return Object
 *
 */

const fillDownloadData = (data, dataIndex) => {
  const reportData = []
  const nullSymbol = '---'
  Object.entries(data).forEach(([key, value]) => {
    if (dataIndex === key) {
      if (key === 'month' || key === 'vendorName') {
        reportData.push({
          value: value || nullSymbol,
          style: { alignment: { horizontal: 'center' } },
        })
      } else if (key === 'year' || key === 'week' || key.includes('numberOfTransaction')) {
        reportData.push({
          value: value || nullSymbol,
          style: { alignment: { horizontal: 'center' } },
        })
      } else if (key.includes('totalDepositAmountInUSD')) {
        reportData.push({
          value: value || nullSymbol,
          style: { alignment: { horizontal: 'center' }, numFmt: '0,0.00' },
        })
      } else {
        reportData.push({
          value: value || nullSymbol,
          style: { alignment: { horizontal: 'center' }, numFmt: '0,0.00\\%' },
        })
      }
    }
  })
  return reportData[0]
}

/**
 *  @function modifyResponseAndTableColumn
 *
 *  @param data : array : initial data fetched from server, selectedPeriod : array : selected period for ccustomize columns
 *
 *  @returns : Object : tableColumns, new Re-Structured Data, data for Customize Value.
 *
 */

const modifyResponseAndTableColumn = (data, selectedPeriod) => {
  /* Using the data, Preparaing Table Column Headers and extracting the extra special columns aka 'CNY TO USD' these like columns. */
  const { tableColumnForDataIndex, tableColumns } = prepareTableColumns(data)
  /* Extracting the distinct year and month, week  */
  const { years, months, weeks } = getMonthsAndYearAndVendorNameFromData(data)

  const newResponse = []
  /* Iterating over year array to produce distinct row */
  for (let year = 0; year < years.length; year += 1) {
    /* Iterating over month array to produce distinct row */
    for (let month = 0; month < months.length; month += 1) {
      /* Iterating over week array to produce distinct row */
      for (let week = 0; week < weeks.length; week += 1) {
        /* Getting the data correspond to the year and month */
        const filledRow = prepareDataByMonthsAndYears(
          years[year],
          months[month],
          data,
          tableColumnForDataIndex,
          weeks[week],
        )
        if (Object.entries(filledRow).length > 0) {
          newResponse.push(filledRow)
        }
      }
    }
  }

  const customizeValue = prepareValueCustomizeValue(newResponse)

  let startIndex = 1

  if (selectedPeriod.includes('monthly')) {
    startIndex = 2
  }

  if (selectedPeriod.includes('weekly')) {
    startIndex = 3
  }

  customizeValue.customizeColumns = tableColumns
    .map(col => col.title)
    .slice(startIndex, tableColumns.length)

  return {
    tableColumns,
    reStructuredData: newResponse,
    customizeValue,
    downloadData: getDownloadData(newResponse, tableColumns),
  }
}

const getReportData = values => {
  const { value } = values
  const body = {
    groupBy: value.period || ['yearly', 'monthly'],
    category: 'portfolio',
    query: {
      dateFilterBy: 'tradeRequestedAt',
      dateFrom: value.dateFrom || '',
      dateTo: value.dateTo || '',
      depositCurrencies: value.depositCurrency || [],
      vendorIds: [],
    },
  }
  return reportsPrivatePost(`vendor-summary-report`, body, value.token).then(res => {
    return modifyResponseAndTableColumn(res.data.data.vendorReport, body.groupBy)
  })
}

export function* handleReport(values) {
  try {
    const response = yield call(getReportData, values)
    yield put({
      type: actions.GET_VENDOR_SUMMARY_PORTFOLIO_REPORT_SUCCESS,
      value: response,
    })
  } catch (exception) {
    yield put({
      type: actions.GET_VENDOR_SUMMARY_PORTFOLIO_REPORT_FAILURE,
      value: exception,
    })
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.GET_VENDOR_SUMMARY_PORTFOLIO_REPORT, handleReport)])
}
