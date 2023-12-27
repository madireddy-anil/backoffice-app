import React, { Component } from 'react'

import {
  Card,
  Table,
  Spin,
  Skeleton,
  Icon,
  Tooltip,
  Button,
  Form,
  Dropdown,
  Menu,
  Row,
  Col,
  DatePicker,
  Select,
  Drawer,
  Input,
  Checkbox,
} from 'antd'

import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import _ from 'lodash'
import moment from 'moment'
import SubMenu from 'antd/lib/menu/SubMenu'
import {
  formatToZoneDate,
  amountFormatter,
  disabledFutureDate,
  restrictDateFor45Days,
} from '../../../../utilities/transformer'
import {
  getcustomerReport,
  getcustomerReportBulkDownload,
  handleCustomerReportsPagination,
  handleCustomerReportFilters,
} from '../../../../redux/reports/customerReports/actions'
import { getTradeById, updateCurrentChannelDetails } from '../../../../redux/trade/actions'
import styles from './style.module.scss'
import jsondata from './data.json'
import DownloadComponenet from '../../downloadComponents/businessAndFinOpsReportsDownload'

const mapStateToProps = ({ user, customerReports, settings, general }) => ({
  timeZone: settings.timeZone.value,
  token: user.token,
  customerReport: customerReports.customerReport,
  loading: customerReports.loading,
  pagination: customerReports.pagination,
  clients: general.clients,
  currencies: general.currencies,
  beneficiaries: general.beneficiaries,
  allcustomerReportDownload: customerReports.allcustomerReportDownload,
  isDownloadDisabled: customerReports.isDownloadDisabled,
  appliedFilters: customerReports.appliedCustomerReportFilters,
  downloadData: customerReports.reportDownloadData,
})

const CheckboxGroup = Checkbox.Group

const { RangePicker } = DatePicker
const { Option } = Select

@Form.create()
@connect(mapStateToProps)
class CustomerReport extends Component {
  constructor(props) {
    super(props)

    const { dispatch, appliedFilters } = props

    const defaultHeaders = [
      'Trade Number',
      'Date and Time of Request',
      'Customer Name',
      'Deposit Currency',
      'Deposit Amount',
      'Date and Time Local Accounts Provided',
      'Date and Time Deposit Confirmed',
      'Date and Time Swapped Funds Remitted',
      'Remittance Currency',
      'Remitted Amount',
      'Date and Time Funds Remitted To Client',
      'PC Spread',
      'Business Day To Make Transfer',
      'Trade Status',
    ]

    this.state = {
      visibleFilter: false,
      checkedList: this.setDefaultCheckedList(),
      indeterminate: true,
      checkAll: false,
      filters: {},
      visibleDownload: true,
      toggleDefaultFilter: false,
      defaultHeaders,
      downloadDateRangeSelected: false,
    }
    props.pagination.current = 1
    dispatch(handleCustomerReportFilters({ ...appliedFilters, downloadSelectedType: 'current' }))
  }

  componentDidMount() {
    const { dispatch, token, appliedFilters, form } = this.props
    const value = {
      ...appliedFilters,
      page: 1,
      limit: 10,
      token,
    }
    let filterDates
    if (appliedFilters.DateAndTimeAtRequest) {
      filterDates = appliedFilters.DateAndTimeAtRequest
      filterDates[0] = moment(filterDates[0], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
      filterDates[1] = moment(filterDates[1], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
    }
    form.setFieldsValue({ ...appliedFilters, filterDates, downloadSelectedType: 'current' })
    dispatch(getcustomerReport(value))
  }

  handleTableChange = pagination => {
    const { dispatch, token, form, appliedFilters } = this.props
    const { filters, downloadDateRangeSelected } = this.state
    if (!downloadDateRangeSelected) {
      form.setFieldsValue({
        downloadSelectedType: 'current',
      })
      dispatch(
        getcustomerReport({
          ...appliedFilters,
          page: pagination.current,
          limit: pagination.pageSize,
          token,
        }),
      )
      dispatch(handleCustomerReportFilters({ ...appliedFilters, downloadSelectedType: 'current' }))
    }
    dispatch(handleCustomerReportsPagination(pagination))
    filters.token = token
  }

  setDefaultCheckedList = () => {
    const { initialColumns } = jsondata
    return initialColumns.map(column => {
      return column.value
    })
  }

  onChange = checkedList => {
    const { allColumns } = jsondata

    const list = []
    for (let i = 0; i < allColumns.length; i += 1) {
      for (let j = 0; j < checkedList.length; j += 1) {
        if (allColumns[i].value === checkedList[j]) {
          list.push(allColumns[i].label)
        }
      }
    }

    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < allColumns.length,
      checkAll: checkedList.length === allColumns.length,
    })
  }

