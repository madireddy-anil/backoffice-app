import React, { Component } from 'react'
import {
  Card,
  Table,
  Icon,
  Col,
  Form,
  Menu,
  Dropdown,
  Tooltip,
  Checkbox,
  Button,
  Spin,
  Skeleton,
} from 'antd'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import { connect } from 'react-redux'
import SubMenu from 'antd/lib/menu/SubMenu'
import _ from 'lodash'
import {
  getVoluemAndProfit,
  handlePagination,
  getVolumeAndProfitDownload,
  handleVolumeAndProfitReportFilters,
} from '../../../../redux/reports/volumeAndProfit/actions'
import {
  formatToZoneDateOnly,
  formatToZoneDate,
  amountFormatter,
} from '../../../../utilities/transformer'
import jsondata from './data.json'
import DefaultFilter from './Filters/defaultFilter'
import styles from './style.module.scss'
import DownloadComponenet from '../../downloadComponents/businessAndFinOpsReportsDownload'

const CheckboxGroup = Checkbox.Group

const mapStateToProps = ({ general, user, settings, volumeAndProfit }) => ({
  clients: general.clients,
  currencies: general.currencies,
  token: user.token,
  volumeAndProfit: volumeAndProfit.totalVolumeAndProfit,
  loading: volumeAndProfit.loading,
  pagination: volumeAndProfit.pagination,
  timeZone: settings.timeZone.value,
  isDownloadDisabled: volumeAndProfit.isDownloadDisabled,
  appliedFilters: volumeAndProfit.appliedVolumeAndProfitReportFilters,
  downloadData: volumeAndProfit.reportDownloadData,
  downloadColumnHeaders: volumeAndProfit.reportDownloadColumnHeaders,
})

@Form.create()
@connect(mapStateToProps)
class VolumeAndProfit extends Component {
  constructor(props) {
    super(props)

    const defaultHeaders = [
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

    this.state = {
      visibleFilter: true,
      checkedList: this.setDefaultCheckedList(),
      indeterminate: true,
      checkAll: false,
      filters: {},
      visibleDownload: true,
      defaultHeaders,
      downloadDateRangeSelected: false,
    }

    const { dispatch, appliedFilters } = props

    dispatch(
      handleVolumeAndProfitReportFilters({ ...appliedFilters, downloadSelectedType: 'current' }),
    )
  }

  componentDidMount() {
    const { token, dispatch, appliedFilters, form } = this.props
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    const value = {
      ...appliedFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    }
    let filterDates
    if (appliedFilters.DateAndTime) {
      filterDates = appliedFilters.DateAndTime
      filterDates[0] = moment(filterDates[0], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
      filterDates[1] = moment(filterDates[1], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
    }
    form.setFieldsValue({ ...appliedFilters, filterDates, downloadSelectedType: 'current' })
    dispatch(handlePagination(pagination))
    dispatch(getVoluemAndProfit(value, token))
    this.mounted = true
  }

  setDefaultCheckedList = () => {
    const { initialColumns } = jsondata
    return initialColumns.map(column => {
      return column.value
    })
  }

  handleTableChange = pagination => {
    const { dispatch, token, appliedFilters, form } = this.props
    const { filters, downloadDateRangeSelected } = this.state
    if (!downloadDateRangeSelected) {
      form.setFieldsValue({ downloadSelectedType: 'current' })
      filters.page = pagination.current
      filters.limit = pagination.pageSize
      const value = {
        ...appliedFilters,
        downloadSelectedType: 'current',
        page: pagination.current,
        limit: pagination.pageSize,
      }
      dispatch(handleVolumeAndProfitReportFilters(value))
      dispatch(getVoluemAndProfit(filters, token))
    }

    dispatch(handlePagination(pagination))
  }

  onChange = checkedList => {
    const { allColumns } = jsondata

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
      visibleFilter: true,
      checkedList: this.setDefaultCheckedList(),
      indeterminate: true,
      checkAll: false,
    })
  }

  appliedFilters = filter => {
    this.setState({ filters: filter })
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
      dispatch(
        getVolumeAndProfitDownload(
          {
            ...appliedFilters,
            page: undefined,
            dateFromOfInitiate,
            dateToOfInitiate,
            dateFromOfDeposit,
            dateToOfDeposit,
            limit: 0,
          },
          token,
        ),
      )
      this.setState({ downloadDateRangeSelected: true })
    } else {
      filters.page = current
      filters.limit = pageSize
      dispatch(getVolumeAndProfitDownload({ ...filters, ...appliedFilters }, token))
      this.setState({ downloadDateRangeSelected: false })
    }
    dispatch(
      handleVolumeAndProfitReportFilters({
        ...appliedFilters,
        downloadSelectedType: type,
      }),
    )
  }

