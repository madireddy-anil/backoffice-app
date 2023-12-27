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
  ClearFilterOnComponentUnMount,
  dateRangeResetTheTime,
  dateRangeResetAfterReset,
} from '../../../../utilities/transformer'

import {
  getVendorReport,
  getVendorReportBulkDownload,
  handleVendorReportPagination,
  handleVendorReportFilters,
} from '../../../../redux/reports/vendorReport/actions'
import styles from './style.module.scss'
import jsondata from './data.json'
import DownloadComponenet from '../../downloadComponents/businessAndFinOpsReportsDownload'

const mapStateToProps = ({ user, vendorReport, settings, general }) => ({
  timeZone: settings.timeZone.value,
  token: user.token,
  vendorReport: vendorReport.vendorReport,
  loading: vendorReport.loading,
  pagination: vendorReport.pagination,
  clients: general.clients,
  vendors: general.newVendors,
  currencies: general.currencies,
  beneficiaries: general.beneficiaries,
  isDownloadDisabled: vendorReport.isDownloadDisabled,
  appliedFilters: vendorReport.appliedVendorReportFilters,
  downloadData: vendorReport.reportDownloadData,
})

const CheckboxGroup = Checkbox.Group

const { RangePicker } = DatePicker
const { Option } = Select

@Form.create()
@connect(mapStateToProps)
class VendorReport extends Component {
  constructor(props) {
    super(props)

    const defaultHeaders = [
      'Trade Number',
      'Date of Deposit',
      'Date of Initiation',
      'Customer Name',
      'Deposit Currency',
      'Deposit Amount Local',
      'Deposit Amount (in USD)',
      'Customer Sell Rate Vs XE.com',
      'Rental Account Provider Name',
      'Rental Account Cost In USD',
      'Swap Provider Name',
      '% of Buy Rate With XE - Swap',
      'Swap Cost in USD',
      'OTC Provider Name',
      '% of Buy Rate With XE - OTC',
      'OTC Cost in USD',
      'Crypto Wallet Provider Name',
      'Liquidate Provider Name',
      '% of Buy Rate with XE - Liquidate',
      'Liquidate Cost in USD',
      'Fx Provider Name',
      '% of Buy Rate with XE - Fx',
      'Fx Cost in USD',
      'Settlement Currency',
      'Settlement Amount',
      'Trade Status',
    ]

    const { dispatch, appliedFilters } = props

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
    dispatch(handleVendorReportFilters({ ...appliedFilters, downloadSelectedType: 'current' }))
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
    if (appliedFilters.DateOfDeposit || appliedFilters.DateOfInitiate) {
      filterDates = appliedFilters.DateOfDeposit || appliedFilters.DateOfInitiate
      filterDates[0] = moment(filterDates[0], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
      filterDates[1] = moment(filterDates[1], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
    }
    form.setFieldsValue({ ...appliedFilters, filterDates, downloadSelectedType: 'current' })
    dispatch(getVendorReport(value))
  }

  componentWillUnmount() {
    this.mounted = false
    const { dispatch } = this.props
    ClearFilterOnComponentUnMount('', handleVendorReportFilters, dispatch)
  }

  handleTableChange = pagination => {
    const { dispatch, token, form, appliedFilters } = this.props
    const { filters, downloadDateRangeSelected } = this.state
    if (!downloadDateRangeSelected) {
      form.setFieldsValue({
        downloadSelectedType: 'current',
      })
      filters.page = pagination.current
      filters.limit = pagination.pageSize
      filters.token = token
      dispatch(
        handleVendorReportFilters({
          ...appliedFilters,
          page: pagination.current,
          limit: pagination.pageSize,
          token,
        }),
      )
      dispatch(handleVendorReportFilters({ downloadSelectedType: 'current' }))
      dispatch(getVendorReport(filters))
    }
    dispatch(handleVendorReportPagination(pagination))
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
      DateOfDeposit: undefined,
      customerName: undefined,
      depositAmountLocal: undefined,
      depositAmountInUSD: undefined,
      DateOfInitiate: undefined,
      settlementAmount: undefined,
      settlementCurrency: undefined,
      depositCurrency: undefined,
      vendorId: undefined,
      tradeStatus: undefined,
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

    dispatch(handleVendorReportFilters({ downloadSelectedType: 'current' }))
    dispatch(handleVendorReportPagination(pagination))
    dispatch(getVendorReport(values))
  }

  onSubmitFilter = e => {
    e.preventDefault()
    const { form, dispatch, token } = this.props

    form.validateFields((err, values) => {
      if (!err) {
        const value = {
          clientId: values.id,
          vendorId: values.vendorId,
          tradeReference: values.tradeReference,
          customerName: values.customerName,
          vendorName: values.tradingName,
          depositCurrency: values.depositCurrency,
          depositAmountLocal: values.depositAmountLocal,
          depositAmountInUSD: values.depositAmountInUSD,
          settlementCurrency: values.settlementCurrency,
          settlementAmount: values.settlementAmount,
          tradeStatus: values.tradeStatus,
          DateOfDeposit: values.DateOfDeposit,
          DateOfInitiate: values.DateOfInitiate,
          dateFromOfDeposit: values.DateOfDeposit
            ? values.DateOfDeposit[0]
              ? values.DateOfDeposit[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : 0
            : '',
          dateToOfDeposit: values.DateOfDeposit
            ? values.DateOfDeposit[1]
              ? values.DateOfDeposit[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : 0
            : '',
          dateFromOfInitiate: values.DateOfInitiate
            ? values.DateOfInitiate[0]
              ? values.DateOfInitiate[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : 0
            : '',
          dateToOfInitiate: values.DateOfInitiate
            ? values.DateOfInitiate[1]
              ? values.DateOfInitiate[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : 0
            : '',
          dateFieldType: 'dateOfDeposit',
          downloadSelectedType: 'current',
          token,
        }

        form.setFieldsValue({
          downloadSelectedType: 'current',
          DateAndTimeForDownload: restrictDateFor45Days(
            values.DateOfInitiate || values.DateOfDeposit,
          )
            ? values.DateOfInitiate || values.DateOfDeposit
            : undefined,
        })

        const pagination = {
          current: 1,
          total: 0,
          pageSize: 10,
        }
        dispatch(handleVendorReportFilters(value))
        dispatch(handleVendorReportPagination(pagination))
        this.setState({ filters: value, downloadDateRangeSelected: false })
        dispatch(getVendorReport(value))
      }
    })
  }

  depositDateHandler = evt => {
    const { form } = this.props
    form.setFieldsValue({
      DateOfInitiate: null,
    })
    dateRangeResetTheTime(evt)
  }

  initiateDateHandler = evt => {
    const { form } = this.props
    form.setFieldsValue({
      DateOfDeposit: null,
    })
    dateRangeResetTheTime(evt)
  }

  defaultFilters = () => {
    const { form, appliedFilters } = this.props
    const { toggleDefaultFilter } = this.state
    const { getFieldDecorator } = form

    return (
      <div hidden={!toggleDefaultFilter} className="p-4">
        <Row span={24} className="pl-2">
          <Col span={20}>
            <Form layout="inline" onSubmit={this.onSubmitFilter}>
              <Form.Item label="Initiation Date Time">
                {getFieldDecorator('DateOfInitiate')(
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
                    onCalendarChange={evt =>
                      dateRangeResetAfterReset(evt, appliedFilters.DateOfInitiate)
                    }
                    onChange={this.initiateDateHandler}
                    format="YYYY/MM/DD HH:mm:ss"
                  />,
                )}
              </Form.Item>
              <Form.Item label="Deposit Date Time">
                {getFieldDecorator('DateOfDeposit')(
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
                    onCalendarChange={evt =>
                      dateRangeResetAfterReset(evt, appliedFilters.DateOfDeposit)
                    }
                    onChange={this.depositDateHandler}
                    format="YYYY/MM/DD HH:mm:ss"
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
    const { form, currencies, clients, vendors, appliedFilters } = this.props
    const { getFieldDecorator } = form
    const clientOption = clients.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
        id={option.id}
      >
        <h5>{option.genericInformation.tradingName}</h5>
        <small>{option.genericInformation.registeredCompanyName}</small>
      </Option>
    ))
    const vendorOption = vendors.map(option => (
      <Option key={option.id} label={option.genericInformation?.tradingName} id={option.id}>
        <h5>{option.genericInformation?.tradingName}</h5>
        <small>{option.genericInformation?.registeredCompanyName}</small>
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    return (
      <Drawer
        title="Filter Vendor Report"
        width={600}
        onClose={this.onClose}
        visible={visibleFilter}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={this.onSubmitFilter}>
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
              <Form.Item label="Vendor Name">
                {getFieldDecorator('vendorId', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Filter by Vendor Name"
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {vendorOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Date and Time of Deposit">
                {getFieldDecorator('DateOfDeposit')(
                  <RangePicker
                    disabledDate={disabledFutureDate}
                    style={{ width: '258px !important', margin: '0px' }}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    format="YYYY/MM/DD HH:mm:ss"
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('23:59:59', 'HH:mm:ss'),
                      ],
                    }}
                    onCalendarChange={evt =>
                      dateRangeResetAfterReset(evt, appliedFilters.DateOfDeposit)
                    }
                    onChange={this.depositDateHandler}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Initiation Date Time">
                {getFieldDecorator('DateOfInitiate')(
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
                    onCalendarChange={evt =>
                      dateRangeResetAfterReset(evt, appliedFilters.DateOfInitiate)
                    }
                    onChange={this.initiateDateHandler}
                    format="YYYY/MM/DD HH:mm:ss"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
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
              <Form.Item label="Deposit Currency">
                {getFieldDecorator('depositCurrency', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Filter by deposit Currency"
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
              <Form.Item label="Deposit Amount Loacal">
                {getFieldDecorator('depositAmountLocal', {
                  initialValue: undefined,
                })(<Input placeholder="Filter by Deposit Amount Local" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Settlement Currency">
                {getFieldDecorator('settlementCurrency', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Filter by Settlement Currency"
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
              <Form.Item label="Settlement Amount">
                {getFieldDecorator('settlementAmount', {
                  initialValue: undefined,
                })(<Input placeholder="Filter by Settlement Amount" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trade Status">
                {getFieldDecorator('tradeStatus', {
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
    const {
      token,
      dispatch,
      pagination: { current, pageSize },
      appliedFilters,
    } = this.props
    const { filters } = this.state

    const dateFromOfInitiate = filters.dateFromOfDeposit ? '' : dateFrom
    const dateToOfInitiate = filters.dateToOfDeposit ? '' : dateTo
    const dateFromOfDeposit = filters.dateFromOfDeposit ? dateFrom : ''
    const dateToOfDeposit = filters.dateToOfDeposit ? dateTo : ''

    if (type === 'all') {
      filters.limit = 0
      filters.token = token
      dispatch(
        getVendorReportBulkDownload(
          {
            ...appliedFilters,
            page: undefined,
            dateFromOfInitiate,
            dateToOfInitiate,
            dateFromOfDeposit,
            dateToOfDeposit,
            limit: 0,
            token,
          },
          token,
        ),
      )
      this.setState({ downloadDateRangeSelected: true })
    } else {
      dispatch(
        getVendorReportBulkDownload(
          { ...appliedFilters, page: current, limit: pageSize, token },
          token,
        ),
      )
      this.setState({ downloadDateRangeSelected: false })
    }
    dispatch(handleVendorReportFilters({ ...appliedFilters, downloadSelectedType: type }))
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
        value: report.dateOfDeposit ? formatToZoneDate(report.dateOfDeposit, timeZone) : nullSymbol,
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
        value: report.depositAmountLocal ? report.depositAmountLocal : 0,
        style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.depositAmountInUSD ? report.depositAmountInUSD : 0,
        style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.customerSellRate ? report.customerSellRate : 0,
        style: { numFmt: '0,0.00\\%', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.accountsOnlyProviderName ? report.accountsOnlyProviderName : 0,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.accountsOnlyCostInUSD ? report.accountsOnlyCostInUSD : 0,
        style: { numFmt: '0,0.00\\%', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.swapProviderName ? report.swapProviderName : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.swapBuyRatewithXERate ? report.swapBuyRatewithXERate : 0,
        style: { numFmt: '0,0.00\\%', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.swapCostInUSD ? report.swapCostInUSD : 0,
        style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.otcProviderName ? report.otcProviderName : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.otcBuyRatewithXERate ? report.otcBuyRatewithXERate : 0,
        style: { numFmt: '0,0.00\\%', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.otcCostInUSD ? report.otcCostInUSD : 0,
        style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.cryptoWalletProviderName ? report.cryptoWalletProviderName : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.liquidateProviderName ? report.liquidateProviderName : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.liquidateBuyRatewithXERate ? report.liquidateBuyRatewithXERate : 0,
        style: { numFmt: '0,0.00\\%', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.liquidateCostInUSD ? report.liquidateCostInUSD : 0,
        style: { numFmt: '0,0.00', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.fxProviderName ? report.fxProviderName : nullSymbol,
        style: { alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.fxBuyRatewithXERate ? report.fxBuyRatewithXERate : 0,
        style: { numFmt: '0,0.00\\%', alignment: { horizontal: 'center' } },
      })
      reportData.push({
        value: report.fxCostInUSD ? report.fxCostInUSD : 0,
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
        width: 150,
        align: 'center',
      },
      {
        title: 'Date Of Initiation',
        dataIndex: 'dateAndTimeOfRequest',
        key: 'dateAndTimeOfRequest',
        width: 150,
        align: 'center',
        render: dateAndTimeOfRequest =>
          dateAndTimeOfRequest ? formatToZoneDate(dateAndTimeOfRequest, timeZone) : nullSymbol,
      },
      {
        title: 'Date Of Deposit',
        dataIndex: 'dateOfDeposit',
        key: 'dateOfDeposit',
        width: 150,
        align: 'center',
        render: dateOfDeposit =>
          dateOfDeposit ? formatToZoneDate(dateOfDeposit, timeZone) : nullSymbol,
      },
      {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
        width: 150,
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
        title: 'Deposit Amount Local',
        dataIndex: 'depositAmountLocal',
        key: 'depositAmountLocal',
        align: 'center',
        render: depositAmountLocal =>
          depositAmountLocal ? amountFormatter(depositAmountLocal) : 0,
      },
      {
        title: 'Deposit Amount (in USD)',
        dataIndex: 'depositAmountInUSD',
        key: 'depositAmountInUSD',
        align: 'center',
        render: depositAmountInUSD =>
          depositAmountInUSD ? amountFormatter(depositAmountInUSD) : 0,
      },
      {
        title: 'Customer Sell Rate Vs XE.com',
        dataIndex: 'customerSellRate',
        key: 'customerSellRate',
        align: 'center',
        width: 150,
        render: customerSellRate =>
          customerSellRate ? `${parseFloat(customerSellRate)} %` : '0 %',
      },
      {
        title: 'Rental Account Provider Name',
        dataIndex: 'accountsOnlyProviderName',
        key: 'accountsOnlyProviderName',
        align: 'center',
        width: 150,
        render: accountsOnlyProviderName => accountsOnlyProviderName || nullSymbol,
      },
      {
        title: 'Rental Account Cost In USD',
        dataIndex: 'accountsOnlyCostInUSD',
        key: 'accountsOnlyCostInUSD',
        align: 'center',
        width: 150,
        render: accountsOnlyCostInUSD =>
          accountsOnlyCostInUSD ? `${parseFloat(accountsOnlyCostInUSD)} %` : '0 %',
      },
      {
        title: 'Swap Provider Name',
        dataIndex: 'swapProviderName',
        key: 'swapProviderName',
        align: 'center',
        width: 150,
        render: swapProviderName => swapProviderName || nullSymbol,
      },
      {
        title: '% of Buy Rate With XE - Swap',
        dataIndex: 'swapBuyRatewithXERate',
        key: 'swapBuyRatewithXERate',
        align: 'center',
        width: 150,
        render: swapBuyRatewithXERate =>
          swapBuyRatewithXERate ? `${parseFloat(swapBuyRatewithXERate)} %` : '0 %',
      },
      {
        title: 'Swap Cost in USD',
        dataIndex: 'swapCostInUSD',
        key: 'swapCostInUSD',
        align: 'center',
        render: swapCostInUSD => (swapCostInUSD ? amountFormatter(swapCostInUSD) : 0),
      },
      {
        title: 'OTC Provider Name',
        dataIndex: 'otcProviderName',
        key: 'otcProviderName',
        align: 'center',
        width: 150,
        render: otcProviderName => otcProviderName || nullSymbol,
      },
      {
        title: '% of Buy Rate With XE - OTC',
        dataIndex: 'otcBuyRatewithXERate',
        key: 'otcBuyRatewithXERate',
        align: 'center',
        width: 150,
        render: otcBuyRatewithXERate =>
          otcBuyRatewithXERate ? `${parseFloat(otcBuyRatewithXERate)} %` : '0 %',
      },
      {
        title: 'OTC Cost in USD',
        dataIndex: 'otcCostInUSD',
        key: 'otcCostInUSD',
        align: 'center',
        render: otcCostInUSD => (otcCostInUSD ? amountFormatter(otcCostInUSD) : 0),
      },
      {
        title: 'Crypto Wallet Provider Name',
        dataIndex: 'cryptoWalletProviderName',
        key: 'cryptoWalletProviderName',
        align: 'center',
        width: 150,
        render: cryptoWalletProviderName => cryptoWalletProviderName || nullSymbol,
      },
      {
        title: 'Liquidate Provider Name',
        dataIndex: 'liquidateProviderName',
        key: 'liquidateProviderName',
        align: 'center',
        width: 150,
        render: liquidateProviderName => liquidateProviderName || nullSymbol,
      },
      {
        title: '% of Buy Rate With XE - Liquidate',
        dataIndex: 'liquidateBuyRatewithXERate',
        key: 'liquidateBuyRatewithXERate',
        align: 'center',
        width: 150,
        render: liquidateBuyRatewithXERate =>
          liquidateBuyRatewithXERate ? `${parseFloat(liquidateBuyRatewithXERate)} %` : '0 %',
      },
      {
        title: 'Liquidate Cost in USD',
        dataIndex: 'liquidateCostInUSD',
        key: 'liquidateCostInUSD',
        align: 'center',
        render: liquidateCostInUSD =>
          liquidateCostInUSD ? amountFormatter(liquidateCostInUSD) : 0,
      },
      {
        title: 'Fx Provider Name',
        dataIndex: 'fxProviderName',
        key: 'fxProviderName',
        align: 'center',
        width: 150,
        render: fxProviderName => fxProviderName || nullSymbol,
      },
      {
        title: '% of Buy Rate With XE - Fx',
        dataIndex: 'fxBuyRatewithXERate',
        key: 'fxBuyRatewithXERate',
        align: 'center',
        width: 150,
        render: fxBuyRatewithXERate =>
          fxBuyRatewithXERate ? `${parseFloat(fxBuyRatewithXERate)} %` : '0 %',
      },
      {
        title: 'Fx Cost in USD',
        dataIndex: 'fxCostInUSD',
        key: 'fxCostInUSD',
        align: 'center',
        render: fxCostInUSD => (fxCostInUSD ? amountFormatter(fxCostInUSD) : 0),
      },
      {
        title: 'Settlement Currency',
        dataIndex: 'settlementCurrency',
        key: 'settlementCurrency',
        align: 'center',
        render: settlementCurrency => settlementCurrency || nullSymbol,
      },
      {
        title: 'Settlement Amount',
        dataIndex: 'settlementAmount',
        key: 'settlementAmount',
        align: 'center',
        render: settlementAmount => (settlementAmount ? amountFormatter(settlementAmount) : 0),
      },
      {
        title: 'Trade Status',
        dataIndex: 'tradeStatus',
        key: 'tradeStatus',
        align: 'center',
        width: 150,
        render: tradeStatus => _.upperCase(tradeStatus),
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
      vendorReport,
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
            {/* <CheckboxGroup value={checkedList} onChange={this.onChange}>
              {this.showCheckBoxes()}
            </CheckboxGroup> */}
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
            <span className="font-size-16">Vendor Report</span>
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
            titleForDownload="Vendor"
            toggleDownload={visibleDownload}
            isDownloadDisabled={isDownloadDisabled}
            downloadData={downloadData}
            onChangeDownload={this.onChangeDownload}
            currentValue={appliedFilters.downloadSelectedType}
            jsonData={jsondata}
            appliedFilters={appliedFilters}
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
                    // onRow={record => ({
                    //   onClick: () => {
                    //     this.navigateToTradeDetails(record)
                    //   },
                    // })}
                    pagination={{
                      ...pagination,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ['10', '25', '50', '100'],
                      // locale: { items_per_page: '' },
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    dataSource={vendorReport}
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

export default VendorReport
