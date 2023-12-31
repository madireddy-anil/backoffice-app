const actions = {
  GET_VOLUMEANDPROFIT: 'GET_VOLUMEANDPROFIT',
  GET_VOLUMEANDPROFIT_SUCCESS: 'GET_VOLUMEANDPROFIT_SUCCESS',
  GET_VOLUMEANDPROFIT_FAILURE: 'GET_VOLUMEANDPROFIT_FAILURE',

  GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD: 'GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD',
  GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD_SUCCESS:
    'GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD_SUCCESS',
  GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD_FAILURE:
    'GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD_FAILURE',

  HANDLE_VOLUMEANDPROFIT_PAGINATION: 'HANDLE_VOLUMEANDPROFIT_PAGINATION',

  HANDLE_VOLUME_AND_PROFIT_REPORT_FILTERS: 'HANDLE_VOLUME_AND_PROFIT_REPORT_FILTERS',
}
export default actions

export const handleVolumeAndProfitReportFilters = value => {
  return {
    type: actions.HANDLE_VOLUME_AND_PROFIT_REPORT_FILTERS,
    value,
  }
}

export const getVoluemAndProfit = (value, token) => {
  return {
    type: actions.GET_VOLUMEANDPROFIT,
    value,
    token,
  }
}

export const getVolumeAndProfitDownload = (value, token) => {
  return {
    type: actions.GET_VOLUME_AND_PROFIT_REPORT_BULK_DOWNLOAD,
    value,
    token,
  }
}

export const handlePagination = value => {
  return {
    type: actions.HANDLE_VOLUMEANDPROFIT_PAGINATION,
    value,
  }
}