  handleTableColumns = () => {
    const nullSymbol = '---'
    const { timeZone } = this.props
    const { checkedList } = this.state

    const columns = [
      {
        title: 'Trade number',
        dataIndex: 'tradeNumber',
        key: 'tradeNumber',
        align: 'center',
      },
      {
        title: 'Date of Initiate',
        dataIndex: 'tradeRequestedDate',
        key: 'tradeRequestedDate',
        align: 'center',
        render: data => (
          <Tooltip title={data ? formatToZoneDate(data, timeZone) : nullSymbol}>
            <span>{data ? formatToZoneDateOnly(data, timeZone) : nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Date of Deposit',
        dataIndex: 'dateOfDeposit',
        key: 'dateOfDeposit',
        align: 'center',
        render: sd => (
          <Tooltip title={sd ? formatToZoneDate(sd, timeZone) : nullSymbol}>
            <span>{sd ? formatToZoneDateOnly(sd, timeZone) : nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Customer Name',
        dataIndex: 'customerName',
        key: 'customerName',
        align: 'center',
      },
      {
        title: 'Deposit currency',
        dataIndex: 'depositCurrency',
        key: 'depositCurrency',
        align: 'center',
      },
      {
        title: 'Deposit amount',
        dataIndex: 'depositAmount',
        key: 'depositAmount',
        align: 'center',
        render: depositAmount => amountFormatter(depositAmount),
      },
      {
        title: 'Deposit Amount In USD',
        dataIndex: 'depositAmountinUSD',
        key: 'depositAmountinUSD',
        align: 'center',
        render: depositAmountinUSD => amountFormatter(depositAmountinUSD),
      },
      {
        title: 'Settlement currency',
        dataIndex: 'settlementCurrency',
        key: 'settlementCurrency',
        align: 'center',
      },
      {
        title: 'Settlement Amount',
        dataIndex: 'settlementAmount',
        key: 'settlementAmount',
        align: 'center',
        render: settlementAmount => amountFormatter(settlementAmount),
      },
      {
        title: 'PC Spread',
        dataIndex: 'pcSpread',
        key: 'pcSpread',
        align: 'center',
        render: pcSpread => `${pcSpread}${' '}${'%'}`,
      },
      {
        title: 'Trade Status',
        dataIndex: 'tradeStatus',
        key: 'tradeStatus',
        align: 'center',
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

  onFilterChange = () => {
    this.setState({ downloadDateRangeSelected: false })
  }

  render() {
    const {
      volumeAndProfit,
      pagination,
      form,
      loading,
      appliedFilters,
      isDownloadDisabled,
      downloadData,
      downloadColumnHeaders,
    } = this.props
    const { allColumns } = jsondata
    const expandedRowRender = record => {
      const columns = [
        {
          title: 'Fee Id',
          dataIndex: 'feeId',
          key: 'feeId',
          align: 'center',
          width: '20%',
        },
        {
          title: 'Fee Type',
          dataIndex: 'feeType',
          key: 'feeType',
          align: 'center',
          width: '20%',
        },
        {
          title: 'Route Type',
          dataIndex: 'routeType',
          key: 'routeType',
          align: 'center',
          width: '20%',
        },
        {
          title: 'Fee Currency',
          dataIndex: 'feeCurrency',
          key: 'feeCurrency',
          align: 'center',
          width: '20%',
        },
        {
          title: 'Fee Amount',
          dataIndex: 'feeAmount',
          key: 'feeAmount',
          align: 'center',
          width: '20%',
        },
      ]
      return <Table columns={columns} dataSource={record.fees} pagination={false} />
    }

    const selectedColumns = this.handleTableColumns()

    const {
      indeterminate,
      checkAll,
      checkedList,
      visibleFilter,
      visibleDownload,
      defaultHeaders,
    } = this.state
    const settingsMenu = (
      <Menu style={{ width: '250px' }}>
        <Menu.Item
          onClick={() =>
            this.setState(prevState => ({
              visibleFilter: !prevState.visibleFilter,
            }))
          }
        >
          <Icon
            type="filter"
            onClick={() =>
              this.setState(prevState => ({
                visibleFilter: !prevState.visibleFilter,
              }))
            }
          />
          Filter
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
            <span className="font-size-16">Volume and Profit Report</span>
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
        <DefaultFilter
          form={form}
          toggleFilter={visibleFilter}
          applyFilters={this.appliedFilters}
          onFilterChange={this.onFilterChange}
        />
        <DownloadComponenet
          titleForDownload="Volume And Profit"
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
        <Helmet title="Customer" />
        <div className="row">
          <div className={loading ? 'p-4 col-xl-12' : 'col-xl-12'}>
            <Skeleton loading={loading} active>
              <Spin tip="Loading..." spinning={loading}>
                <Table
                  columns={selectedColumns}
                  scroll={{ x: 'max-content' }}
                  dataSource={volumeAndProfit}
                  pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: ['10', '25', '50', '100'],
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                  }}
                  onChange={this.handleTableChange}
                  expandedRowRender={record => expandedRowRender(record)}
                />
              </Spin>
            </Skeleton>
          </div>
        </div>
      </Card>
    )
  }
}
export default VolumeAndProfit