  onCheckAllChange = e => {
    const { allColumns } = jsondata
    let checkedList = []
    if (e.target.checked) {
      checkedList = allColumns.map(column => {
        return column.value
      })
    }

    this.setState({
      checkedList,
      indeterminate: false,
      checkAll: e.target.checked,
    })
  }

  handleReset = () => {
    this.setState({
      checkedList: this.setDefaultCheckedList(),
      indeterminate: true,
      checkAll: false,
    })
  }

  navigateToTradeDetails = data => {
    const { dispatch, token } = this.props
    const { tradeId, channelId, channelStatus } = data
    const channelData = {
      channelId,
      channelStatus,
    }
    dispatch(updateCurrentChannelDetails(channelData))
    dispatch(getTradeById(tradeId, token))
  }

  // Default Filters

  showDrawer = () => {
    this.setState({
      visibleFilter: true,
    })
  }

  onClose = () => {
    this.setState({
      visibleFilter: false,
    })
  }

  onReset = () => {
    this.setState({ filters: {}, downloadDateRangeSelected: false })
    const { form, token, dispatch } = this.props
    form.setFieldsValue({
      tradeReference: undefined,
      DateAndTimeAtRequest: undefined,
      customerName: undefined,
      depositCurrency: undefined,
      depositAmount: undefined,
      DateAndTimeLocalAccountsProvided: undefined,
      DateAndTimeDepositComfirmed: undefined,
      DateAndTimeSwappedFundsRemitted: undefined,
      destinationCurrency: undefined,
      remittedAmount: undefined,
      dateAndTimeFundsRemittedToClient: undefined,
      pcRateApplied: undefined,
      businessDayToMakeTransfer: undefined,
      status: undefined,
    })
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    const values = {
      token,
    }
    form.setFieldsValue({
      downloadSelectedType: 'current',
      DateAndTimeForDownload: [],
    })
    dispatch(handleCustomerReportFilters({ downloadSelectedType: 'current' }))
    dispatch(handleCustomerReportsPagination(pagination))
    dispatch(getcustomerReport(values))
    this.onClose(values)
  }

