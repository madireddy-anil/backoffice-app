/* *
 *
 * @props
 *
 * type: Defines the type of report.
 *
 * reportData : Defines the initial data fetched from server.
 *
 * reportTableColumn : Defines the initial table column prepared at saga.
 *
 * customizeValueData : Defines values processed from initial data for listing in dropdown.
 *
 * toggleCustomizeValue : Toggle to customize value block
 *
 * isClientServiceNeeded: Toggle to hide the client Dropdown
 *
 * dispatch: Since there is use of global state, but due to need of updation send dispatch.
 *
 */

import React from 'react'

import { Row, Col, Button, Dropdown, Checkbox, Icon, Menu /* Input */ } from 'antd'

// import { SearchOutlined } from '@ant-design/icons'

import {
  updateCustomerSummaryReportData,
  updateTableColumns,
} from 'redux/reports/customerSummaryReport/actions'

import {
  updateTradeSummaryReport,
  updateTradeSummaryReportColumn,
} from 'redux/reports/tradeSummaryReport/actions'

import {
  updateReportTableColumn,
  updateReportData,
} from 'redux/reports/vendorSummaryReport/actions'

import {
  updateVendorSummaryReport,
  updateVendorSummaryReportTableColumn,
} from 'redux/reports/vendorSummaryPortfolioReport/actions'

import {
  updateTATSummaryReportData,
  updateTATReportTableColumns,
} from 'redux/reports/tatSummaryReport/actions'

import {
  updateTATPortfolioSummaryReportData,
  updateTATPortfolioReportTableColumns,
} from 'redux/reports/tatSummaryPortfolioReport/actions'

import styles from './style.module.scss'

const CheckboxGroup = Checkbox.Group

