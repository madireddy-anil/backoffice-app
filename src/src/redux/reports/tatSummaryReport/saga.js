import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import _ from 'lodash'

import axiosMethod from '../../../utilities/apiCaller'
import Variables from '../../../utilities/variables'

import actions from './actions'

const { reportsPrivatePost } = axiosMethod
const { globalMessages } = Variables

const getColumns = () => {
  const nullSymbol = '---'
  const initialColumns = [
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      align: 'center',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'Customer Name',
      dataIndex: 'clientName',
      key: 'clientName',
      align: 'center',
      render: clientName => clientName || nullSymbol,
    },
    {
      title: 'Deposit Currency',
      dataIndex: 'depositCurrency',
      key: 'depositCurrency',
      align: 'center',
      render: depositCurrency => depositCurrency || nullSymbol,
    },
    {
      title: 'Number Of Trades',
      dataIndex: 'numberOfTrades',
      key: 'numberOfTrades',
      align: 'center',
      render: numberOfTrades => numberOfTrades || nullSymbol,
    },
    {
      title: 'TAT',
      dataIndex: 'tat',
      key: 'tat',
      align: 'center',
      render: tat => tat || nullSymbol,
    },
    {
      title: 'TAT Percentage',
      dataIndex: 'tatPercentage',
      key: 'tatPercentage',
      align: 'center',
      render: tatPercentage => `${tatPercentage} %` || nullSymbol,
    },
  ]
  return initialColumns
}

const getallTatReport = (value, token) => {
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

  return reportsPrivatePost(`tat-summary-report`, body, token).then(response => {
    const resData = response.data.data

    const weekHeader = {
      title: 'Week',
      dataIndex: 'week',
      key: 'week',
      align: 'center',
      render: week => week || '---',
    }

    const monthHeader = {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      align: 'center',
    }

    let tableColumn = getColumns()

    if (body.groupBy) {
      tableColumn = body.groupBy.includes('monthly')
        ? [...tableColumn.slice(0, 1), monthHeader, ...tableColumn.slice(1, tableColumn.length)]
        : tableColumn
    }

    if (body.groupBy) {
      tableColumn = body.groupBy.includes('weekly')
        ? [...tableColumn.slice(0, 2), weekHeader, ...tableColumn.slice(2, tableColumn.length)]
        : tableColumn
    }
    let year = []
    let month = []
    const clients = []
    for (let i = 0; i < resData.tatReport.length; i += 1) {
      year.push(resData.tatReport[i].year ? resData.tatReport[i].year.toString() : null)
      month.push(resData.tatReport[i].month)
      clients.push(resData.tatReport[i].clientName)
    }
    year = year.filter(el => el !== null)
    month = month.filter(el => el !== null)
    const customizeColumns = tableColumn.map(x => x.title)
    return {
      ...resData,
      tableColumns: tableColumn,
      customizeValue: {
        year: _.uniq(year),
        month: _.uniq(month),
        clients: _.uniq(clients),
        customizeColumns,
      },
    }
  })
}

export function* getTatReportList(values) {
  try {
    const response = yield call(getallTatReport, values.value, values.token)
    yield put({
      type: actions.GET_TAT_REPORT_SUCCESS,
      value: response,
    })
  } catch (e) {
    yield put({
      type: actions.GET_TAT_REPORT_FAILURE,
      value: e,
    })
    notification.error({
      message: globalMessages.errorMessage,
      description: globalMessages.errorDescription,
    })
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.GET_TAT_REPORT, getTatReportList)])
}
