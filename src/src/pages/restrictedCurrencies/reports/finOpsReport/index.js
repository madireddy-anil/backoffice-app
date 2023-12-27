import React, { Component } from 'react'
import {
  Card,
  Table,
  Spin,
  Skeleton,
  Icon,
  Menu,
  Button,
  Form,
  Row,
  Col,
  Dropdown,
  Select,
  Tooltip,
  Checkbox,
  Input,
  Drawer,
  DatePicker,
} from 'antd'

import _ from 'lodash'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import SubMenu from 'antd/lib/menu/SubMenu'
import {
  amountFormatter,
  formatToZoneDate,
  formatToZoneDateOnly,
  disabledFutureDate,
  restrictDateFor45Days,
} from 'utilities/transformer'
import {
  getFinOpsReports,
  handleFinOpsPagination,
  getDownloadData,
  handleFinOpsReportFilters,
} from 'redux/reports/FinOpsReport/actions'
import moment from 'moment'
import styles from './style.module.scss'
import jsondata from './data.json'
import DownloadComponenet from '../downloadComponents/businessAndFinOpsReportsDownload'

const mapStateToProps = ({ user, finOpsReports, settings, general }) => ({
  timeZone: settings.timeZone.value,
  token: user.token,
  finOpsReports: finOpsReports.reportData,
  loading: finOpsReports.loading,
  beneficiaries: general.beneficiaries,
  cryptoBeneficiaries: general.cryptoBeneficiaries,
  currencies: general.currencies,
  excelColumns: finOpsReports.excelColumnHeaders,
  excelData: finOpsReports.excelData,
  pagination: finOpsReports.pagination,
  clients: general.clients,
  appliedFilters: finOpsReports.appliedFinOpsReportFilters,
  downloadData: finOpsReports.reportDownloadData,
  downloadColumnHeaders: finOpsReports.reportDownloadColumnHeaders,
  isDownloadDisabled: finOpsReports.isDownloadDisabled,
})

const { RangePicker } = DatePicker
const { Option } = Select
const CheckboxGroup = Checkbox.Group