  onSubmitFilter = e => {
    e.preventDefault()
    const { form, dispatch, token } = this.props

    form.validateFields((err, values) => {
      if (!err) {
        //  const client = clients.find(el => el.tradingName === values.clientName)
        const value = {
          tradeReference: values.tradeReference,
          customerName: values.customerName,
          depositCurrency: values.depositCurrency,
          depositAmount: values.depositAmount,
          destinationCurrency: values.destinationCurrency,
          remittedAmount: values.remittedAmount,
          pcRateApplied: values.pcRateApplied,
          businessDayToMakeTransfer: values.businessDayToMakeTransfer,
          status: values.status,
          dateFrom: values.DateAndTimeAtRequest
            ? values.DateAndTimeAtRequest[0]
              ? values.DateAndTimeAtRequest[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : ''
            : '',
          dateTo: values.DateAndTimeAtRequest
            ? values.DateAndTimeAtRequest[1]
              ? values.DateAndTimeAtRequest[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : ''
            : '',
          dateFieldType: 'dateAndTimeOfRequest',
          DateAndTimeAtRequest: values.DateAndTimeAtRequest,
          downloadSelectedType: 'current',
          token,
        }

        form.setFieldsValue({
          downloadSelectedType: 'current',
          DateAndTimeForDownload: restrictDateFor45Days(values.DateAndTimeAtRequest)
            ? values.DateAndTimeAtRequest
            : undefined,
        })

        const pagination = {
          current: 1,
          total: 0,
          pageSize: 10,
        }

        dispatch(handleCustomerReportFilters(value))
        dispatch(handleCustomerReportsPagination(pagination))
        this.setState({ filters: value, downloadDateRangeSelected: false })
        dispatch(getcustomerReport(value))
      }
    })
    this.onClose()
  }

  defaultFilters = () => {
    const { form } = this.props
    const { toggleDefaultFilter } = this.state
    const { getFieldDecorator } = form

    return (
      <div hidden={!toggleDefaultFilter} className="p-4">
        <Row span={24} className="pl-2">
          <Col span={20}>
            <Form layout="inline" onSubmit={this.onSubmitFilter}>
              <Form.Item label="Date and Time Trade Requested At">
                {getFieldDecorator('DateAndTimeAtRequest')(
                  <RangePicker
                    style={{ width: '258px !important', margin: '0px' }}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('23:59:59', 'HH:mm:ss'),
                      ],
                    }}
                    format="YYYY/MM/DD HH:mm:ss"
                    disabledDate={disabledFutureDate}
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <Button className="mr-2 ml-2" type="primary" ghost onClick={this.onReset}>
                  Reset
                </Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  filter
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col
            span={4}
            style={{ display: 'flex', flexDirection: 'row-reverse', paddingTop: '5px' }}
          >
            <Button type="link" onClick={this.showDrawer}>
              Advance filter
            </Button>
          </Col>
        </Row>
      </div>
    )
  }

  getFilterDrawer = () => {
    const { visibleFilter } = this.state
    const { form, currencies, clients } = this.props
    const { getFieldDecorator } = form
    const clientOption = clients.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        <h5>{option.genericInformation.tradingName}</h5>
        <small>{option.genericInformation.registeredCompanyName}</small>
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    return (
      <Drawer
        title="Filter Customer Report"
        width={600}
        onClose={this.onClose}
        visible={visibleFilter}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={this.onSubmitFilter}>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Trade Number">
                {getFieldDecorator('tradeReference', {
                  initialValue: undefined,
                })(
                  <Input
                    placeholder="Filter by Trade Number"
                    onChange={this.onClientFilterChange}
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date and Time Trade Requested At">
                {getFieldDecorator('DateAndTimeAtRequest')(
                  <RangePicker
                    disabledDate={disabledFutureDate}
                    style={{ width: '258px !important', margin: '0px' }}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('23:59:59', 'HH:mm:ss'),
                      ],
                    }}
                    format="YYYY/MM/DD HH:mm:ss"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Customer Name">
                {getFieldDecorator('customerName', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Filter by Customer Name"
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {clientOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Deposit Currency">
                {getFieldDecorator('depositCurrency', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Search by deposit Currency"
                    optionFilterProp="children"
                    // onChange={this.onClientFilterChange}
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                    onSearch={this.onClientFilterSearch}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Deposit Amount">
                {getFieldDecorator('depositAmount', {
                  initialValue: undefined,
                })(<Input placeholder="Filter by Deposit Amount" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Destination Currency">
                {getFieldDecorator('destinationCurrency', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Search by Destination Currency"
                    optionFilterProp="children"
                    // onChange={this.onClientFilterChange}
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                    onSearch={this.onClientFilterSearch}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Remitted Amount">
                {getFieldDecorator('remittedAmount', {
                  initialValue: undefined,
                })(<Input placeholder="Filter by Remitted Amount" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status Of Trade">
                {getFieldDecorator('status', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Please choose the status"
                    onChange={this.onSearchStatusChange}
                  >
                    <Option value="completed">COMPLETED</Option>
                    <Option value="funds_remitted">FUNDS REMITTED</Option>
                    <Option value="quote_confirmed">QUOTE CONFIRMED</Option>
                    <Option value="deposits_confirmed">DEPOSITS CONFIRMED</Option>
                    <Option value="accounts_provided">ACCOUNTS PROVIDED</Option>
                    <Option value="accounts_requested">ACCOUNTS REQUESTED</Option>
                    <Option value="new">NEW</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button className="mr-2" type="primary" ghost onClick={this.onReset}>
              Reset
            </Button>
            <Button htmlType="submit" type="primary">
              Filter
            </Button>
          </div>
        </Form>
      </Drawer>
    )
  }

  onChangeDownload = (type, dateFrom, dateTo) => {
    const { token, dispatch, pagination, appliedFilters } = this.props
    const { filters } = this.state
    if (type === 'all') {
      filters.limit = 0
      filters.token = token
      dispatch(
        getcustomerReportBulkDownload({
          ...appliedFilters,
          page: undefined,
          type,
          dateFrom,
          dateTo,
          limit: 0,
          token,
        }),
      )
      this.setState({
        downloadDateRangeSelected: true,
      })
    } else {
      filters.page = pagination.current
      filters.limit = pagination.pageSize
      filters.token = token
      dispatch(getcustomerReportBulkDownload(filters))
      this.setState({ downloadDateRangeSelected: false })
      dispatch(handleCustomerReportsPagination({ ...pagination, current: 1 }))
    }
    dispatch(handleCustomerReportFilters({ ...appliedFilters, downloadSelectedType: type }))
  }

  prepareInitialDownloadData = downloadData => {
    const data = []
    const nullSymbol = '---'
    const { timeZone } = this.props
    downloadData.forEach(report => {
      const reportData = []
      reportData.push({
        value: report.tradeReference ? report.tradeReference : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.dateAndTimeOfRequest
          ? formatToZoneDate(report.dateAndTimeOfRequest, timeZone)
          : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.customerName ? report.customerName : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.depositCurrency ? report.depositCurrency : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.depositAmount ? report.depositAmount : nullSymbol,
        style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.dateAndTimeLocalAccountsProvided
          ? formatToZoneDate(report.dateAndTimeLocalAccountsProvided, timeZone)
          : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.depositConfirmedByClientAt
          ? formatToZoneDate(report.depositConfirmedByClientAt, timeZone)
          : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.dateAndTimeSwappedFundsRemitted
          ? formatToZoneDate(report.dateAndTimeSwappedFundsRemitted, timeZone)
          : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.destinationCurrency ? report.destinationCurrency : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.remittedAmountDestinationCurrency
          ? report.remittedAmountDestinationCurrency
          : nullSymbol,
        style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.dateAndTimeFundsRemittedToClientAccount
          ? formatToZoneDate(report.dateAndTimeFundsRemittedToClientAccount, timeZone)
          : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })

      reportData.push({
        value: report.pcRateApplied ? report.pcRateApplied : nullSymbol,
        style: { numFmt: '0.00\\%', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.timeTakenToMakeTransferInDays
          ? report.timeTakenToMakeTransferInDays
          : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: _.upperCase(report.tradeStatus),
        style: { alignment: { horizontal: 'center' } },
      })
      data.push(reportData)
    })
    return data
  }

  handleTableColumns = () => {
    const nullSymbol = '---'
    const { checkedList } = this.state
    const { timeZone } = this.props
    const columns = [
      {
        title: 'Trade Number',
        dataIndex: 'tradeReference',
        key: 'tradeReference',
        width: 100,
        align: 'center',
        render: id => <Button type="link">{id || nullSymbol}</Button>,
      },
      {
        title: 'Date and Time of Request',
        dataIndex: 'dateAndTimeOfRequest',
        key: 'dateAndTimeOfRequest',
        width: 150,
        align: 'center',
        render: dateOfrequest =>
          dateOfrequest ? formatToZoneDate(dateOfrequest, timeZone) : nullSymbol,
      },
      {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
        width: 100,
        align: 'center',
        render: customerName => customerName || nullSymbol,
      },
      {
        title: 'Deposit Currency',
        dataIndex: 'depositCurrency',
        key: 'depositCurrency',
        align: 'center',
        render: depositCurrency => depositCurrency || nullSymbol,
      },
      {
        title: 'Deposit Amount',
        dataIndex: 'depositAmount',
        key: 'depositAmount',
        align: 'center',
        render: depositAmount => (depositAmount ? amountFormatter(depositAmount) : nullSymbol),
      },
      {
        title: 'Date and time Local Accounts Provided',
        dataIndex: 'dateAndTimeLocalAccountsProvided',
        key: 'dateAndTimeLocalAccountsProvided',
        align: 'center',
        width: 150,
        render: localAccountsProvided =>
          localAccountsProvided ? formatToZoneDate(localAccountsProvided, timeZone) : nullSymbol,
      },
      {
        title: 'Date and Time Deposit Confirmed',
        dataIndex: 'depositConfirmedByClientAt',
        key: 'depositConfirmedByClientAt',
        align: 'center',
        width: 150,
        render: depositConfirmedByClientAt =>
          depositConfirmedByClientAt
            ? formatToZoneDate(depositConfirmedByClientAt, timeZone)
            : nullSymbol,
      },
      {
        title: 'Date and Time Swapped Funds Remitted',
        dataIndex: 'dateAndTimeSwappedFundsRemitted',
        key: 'dateAndTimeSwappedFundsRemitted',
        align: 'center',
        width: 150,
        render: dateSwappedFundsRemitted =>
          dateSwappedFundsRemitted
            ? formatToZoneDate(dateSwappedFundsRemitted, timeZone)
            : nullSymbol,
      },
      {
        title: 'Destination Currency',
        dataIndex: 'destinationCurrency',
        key: 'destinationCurrency',
        align: 'center',
        render: destCurrency => destCurrency || nullSymbol,
      },
      {
        title: 'Remitted Amount (Settlement)',
        dataIndex: 'remittedAmountDestinationCurrency',
        key: 'remittedAmountDestinationCurrency',
        align: 'center',
        render: destinationAmount =>
          destinationAmount ? amountFormatter(destinationAmount) : nullSymbol,
      },
      {
        title: 'Date and Time Funds Remitted To Client',
        dataIndex: 'dateAndTimeFundsRemittedToClientAccount',
        key: 'dateAndTimeFundsRemittedToClientAccount',
        align: 'center',
        width: 150,
        render: dateFundsRemittedToClientAccount =>
          dateFundsRemittedToClientAccount
            ? formatToZoneDate(dateFundsRemittedToClientAccount, timeZone)
            : nullSymbol,
      },
      {
        title: 'PC Spread',
        dataIndex: 'pcRateApplied',
        key: 'pcRateApplied',
        align: 'center',
        render: rate => (rate ? `${parseFloat(rate)} %` : nullSymbol),
      },
      {
        title: 'Business Day To Make Transfer',
        dataIndex: 'timeTakenToMakeTransferInDays',
        key: 'timeTakenToMakeTransferInDays',
        align: 'center',
        render: timeTakenToMakeTransferInDays => timeTakenToMakeTransferInDays || nullSymbol,
      },
      {
        title: 'Trade Status',
        dataIndex: 'tradeStatus',
        key: 'tradeStatus',
        align: 'center',
        render: value => _.upperCase(value),
      },
    ]
    const selectedColumns = []
    checkedList.forEach(columnName => {
      const columnDetails = _.find(columns, ['dataIndex', columnName])

      if (columnDetails) {
        selectedColumns.push(columnDetails)
      }
    })
    return selectedColumns
  }

  render() {
    const selectedColumns = this.handleTableColumns()
    const { allColumns } = jsondata
    const {
      customerReport,
      loading,
      pagination,
      appliedFilters,
      isDownloadDisabled,
      downloadData,
      form,
    } = this.props
    const {
      toggleDefaultFilter,
      indeterminate,
      checkAll,
      checkedList,
      visibleDownload,
      defaultHeaders,
    } = this.state

    const settingsMenu = (
      <Menu style={{ width: '250px' }}>
        <Menu.Item onClick={() => this.setState({ toggleDefaultFilter: !toggleDefaultFilter })}>
          <Icon type="filter" />
          <span className="pr-4"> Filter </span>
        </Menu.Item>
        <SubMenu
          title={
            <span>
              <Icon type="down-circle" />
              <span className="pr-4"> Download </span>
            </span>
          }
        >
          <Menu.Item
            className="mr-3"
            onClick={() =>
              this.setState(prevState => ({
                visibleDownload: !prevState.visibleDownload,
              }))
            }
          >
            <Icon
              type="download"
              className="mr-3"
              onClick={() =>
                this.setState(prevState => ({
                  visibleDownload: !prevState.visibleDownload,
                }))
              }
            />
            Download Excel
          </Menu.Item>
        </SubMenu>
        <SubMenu
          title={
            <span>
              <Icon type="file-search" />
              Customised Columns
            </span>
          }
          onTitleMouseEnter={this.onMenuChange}
        >
          <div className="p-4">
            <div style={{ borderBottom: '1px solid #E9E9E9' }} className="pb-2">
              <Checkbox
                indeterminate={indeterminate}
                onChange={this.onCheckAllChange}
                checked={checkAll}
              >
                Check all
              </Checkbox>
            </div>
            <br />
            <div className={styles.modifyColumnBtn}>
              <CheckboxGroup
                className={styles.txncheckbox}
                value={checkedList}
                options={allColumns}
                onChange={this.onChange}
              />
            </div>
            <Col className="pt-4">
              <Button size="small" onClick={this.handleReset} icon="reload">
                RESET
              </Button>
            </Col>
          </div>
        </SubMenu>
      </Menu>
    )

    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Customer Report</span>
          </div>
        }
        bordered
        headStyle={{
          border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        bodyStyle={{
          padding: '0',
          border: '1px solid #a8c6fa',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
        }}
        extra={
          <div>
            <Tooltip title="settings">
              <Dropdown overlay={settingsMenu} trigger={['click']}>
                <Icon type="setting" />
              </Dropdown>
            </Tooltip>
          </div>
        }
      >
        <Helmet title="Trades" />
        <div className={styles.block}>
          {this.defaultFilters()}
          {this.getFilterDrawer()}
          <DownloadComponenet
            titleForDownload="Customer"
            toggleDownload={visibleDownload}
            isDownloadDisabled={isDownloadDisabled}
            downloadData={downloadData}
            onChangeDownload={this.onChangeDownload}
            currentValue={appliedFilters.downloadSelectedType}
            jsonData={jsondata}
            getInitialData={this.prepareInitialDownloadData}
            checkedListOfCustomizeColumn={checkedList}
            defaultDownloadColumnHeaders={defaultHeaders}
            form={form}
          />
          <div className="row">
            <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
              <Skeleton loading={loading} active>
                <Spin tip="Loading..." spinning={loading}>
                  <Table
                    className={styles.reportTable}
                    columns={selectedColumns}
                    rowKey={record => record.id}
                    onRow={record => ({
                      onClick: () => {
                        this.navigateToTradeDetails(record)
                      },
                    })}
                    pagination={{
                      ...pagination,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ['10', '25', '50', '100'],
                      // locale: { items_per_page: '' },
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    dataSource={customerReport}
                    scroll={{ x: 'max-content' }}
                    onChange={this.handleTableChange}
                  />
                </Spin>
              </Skeleton>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

export default CustomerReport