const CustomizeValue = props => {
  const {
    type,
    reportData,
    reportTableColumn,
    customizeValueData,
    toggleCustomizeValue,
    isClientServiceNeeded,
    staticCustomizeValue,
    staticDownloadData,
    filteredData,
    dispatch,
  } = props

  const [checkedListOfYear, updateCheckedListOfYear] = React.useState([])
  const [checkedListOfMonth, updateCheckedListOfMonth] = React.useState([])
  const [checkedListOfWeek, updateCheckedListOfWeek] = React.useState([])
  const [checkedListOfClient, updateCheckedListOfClient] = React.useState([])
  const [checkedListOfTableColumn, updateListOfTableColumn] = React.useState([])

  React.useEffect(() => {
    filteredData(staticCustomizeValue)
  }, [filteredData, staticCustomizeValue])

  React.useEffect(() => {
    updateCheckedListOfYear([])
    updateCheckedListOfMonth([])
    updateCheckedListOfWeek([])
    updateCheckedListOfClient([])
    updateListOfTableColumn([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData])

  const classifyByYear = (value, data) => {
    if (value === undefined || value.length === 0) {
      return data
    }

    const newData = []

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < value.length; j += 1) {
        if (parseInt(value[j], 10) === data[i].year) {
          newData.push(data[i])
        }
      }
    }

    return newData
  }

  const classifyByMonth = (value, data) => {
    if (value === undefined || value.length === 0) {
      return data
    }

    const newData = []

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < value.length; j += 1) {
        if (value[j] === data[i].month) {
          newData.push(data[i])
        }
      }
    }

    return newData
  }

  const classifyByWeek = (value, data) => {
    if (value === undefined || value.length === 0) {
      return data
    }

    const newData = []

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < value.length; j += 1) {
        if (value[j] === data[i].week.toString()) {
          newData.push(data[i])
        }
      }
    }

    return newData
  }

  const classifyByClients = (value, data) => {
    if (value === undefined || value.length === 0) {
      return data
    }

    const newData = []

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < value.length; j += 1) {
        if (value[j] === (data[i].clientName || data[i].vendorName)) {
          newData.push(data[i])
        }
      }
    }

    return newData
  }

  const customizeColumns = (value, data) => {
    if (value === undefined || value.length === 0) {
      return data
    }

    let newData = []

    for (let i = 0; i < data.length; i += 1) {
      for (let j = 0; j < value.length; j += 1) {
        if (value[j] === data[i].title) {
          data[i].width = 200
          newData.push(data[i])
        }
      }
    }

    if (type === 'Vendor Summary Report') {
      let index = 3
      for (let object = 0; object < data.length; object += 1) {
        if (data[object].title === 'Vendor Name') {
          index = object + 1
          break
        }
      }
      newData = [...data.slice(0, index), ...newData]
    } else if (type === 'Vendor Report') {
      let index = 1
      if (data[2].title === 'Week') {
        index = 3
      } else if (data[1].title === 'Month') {
        index = 2
      }
      newData = [...data.slice(0, index), ...newData]
    } else if (type === 'Customer Summary Report' || type === 'Trade Summary Report') {
      newData = [...data.slice(0, getCustomizePosition(data)), ...newData]
    }
    return newData
  }

  const getCustomizePosition = data => {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].dataIndex === 'grandNoOfTrades') {
        return i + 1
      }
    }
    return 3
  }

  const prepareDataForDownload = (allColumns, data) => {
    const downloadData = []

    let columns = []

    if (
      type === 'Customer Summary Report' ||
      type === 'Trade Summary Report' ||
      type === 'Vendor Report' ||
      type === 'Vendor Summary Report'
    ) {
      const start = type === 'Vendor Summary Report' || type === 'Vendor Report' ? 0 : 1
      for (let i = 0; i < allColumns.length; i += 1) {
        if (allColumns[i].children) {
          for (let j = start; j < allColumns[i].children.length; j += 1) {
            columns.push(allColumns[i].children[j].dataIndex)
          }
        } else {
          columns.push(allColumns[i].dataIndex)
        }
      }
    } else {
      columns = allColumns.map(x => x.dataIndex)
    }

    for (let i = 0; i < data.length; i += 1) {
      const obj = {}
      const currentObj = data[i]
      for (let j = 0; j < columns.length; j += 1) {
        obj[columns[j]] = currentObj[columns[j]]
      }
      downloadData.push(obj)
    }

    if (type === 'Vendor Report' || type === 'Vendor Summary Report') {
      const test = getDownloadData(downloadData, allColumns)
      return test
    }

    return downloadData
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
      const downloadData = []
      for (let column = 0; column < tableColumns.length; column += 1) {
        if (tableColumns[column].children) {
          for (let child = 0; child < tableColumns[column].children.length; child += 1) {
            const { dataIndex } = tableColumns[column].children[child]
            downloadData.push(fillDownloadData(report, dataIndex))
          }
        } else {
          downloadData.push(fillDownloadData(report, tableColumns[column].dataIndex))
        }
      }
      data.push(downloadData)
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
    const downloadData = []
    const nullSymbol = '---'
    Object.entries(data).forEach(([key, value]) => {
      if (dataIndex === key) {
        if (key === 'month' || key === 'vendorName') {
          downloadData.push({
            value: value || nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
        } else if (key === 'year' || key === 'week' || key.includes('numberOfTransaction')) {
          downloadData.push({
            value: value || nullSymbol,
            style: { alignment: { horizontal: 'center' } },
          })
        } else if (key.includes('totalDepositAmountInUSD')) {
          downloadData.push({
            value: value || nullSymbol,
            style: { alignment: { horizontal: 'center' }, numFmt: '0,0.00' },
          })
        } else {
          downloadData.push({
            value: value || nullSymbol,
            style: { alignment: { horizontal: 'center' }, numFmt: '0,0.00\\%' },
          })
        }
      }
    })
    return downloadData[0]
  }

  const handleFilterSubmit = () => {
    const yearWiseClassified = classifyByYear(checkedListOfYear, reportData)
    const monthlyWiseClassified = classifyByMonth(checkedListOfMonth, yearWiseClassified)
    const weeklyWiseClassified = classifyByWeek(checkedListOfWeek, monthlyWiseClassified)
    const clientWiseClassified = classifyByClients(checkedListOfClient, weeklyWiseClassified)
    const customizeColumn = customizeColumns(checkedListOfTableColumn, reportTableColumn)
    const dataForDownload = prepareDataForDownload(customizeColumn, clientWiseClassified)

    switch (type) {
      case 'Customer Summary Report':
        dispatch(updateCustomerSummaryReportData({ clientWiseClassified, dataForDownload }))
        dispatch(updateTableColumns(customizeColumn))
        break
      case 'Trade Summary Report':
        dispatch(updateTradeSummaryReport({ clientWiseClassified, dataForDownload }))
        dispatch(updateTradeSummaryReportColumn(customizeColumn))
        break
      case 'Vendor Summary Report':
        dispatch(updateReportData({ clientWiseClassified, dataForDownload }))
        dispatch(updateReportTableColumn(customizeColumn))
        break
      case 'Vendor Report':
        dispatch(updateVendorSummaryReport({ clientWiseClassified, dataForDownload }))
        dispatch(updateVendorSummaryReportTableColumn(customizeColumn))
        break
      case 'TAT Summary Report':
        dispatch(updateTATSummaryReportData({ clientWiseClassified, dataForDownload }))
        dispatch(updateTATReportTableColumns(customizeColumn))
        break
      case 'TAT Summary Portfolio Report':
        dispatch(updateTATPortfolioSummaryReportData({ clientWiseClassified, dataForDownload }))
        dispatch(updateTATPortfolioReportTableColumns(customizeColumn))
        break
      default:
        break
    }
  }

  const handleFilterOnReset = () => {
    updateCheckedListOfYear([])
    updateCheckedListOfMonth([])
    updateCheckedListOfWeek([])
    updateCheckedListOfClient([])
    updateListOfTableColumn([])

    switch (type) {
      case 'Customer Summary Report':
        dispatch(updateTableColumns(reportTableColumn))
        dispatch(
          updateCustomerSummaryReportData({
            clientWiseClassified: reportData,
            dataForDownload: prepareDataForDownload(reportTableColumn, reportData),
          }),
        )
        break
      case 'Trade Summary Report':
        dispatch(
          updateTradeSummaryReport({
            clientWiseClassified: reportData,
            dataForDownload: prepareDataForDownload(reportTableColumn, reportData),
          }),
        )
        dispatch(updateTradeSummaryReportColumn(reportTableColumn))
        break
      case 'Vendor Summary Report':
        dispatch(
          updateReportData({
            clientWiseClassified: reportData,
            dataForDownload: staticDownloadData,
          }),
        )
        dispatch(updateReportTableColumn(reportTableColumn))
        break
      case 'Vendor Report':
        dispatch(
          updateVendorSummaryReport({
            clientWiseClassified: reportData,
            dataForDownload: staticDownloadData,
          }),
        )
        dispatch(updateVendorSummaryReportTableColumn(reportTableColumn))
        break
      case 'TAT Summary Report':
        dispatch(updateTATReportTableColumns(reportTableColumn))
        dispatch(
          updateTATSummaryReportData({
            clientWiseClassified: reportData,
            dataForDownload: reportData,
          }),
        )
        break
      case 'TAT Summary Portfolio Report':
        dispatch(updateTATPortfolioReportTableColumns(reportTableColumn))
        dispatch(
          updateTATPortfolioSummaryReportData({
            clientWiseClassified: reportData,
            dataForDownload: reportData,
          }),
        )
        break
      default:
        break
    }
  }

  const updatedCheckedAll = (value, category) => {
    switch (category) {
      case 'year':
        updateCheckedListOfYear(value.target.checked ? customizeValueData.year : [])
        break
      case 'month':
        updateCheckedListOfMonth(value.target.checked ? customizeValueData.month : [])
        break
      case 'week':
        updateCheckedListOfWeek(value.target.checked ? customizeValueData.week : [])
        break
      case 'client':
        updateCheckedListOfClient(value.target.checked ? customizeValueData.clients : [])
        break
      case 'column':
        updateListOfTableColumn(value.target.checked ? customizeValueData.customizeColumns : [])
        break
      default:
        break
    }
  }

  // const onSearchTriggered = (value, obj) => {
  //   const newList = []
  //   const list = [...staticCustomizeValue[obj]]
  //   for (let i = 0; i < list.length; i += 1) {
  //     if (list[i].toLowerCase().includes(value.toLowerCase())) {
  //       newList.push(list[i])
  //     }
  //   }
  //   const updatedCustomizeValue = customizeValueData
  //   updatedCustomizeValue[obj] = newList
  //   filteredData(updatedCustomizeValue.length !== 0 ? updatedCustomizeValue : staticCustomizeValue)
  // }

  const getCustomizeValue = () => {
    const data =
      Object.entries(customizeValueData).length !== 0
        ? customizeValueData
        : { year: [], month: [], week: [], clients: [], customizeColumns: [] }

    const YearMenu = (
      <Menu>
        <div className="p-3 pb-1">
          {/* <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={evt => onSearchTriggered(evt.target.value, 'year')}
          />
          <hr className="pb-2" /> */}
          <Checkbox
            indeterminate={!(checkedListOfYear.length === data.year.length)}
            onChange={value => updatedCheckedAll(value, 'year')}
            checked={checkedListOfYear.length === data.year.length && data.year.length !== 0}
          >
            Select all
          </Checkbox>
          <hr className="pb-2" />
          <CheckboxGroup
            options={data.year}
            value={checkedListOfYear}
            onChange={value => updateCheckedListOfYear(value)}
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(auto, minmax(40px))',
              gridGap: '8px',
            }}
          />
        </div>
      </Menu>
    )

    let monthMenu

    if (data.month.length > 0) {
      monthMenu = (
        <Menu>
          <div className="p-3 pb-1">
            {/* <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={evt => onSearchTriggered(evt.target.value, 'month')}
            />
            <hr className="pb-2" /> */}
            <Checkbox
              indeterminate={!(checkedListOfMonth.length === data.month.length)}
              onChange={value => updatedCheckedAll(value, 'month')}
              checked={checkedListOfMonth.length === data.month.length && data.month.length !== 0}
            >
              Select all
            </Checkbox>
            <hr className="pb-2" />
            <CheckboxGroup
              options={data.month}
              value={checkedListOfMonth}
              onChange={value => updateCheckedListOfMonth(value)}
              style={{
                display: 'grid',
                gridTemplateRows: 'repeat(auto, minmax(40px))',
                gridGap: '8px',
              }}
            />
          </div>
        </Menu>
      )
    }

    let weekMenu
    if (data.week && data.week.length > 0) {
      weekMenu = (
        <Menu>
          <div className="p-3 pb-1">
            {/* <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={evt => onSearchTriggered(evt.target.value, 'week')}
            />
            <hr className="pb-2" /> */}
            <Checkbox
              indeterminate={!(checkedListOfWeek.length === data.week.length)}
              onChange={value => updatedCheckedAll(value, 'week')}
              checked={checkedListOfWeek.length === data.week.length && data.week.length !== 0}
            >
              Select all
            </Checkbox>
            <hr className="pb-2" />
            <CheckboxGroup
              options={data.week}
              value={checkedListOfWeek}
              onChange={value => updateCheckedListOfWeek(value)}
              style={{
                display: 'grid',
                gridTemplateRows: 'repeat(auto, minmax(40px))',
                gridGap: '8px',
              }}
            />
          </div>
        </Menu>
      )
    }

    let clientMenu

    if (isClientServiceNeeded) {
      clientMenu = (
        <Menu>
          <div className="p-2">
            {/* <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={evt => onSearchTriggered(evt.target.value, 'clients')}
            />
            <hr className="pb-2" /> */}
            <Checkbox
              indeterminate={!(checkedListOfClient.length === data.clients.length)}
              onChange={value => updatedCheckedAll(value, 'client')}
              checked={
                checkedListOfClient.length === data.clients.length && data.clients.length !== 0
              }
            >
              Select all
            </Checkbox>
            <hr className="pb-2" />
            <CheckboxGroup
              options={data.clients}
              value={checkedListOfClient}
              onChange={value => updateCheckedListOfClient(value)}
              style={{
                display: 'grid',
                gridTemplateRows: 'repeat(auto, minmax(40px))',
                gridGap: '2px',
              }}
            />
          </div>
        </Menu>
      )
    }

    const tableColumnMenu = (
      <Menu>
        <div className="p-2">
          {/* <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={evt => onSearchTriggered(evt.target.value, 'customizeColumns')}
          />
          <hr className="pb-2" /> */}
          <Checkbox
            indeterminate={!(checkedListOfTableColumn.length === data.customizeColumns.length)}
            onChange={value => updatedCheckedAll(value, 'column')}
            checked={
              checkedListOfTableColumn.length === data.customizeColumns.length &&
              data.customizeColumns.length !== 0
            }
          >
            Select all
          </Checkbox>
          <hr className="pb-2" />
          <CheckboxGroup
            options={data.customizeColumns}
            value={checkedListOfTableColumn}
            onChange={value => updateListOfTableColumn(value)}
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(auto, minmax(40px))',
              gridGap: '8px',
            }}
          />
        </div>
      </Menu>
    )

    return (
      <div hidden={!toggleCustomizeValue} className="m-4 pl-2">
        <div className={styles.customizeValueContainer}>
          <div className={styles.year}>
            <Dropdown overlay={YearMenu} trigger={['click']}>
              <Button>
                <a className="ant-dropdown-link" href="javascript: void(0);">
                  Customize Value By Year <Icon type="down" />
                </a>
              </Button>
            </Dropdown>
          </div>
          {data.month.length > 0 && (
            <div>
              <Dropdown overlay={monthMenu} trigger={['click']}>
                <Button>
                  <a className="ant-dropdown-link" href="javascript: void(0);">
                    Customize Value By Month <Icon type="down" />
                  </a>
                </Button>
              </Dropdown>
            </div>
          )}
          {data.week && data.week.length > 0 && (
            <div>
              <Dropdown overlay={weekMenu} trigger={['click']}>
                <Button>
                  <a className="ant-dropdown-link" href="javascript: void(0);">
                    Customize Value By Week <Icon type="down" />
                  </a>
                </Button>
              </Dropdown>
            </div>
          )}
          {isClientServiceNeeded && (
            <div>
              <Dropdown overlay={clientMenu} placement="bottomCenter" trigger={['click']}>
                <Button>
                  <a className="ant-dropdown-link" href="javascript: void(0);">
                    Customize Value By Client <Icon type="down" />
                  </a>
                </Button>
              </Dropdown>
            </div>
          )}
          <div>
            <Dropdown overlay={tableColumnMenu} trigger={['click']}>
              <Button>
                <a className="ant-dropdown-link" href="javascript: void(0);">
                  Customize Value By Column <Icon type="down" />
                </a>
              </Button>
            </Dropdown>
          </div>
        </div>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 4 }} lg={{ span: 3 }}>
            <Button style={{ width: '100%' }} type="primary" onClick={() => handleFilterSubmit()}>
              Customize
            </Button>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 4 }} lg={{ span: 3 }}>
            <Button
              style={{ width: '100%' }}
              type="primary"
              ghost
              onClick={() => handleFilterOnReset()}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </div>
    )
  }

  return <React.Fragment>{getCustomizeValue()}</React.Fragment>
}

export default CustomizeValue