@Form.create()
@connect(mapStateToProps)
class FinOpsReport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleDownload: true,
      toggleDefaultFilter: false,
      checkedList: this.setDefaultCheckedList(),
      indeterminate: true,
      checkAll: false,
      visibleFilter: false,
      defaultHeaders: [
        'Trade Date',
        'Trade ID',
        'Customer Name',
        'Source Currency',
        'Beneficiary',
        'Destination Currency',
        'Converted Amount',
        'PC Revenue',
        'Comment',
      ],
      downloadDateRangeSelected: false,
    }

    const { appliedFilters, dispatch } = props

    props.pagination.current = 1
    dispatch(handleFinOpsReportFilters({ ...appliedFilters, downloadSelectedType: 'current' }))
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
    if (appliedFilters.DateAndTimeOfTrade) {
      filterDates = appliedFilters.DateAndTimeOfTrade
      filterDates[0] = moment(filterDates[0], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
      filterDates[1] = moment(filterDates[1], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
    }
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    form.setFieldsValue({ ...appliedFilters, filterDates, downloadSelectedType: 'current' })
    dispatch(getFinOpsReports(value))
    dispatch(handleFinOpsPagination(pagination))
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

  onReset = () => {
    const { form, token, dispatch } = this.props

    form.setFieldsValue({
      tradeReference: undefined,
      DateAndTimeOfTrade: undefined,
      clientName: undefined,
      fiatBeneficiaryId: undefined,
      cryptoBeneficiaryId: undefined,
      depositCurrency: undefined,
      totalDepositAmount: undefined,
      settlementCurrency: undefined,
      settlementAmount: undefined,
      downloadSelectedType: 'current',
      DateAndTimeForDownload: [],
    })
    const values = {
      page: 1,
      limit: 10,
      token,
    }
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }

    this.setState({ downloadDateRangeSelected: false })

    dispatch(handleFinOpsReportFilters({ downloadSelectedType: 'current' }))
    dispatch(getFinOpsReports(values))
    dispatch(handleFinOpsPagination(pagination))
  }

  onSubmitFilter = e => {
    e.preventDefault()
    const { form, dispatch, token, appliedFilters } = this.props

    form.validateFields((err, values) => {
      if (!err) {
        const value = {
          ...appliedFilters,
          page: 1,
          limit: 10,
          ...values,
          dateFrom: values.DateAndTimeOfTrade
            ? values.DateAndTimeOfTrade[0]
              ? values.DateAndTimeOfTrade[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : ''
            : '',
          dateTo: values.DateAndTimeOfTrade
            ? values.DateAndTimeOfTrade[1]
              ? values.DateAndTimeOfTrade[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : ''
            : '',
          downloadSelectedType: 'current',
          token,
        }

        form.setFieldsValue({
          downloadSelectedType: 'current',
          DateAndTimeForDownload: restrictDateFor45Days(values.DateAndTimeOfTrade)
            ? values.DateAndTimeOfTrade
            : undefined,
        })

        const pagination = {
          current: 1,
          total: 0,
          pageSize: 10,
        }
        dispatch(handleFinOpsPagination(pagination))
        dispatch(handleFinOpsReportFilters(value))
        dispatch(getFinOpsReports(value))
      }
    })
    this.setState({ downloadDateRangeSelected: false })
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
              <Form.Item label="Trade ID">
                {getFieldDecorator('tradeReference', {
                  initialValue: undefined,
                })(
                  <Input
                    placeholder="Filter by Trade ID"
                    onChange={this.onClientFilterChange}
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                  />,
                )}
              </Form.Item>
              <Form.Item label="Date and Time Of Trade">
                {getFieldDecorator('DateAndTimeOfTrade')(
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

  getFilterDrawer = () => {
    const { visibleFilter } = this.state
    const {
      form,
      currencies,
      clients,
      appliedFilters,
      beneficiaries,
      cryptoBeneficiaries,
      dispatch,
    } = this.props
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
    const beneficiaryOption = beneficiaries.map(option => (
      <Option key={option.id} label={option.bankAccountDetails.nameOnAccount} value={option.id}>
        <h5>{option.bankAccountDetails.nameOnAccount}</h5>
        <small>{option.bankAccountDetails.bankAccountCurrency}</small>
      </Option>
    ))
    const cryptoBeneficiaryOption = cryptoBeneficiaries.map(option => (
      <Option key={option.id} label={option.aliasName} value={option.id}>
        <h5>{option.aliasName}</h5>
        <small>{option.cryptoCurrency}</small>
      </Option>
    ))

    return (
      <Drawer
        title="Fin Ops Report"
        width={600}
        onClose={this.onClose}
        visible={visibleFilter}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={this.onSubmitFilter}>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Trade ID">
                {getFieldDecorator('tradeReference', {
                  initialValue: undefined,
                })(
                  <Input
                    placeholder="Filter by Trade ID"
                    onChange={this.onClientFilterChange}
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date and Time Of Trade">
                {getFieldDecorator('DateAndTimeOfTrade')(
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
              <Form.Item label="Fiat Beneficiary Name">
                {getFieldDecorator('fiatBeneficiaryId', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Search by Fiat Beneficiary Name"
                    onChange={() => {
                      dispatch(
                        handleFinOpsReportFilters({
                          ...appliedFilters,
                          disableCryptoBeneField: true,
                        }),
                      )
                    }}
                    disabled={appliedFilters.disableFiatBeneField || false}
                    optionFilterProp="label"
                    optionLabelProp="label"
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                    onSearch={this.onClientFilterSearch}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {beneficiaryOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Crypto Beneficiary Name">
                {getFieldDecorator('cryptoBeneficiaryId', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Search by Crypto Beneficiary Name"
                    onChange={() => {
                      dispatch(
                        handleFinOpsReportFilters({
                          ...appliedFilters,
                          disableFiatBeneField: true,
                        }),
                      )
                    }}
                    disabled={appliedFilters.disableCryptoBeneField || false}
                    optionFilterProp="label"
                    optionLabelProp="label"
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                    onSearch={this.onClientFilterSearch}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {cryptoBeneficiaryOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Customer Name">
                {getFieldDecorator('clientName', {
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
              <Form.Item label="Source Currency">
                {getFieldDecorator('depositCurrency', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    mode="multiple"
                    placeholder="Search by Source Currency"
                    optionFilterProp="children"
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
              <Form.Item label="Received Amount">
                {getFieldDecorator('totalDepositAmount', {
                  initialValue: undefined,
                })(<Input placeholder="Filter by Received Amount" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Settlement Currency">
                {getFieldDecorator('settlementCurrency', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    mode="multiple"
                    placeholder="Search by Settlement Currency"
                    optionFilterProp="children"
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

  handleTableColumns = () => {
    const { timeZone } = this.props
    const nullSymbol = '---'
    const { checkedList } = this.state
    const columns = [
      {
        title: 'Trade Date',
        dataIndex: 'tradeDate',
        key: 'tradeDate',
        // align: 'center',
        width: 150,
        render: sd => (
          <Tooltip title={sd ? formatToZoneDate(sd, timeZone) : nullSymbol}>
            <span>{sd ? formatToZoneDateOnly(sd, timeZone) : nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Trade ID',
        dataIndex: 'tradeReference',
        key: 'tradeId',
        // align: 'center',
        width: 150,
        render: data => data || nullSymbol,
      },
      {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
        // align: 'center',
        width: 150,
        render: data => data || nullSymbol,
      },
      {
        title: 'Source Currency',
        dataIndex: 'sourceCurrency',
        key: 'sourceCurrency',
        // align: 'center',
        width: 150,
        render: data => data || nullSymbol,
      },
      {
        title: 'Beneficiary',
        dataIndex: 'beneficiary',
        key: 'beneficiary',
        // align: 'center',
        width: 150,
        render: data => data || nullSymbol,
      },
      {
        title: 'Destination Currency',
        dataIndex: 'destinationCurrency',
        key: 'destinationCurrency',
        // align: 'center',
        width: 150,
        render: data => data || nullSymbol,
      },
      {
        title: 'converted Amount',
        dataIndex: 'convertedAmount',
        key: 'convertedAmount',
        // align: 'center',
        width: 150,
        render: data => (data ? amountFormatter(data) : nullSymbol),
      },
      {
        title: 'PC Revenue',
        dataIndex: 'pcRevenue',
        key: 'pcRevenue',
        // align: 'center',
        width: 150,
        render: data => (data ? amountFormatter(data) : nullSymbol),
      },
      {
        title: 'Comment',
        dataIndex: 'tradeComment',
        key: 'tradeComment',
        // align: 'center',
        width: 150,
        render: data => (data.length !== 0 ? data[0] : nullSymbol),
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

  onChangeDownload = (type, dateFrom, dateTo) => {
    const {
      token,
      dispatch,
      pagination: { current, pageSize },
      appliedFilters,
    } = this.props
    const values = {}

    if (type === 'all') {
      values.limit = 0
      values.token = token
      dispatch(getDownloadData({ ...appliedFilters, page: undefined, dateFrom, dateTo, ...values }))
      this.setState({ downloadDateRangeSelected: true })
    } else {
      values.page = current
      values.limit = pageSize
      values.token = token
      dispatch(getDownloadData({ ...appliedFilters, ...values }))
      this.setState({ downloadDateRangeSelected: false })
    }
    dispatch(handleFinOpsReportFilters({ ...appliedFilters, downloadSelectedType: type }))
  }

  handleTableChange = pagination => {
    const { dispatch, token, form, appliedFilters } = this.props
    const { downloadDateRangeSelected } = this.state
    if (!downloadDateRangeSelected) {
      const values = {}
      form.setFieldsValue({
        downloadSelectedType: 'current',
      })
      values.page = pagination.current
      values.limit = pagination.pageSize
      values.token = token
      dispatch(getFinOpsReports({ ...appliedFilters, ...values }))
      dispatch(handleFinOpsReportFilters({ ...appliedFilters, downloadSelectedType: 'current' }))
    }

    dispatch(handleFinOpsPagination(pagination))
  }

  render() {
    const selectedColumns = this.handleTableColumns()

    const {
      finOpsReports,
      pagination,
      loading,
      appliedFilters,
      isDownloadDisabled,
      downloadData,
      downloadColumnHeaders,
      form,
    } = this.props

    const {
      indeterminate,
      checkAll,
      checkedList,
      toggleDefaultFilter,
      visibleDownload,
      defaultHeaders,
    } = this.state
    const { allColumns } = jsondata
    const expandedRowRender = record => {
      const nullSymbol = '---'

      const columns = [
        {
          title: 'Sequence',
          dataIndex: 'sequence',
          key: 'sequence',
        },
        {
          title: 'Route Name',
          dataIndex: 'routeName',
          key: 'routeName',
          render: data => (data ? _.upperCase(data) : nullSymbol),
        },
        {
          title: 'Vendor Name',
          dataIndex: 'vendorName',
          key: 'vendorName',
        },
        {
          title: 'Source Currency',
          dataIndex: 'sourceCurrency',
          key: 'sourceCurrency',
        },
        {
          title: 'Received Amount',
          dataIndex: 'receivedAmount',
          key: 'receivedAmount',
          render: data => (data ? amountFormatter(data) : nullSymbol),
        },
        {
          title: 'Beneficiary',
          dataIndex: 'beneficiary',
          key: 'beneficiary',
        },
        {
          title: 'Remittance Currency',
          dataIndex: 'remittanceCurrency',
          key: 'remittanceCurrency',
        },
        {
          title: 'Final Funds Remitted',
          dataIndex: 'finalFundsRemitted',
          key: 'finalFundsRemitted',
          render: data => (data ? amountFormatter(data) : nullSymbol),
        },
        {
          title: 'Comment',
          dataIndex: 'transactionComments',
          key: 'transactionComments',
          render: data => (data.length !== 0 ? data[0] : nullSymbol),
        },
      ]

      return (
        <Table
          columns={columns}
          dataSource={record.transactions}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      )
    }

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
              <span> Customised Columns </span>
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
            <span className="font-size-16">Fin Ops Report</span>
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
            <Dropdown overlay={settingsMenu} trigger={['click']}>
              <Icon type="setting" />
            </Dropdown>
          </div>
        }
      >
        {this.defaultFilters()}
        {this.getFilterDrawer()}
        <DownloadComponenet
          titleForDownload="Fin Ops"
          toggleDownload={visibleDownload}
          isDownloadDisabled={isDownloadDisabled}
          downloadData={downloadData}
          onChangeDownload={this.onChangeDownload}
          currentValue={appliedFilters.downloadSelectedType}
          jsonData={jsondata}
          checkedListOfCustomizeColumn={checkedList}
          defaultDownloadColumnHeaders={defaultHeaders}
          additionColumnHeaders={downloadColumnHeaders}
          form={form}
        />
        <Helmet title="Fin Ops Report" />
        <div className={styles.block}>
          <div className="row">
            <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
              <Skeleton loading={loading} active>
                <Spin tip="Loading..." spinning={loading}>
                  <Table
                    columns={selectedColumns}
                    scroll={{ x: 'max-content' }}
                    dataSource={finOpsReports}
                    pagination={{
                      ...pagination,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ['10', '25', '50', '100'],
                      // locale: { items_per_page: '' },
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    onChange={this.handleTableChange}
                    expandedRowRender={record => expandedRowRender(record)}
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

export default FinOpsReport
