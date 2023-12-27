import React, { Component } from 'react'
import {
  Card,
  Table,
  Spin,
  Icon,
  Tooltip,
  Input,
  DatePicker,
  Button,
  Select,
  Drawer,
  Col,
  Row,
  Form,
  Modal,
  Divider,
} from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import moment from 'moment'

import { updateCurrentChannelDetails, getTradeById } from 'redux/trade/actions'
// import { getTrades } from 'redux/trades/actions'
import {
  formatToZoneDateOnly,
  formatToZoneDate,
  amountFormatter,
  disabledFutureDate,
} from '../../../utilities/transformer'
// import Excel from '../../../components/CleanUIComponents/Excel'

import {
  selectedRoutes,
  changeEditMode,
  updateRoutes,
  deleteRoutes,
  getAllRoutes,
  bulkDeleteRoutes,
  handlePagination,
} from '../../../redux/routingEngine/actions'
import styles from './style.module.scss'

const { RangePicker } = DatePicker
const { Option } = Select

const mapStateToProps = ({ general, user, settings, routingEngine, trades }) => ({
  clients: general.clients,
  vendors: general.newVendors,
  timeZone: settings.timeZone.value,
  token: user.token,
  allRoutes: routingEngine.allRoutes,
  totalRoutes: routingEngine.totalRoutes,
  loading: routingEngine.loading,
  currencies: general.currencies,
  selectedListRoutes: routingEngine.selectedListRoutes,
  isEditRoutesMode: routingEngine.isEditRoutesMode,
  trades: trades.totalTransfer,
  pagination: routingEngine.pagination,
})

@Form.create()
@connect(mapStateToProps)
class RoutingEngine extends Component {
  state = {
    visibleSearch: true,
    visibleFilter: false,
    visibleModal: false,
    rowItem: {},
    search: {
      clientName: '',
      dateFrom: '',
      dateTo: '',
      status: '',
    },
    filters: {},
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    dispatch(handlePagination(pagination))
    dispatch(getAllRoutes('', token))
  }

  navigateToNewRoute = () => {
    const { history } = this.props
    history.push('/new-route')
  }

  navigateToRoute = () => {
    const { history } = this.props
    history.push('/route-details')
  }

  // search
  onClientFilterChange = value => {
    this.setState(prevState => ({
      search: {
        ...prevState.search,
        clientName: value,
      },
    }))
  }

  onClientFilterBlur = () => {
    console.log('blur')
  }

  onClientFilterFocus = () => {
    console.log('focus')
  }

  onClientFilterSearch = val => {
    console.log('search:', val)
  }

  onSearchTradeDateChange = dates => {
    Promise.resolve(
      this.setState(prevState => ({
        search: {
          ...prevState.search,
          dateFrom: dates[0] ? dates[0].toISOString() : '',
          dateTo: dates[1] ? dates[1].toISOString() : '',
        },
      })),
    ).then(() => {
      this.searchRoutes()
    })
  }

  onSearchStatusChange = value => {
    this.setState(prevState => ({
      search: {
        ...prevState.search,
        status: value,
      },
    }))
  }

  searchRoutes = () => {
    const {
      search: { client, status },
    } = this.state
    const { token, dispatch } = this.props
    const value = {
      client,
      status,
      token,
    }
    dispatch(getAllRoutes(value))
  }

  getSearchUI = () => {
    const { visibleSearch } = this.state
    const { clients } = this.props
    const clientOption = clients.map(option => (
      <Option key={option.id} value={option.genericInformation.tradingName}>
        {option.genericInformation.tradingName}
      </Option>
    ))
    return (
      <div hidden={visibleSearch} className="mb-2 p-2">
        <Select
          showSearch
          className="mt-3"
          style={{ width: 200 }}
          placeholder="Search by Client Name"
          optionFilterProp="children"
          onChange={this.onClientFilterChange}
          onFocus={this.onClientFilterFocus}
          onBlur={this.onClientFilterBlur}
          onSearch={this.onClientFilterSearch}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {clientOption}
        </Select>
        <RangePicker
          disabledDate={disabledFutureDate}
          className="mr-3 ml-3 mt-3"
          ranges={{
            Today: [moment(), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          showTime={{
            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
          }}
          format="YYYY/MM/DD HH:mm:ss"
          onChange={this.onSearchTradeDateChange}
        />
        <Select
          showSearch
          className="mt-3"
          style={{ width: 200 }}
          placeholder="Please choose the status"
          onChange={this.onSearchStatusChange}
        >
          <Option value="completed">COMPLETED</Option>
          <Option value="funds_remitted">FUNDS REMITTED</Option>
          <Option value="quote_confirmed">QUOTE CONFIRMED</Option>
          <Option value="account_requested">ACCOUNT REQUESTED</Option>
          <Option value="account_received">ACCOUNT RECEIVED</Option>
          <Option value="new">NEW</Option>
        </Select>
      </div>
    )
  }

  // Filter
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
    this.setState({ filters: {} })
    const { form, token, dispatch } = this.props
    form.setFieldsValue({
      clientId: undefined,
      depositCurrency: undefined,
      status: undefined,
      settlementCurrency: undefined,
      routeReference: undefined,
      sequence: undefined,
      allSequenceComplete: undefined,
      totalDepositAmount: undefined,
    })
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    const value = {
      page: pagination.current,
      limit: pagination.pageSize,
    }
    dispatch(handlePagination(pagination))
    dispatch(getAllRoutes(value, token))
    this.onClose()
  }

  onSubmitFilter = e => {
    const { form, dispatch, token } = this.props
    e.preventDefault()
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    dispatch(handlePagination(pagination))
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ filters: values })
        dispatch(getAllRoutes(values, token))
      }
    })
    this.onClose()
  }

  getFilterDrawer = () => {
    const { visibleFilter } = this.state
    const { form, clients, currencies } = this.props
    const { getFieldDecorator } = form
    const clientOption = clients.map(option => (
      <Option key={option.id} label={option.genericInformation.registeredCompanyName}>
        <h6>{option.genericInformation.tradingName}</h6>
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
        title="Trade Routes History"
        width={600}
        onClose={this.onClose}
        visible={visibleFilter}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={this.onSubmitFilter}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Client Name">
                {getFieldDecorator(
                  'clientId',
                  {},
                )(
                  <Select
                    showSearch
                    placeholder="Search by Client Name"
                    optionFilterProp="children"
                    optionLabelProp="label"
                    onChange={this.onClientFilterChange}
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                    onSearch={this.onClientFilterSearch}
                    filterOption={(input, option) =>
                      option.props.children[0].props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {clientOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Route Id">
                {getFieldDecorator(
                  'routeReference',
                  {},
                )(<Input placeholder="Please input a route reference" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Source Currency">
                {getFieldDecorator(
                  'depositCurrency',
                  {},
                )(
                  <Select showSearch placeholder="Please select a Source Currency">
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Sequence">
                {getFieldDecorator('sequence', {})(<Input placeholder="Please input a sequence" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Status">
                {getFieldDecorator(
                  'status',
                  {},
                )(
                  <Select
                    showSearch
                    placeholder="Please choose the status"
                    onChange={this.onSearchStatusChange}
                  >
                    <Option value="completed">COMPLETED</Option>
                    <Option value="funds_remitted">FUNDS REMITTED</Option>
                    <Option value="quote_confirmed">QUOTE CONFIRMED</Option>
                    <Option value="account_requested">ACCOUNT REQUESTED</Option>
                    <Option value="account_received">ACCOUNT RECEIVED</Option>
                    <Option value="new">NEW</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Local Currency Amount">
                {getFieldDecorator(
                  'totalDepositAmount',
                  {},
                )(<Input placeholder="Please input a Local Currency Amount" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Settlement Currency">
                {getFieldDecorator(
                  'settlementCurrency',
                  {},
                )(
                  <Select showSearch placeholder="Please select a Settlement Currency">
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="All Sequence Complete">
                {getFieldDecorator(
                  'allSequenceComplete',
                  {},
                )(
                  <Select showSearch placeholder="Please select a sequence complete status">
                    <Option value="true">Yes</Option>
                    <Option value="false">No</Option>
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

  // Modal Popup works
  showViewModal = record => {
    const { dispatch } = this.props
    dispatch(changeEditMode(false))
    dispatch(selectedRoutes(record))
    this.setState({
      visibleModal: true,
    })
  }

  navigateToTrade = trade => {
    const { dispatch, token } = this.props
    const {
      id,
      chat: { channelId },
      tradeStatus,
    } = trade
    const channelData = {
      channelId,
      tradeStatus,
    }
    dispatch(updateCurrentChannelDetails(channelData))
    dispatch(getTradeById(id, token))
  }

  showEditModal = record => {
    const { dispatch } = this.props
    dispatch(changeEditMode(true))
    dispatch(selectedRoutes(record))
    this.setState({
      visibleModal: true,
    })
  }

  handleModalOk = () => {
    this.setState({
      visibleModal: false,
    })
  }

  handleModalCancel = () => {
    this.setState({
      visibleModal: false,
    })
  }

  onEditSubmit = e => {
    const { form, dispatch, selectedListRoutes, token } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        dispatch(updateRoutes(values, selectedListRoutes.id, token))
      }
    })
    this.handleModalOk()
  }

  getEditModal = () => {
    const { form, clients, selectedListRoutes, currencies, vendors } = this.props
    const { getFieldDecorator } = form
    const clientObj = clients.find(el => el.id === selectedListRoutes.clientId) // A
    const tradeObj =
      Object.entries(selectedListRoutes).length > 0 && selectedListRoutes.routeReference // A
    const statusObj =
      Object.entries(selectedListRoutes).length > 0 && selectedListRoutes.routeStatus // A
    const clientsOption = clients.map(option => (
      <Option key={option.id} label={option.genericInformation.registeredCompanyName}>
        <h5>{option.genericInformation.tradingName}</h5>
        <small>{option.genericInformation.registeredCompanyName}</small>
      </Option>
    ))
    const vendorsOption = vendors.map(option => (
      <Option key={option.id} label={option.genericInformation?.tradingName}>
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
      <Form onSubmit={this.onEditSubmit}>
        <h5 className="mb-3">Trade Routes Overview</h5>
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item className={styles.formItem} label="Route Reference">
                {getFieldDecorator(
                  'routeReference',
                  {},
                )(
                  <p>
                    <strong>{tradeObj && tradeObj}</strong>
                  </p>,
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className={styles.formItem} label="Route Status">
                {getFieldDecorator(
                  'routeStatus',
                  {},
                )(
                  <p>
                    <strong>{statusObj && statusObj}</strong>
                  </p>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row className={styles.cstmRow} gutter={16}>
            <Col span={8}>
              <Form.Item className={styles.formItem} label="Client Name">
                {getFieldDecorator('clientName', {
                  initialValue: clientObj !== undefined && clientObj.genericInformation.tradingName, // A
                })(<Select className={styles.cstmInput}>{clientsOption}</Select>)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className={styles.formItem} label="Vendor Name">
                {getFieldDecorator('vendorName', {
                  initialValue: selectedListRoutes.vendorName,
                })(<Select className={styles.cstmInput}>{vendorsOption}</Select>)}
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Divider />
        <h5 className="mb-3">Trade Routes Details</h5>
        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item className={styles.formItem} label="Deposit Currency">
                {getFieldDecorator('depositCurrency', {
                  initialValue: selectedListRoutes.depositCurrency,
                })(<Select className={styles.cstmInput}>{currencyOption}</Select>)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className={styles.formItem} label="Total Deposit Amount">
                {getFieldDecorator('totalDepositAmount', {
                  initialValue: selectedListRoutes.totalDepositAmount,
                })(<Input className={styles.cstmInput} />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className={styles.formItem} label="Settlement Currency">
                {getFieldDecorator('settlementCurrency', {
                  initialValue: selectedListRoutes.settlementCurrency,
                })(<Select className={styles.cstmInput}>{currencyOption}</Select>)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    )
  }

  onSelectRowItem = id => {
    this.setState({ rowItem: id })
  }

  onDeleteRoutes = () => {
    const { dispatch, token } = this.props
    const { rowItem } = this.state
    dispatch(deleteRoutes(rowItem[0], token))
    this.setState({ rowItem: [] })
  }

  onBulkDeleteRoutes = () => {
    const { dispatch, token } = this.props
    const { rowItem } = this.state
    dispatch(bulkDeleteRoutes(rowItem, token))
  }

  handleTableChange = pagination => {
    const { dispatch, token } = this.props
    const { filters } = this.state
    dispatch(handlePagination(pagination))
    filters.page = pagination.current
    filters.limit = pagination.pageSize
    dispatch(getAllRoutes(filters, token))
  }

  getEditOrViewDescription = () => {
    const { clients, isEditRoutesMode, selectedListRoutes } = this.props
    const clientObj = clients.find(el => el.id === selectedListRoutes.clientId)
    const tradeObj =
      Object.entries(selectedListRoutes).length > 0 && selectedListRoutes.routeReference
    const nullSymbol = '---'
    return isEditRoutesMode ? (
      this.getEditModal()
    ) : (
      <div>
        <h5 className="mb-3">Routes Overview</h5>
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <span>Client Name:</span>
              <p>
                <strong>{clientObj ? clientObj.genericInformation.tradingName : ''}</strong>
              </p>
            </Col>
            <Col span={12}>
              <span>Vendor Name</span>
              <p>
                <strong>{selectedListRoutes.vendorName}</strong>
              </p>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <span>Route Reference:</span>
              <p>
                <strong>{tradeObj && tradeObj}</strong>
              </p>
            </Col>
            <Col span={12}>
              <span>Beneficiary</span>
              <p>
                <strong>Vendor</strong>
              </p>
            </Col>
          </Row>
        </div>
        <Divider />
        <h5 className="mb-3">Routes Details</h5>
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <span>Deposit Currency</span>
              <p>
                <strong>{selectedListRoutes.depositCurrency || nullSymbol}</strong>
              </p>
            </Col>
            <Col span={12}>
              <span>Total Deposit Amount</span>
              <p>
                <strong>{selectedListRoutes.totalDepositAmount || nullSymbol}</strong>
              </p>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <span>Settlement Currency</span>
              <p>
                <strong>{selectedListRoutes.settlementCurrency || nullSymbol}</strong>
              </p>
            </Col>
            <Col span={12}>
              <span>Settlement Amount</span>
              <p>
                <strong>{selectedListRoutes.settlementAmount || nullSymbol}</strong>
              </p>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

  render() {
    const nullSymbol = '---'
    const {
      clients,
      allRoutes,
      loading,
      timeZone,
      selectedListRoutes,
      isEditRoutesMode,
      pagination,
    } = this.props
    const { visibleModal, rowItem } = this.state
    const columns = [
      {
        title: 'Client',
        dataIndex: 'clientId',
        key: 'client',
        align: 'center',
        render: clientId => {
          const obj = clients.find(el => el.id === clientId)
          return obj ? obj.tradingName : ''
        },
      },
      {
        title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: createdAt => (
          <Tooltip title={createdAt ? formatToZoneDate(createdAt, timeZone) : nullSymbol}>
            <span>{createdAt ? formatToZoneDateOnly(createdAt, timeZone) : nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Route ID',
        dataIndex: 'routeReference',
        key: 'routeReference',
        align: 'center',
        render: routeReference => routeReference || nullSymbol,
      },
      {
        title: 'Sequence',
        dataIndex: 'sequence',
        key: 'sequence',
        align: 'center',
        render: sequence => sequence || nullSymbol,
      },
      {
        title: 'Deposit Currency',
        dataIndex: 'depositCurrency',
        key: 'depositCurrency',
        align: 'center',
        render: depositCurrency => depositCurrency || nullSymbol,
      },
      {
        title: 'Local Currency Amount',
        dataIndex: 'totalDepositAmount',
        key: 'totalDepositAmount',
        align: 'center',
        render: totalDepositAmount => amountFormatter(totalDepositAmount) || nullSymbol,
      },
      {
        title: 'Settlement Currency',
        dataIndex: 'settlementCurrency',
        key: 'settlementCurrency',
        align: 'center',
        render: settlementCurrency => settlementCurrency || nullSymbol,
      },
      {
        title: 'Converted Amount',
        dataIndex: 'settlementAmount',
        key: 'settlementAmount',
        align: 'center',
        render: settlementAmount => amountFormatter(settlementAmount || '') || nullSymbol,
      },
      {
        title: 'All Sequence Complete',
        dataIndex: 'allSequenceComplete',
        key: 'allSequenceComplete',
        align: 'center',
        render: allSequenceComplete => (allSequenceComplete === true ? 'Yes' : 'No'),
      },
      {
        title: 'Status',
        dataIndex: 'routeStatus',
        key: 'routeStatus',
        align: 'center',
        render: status => (status ? status.toUpperCase() : nullSymbol),
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        fixed: 'right',
        render: record => (
          <>
            <Tooltip title="Edit">
              <Button onClick={() => this.showEditModal(record)} type="link">
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button onClick={() => this.showViewModal(record)} type="link">
                <Icon type="eye" />
              </Button>
            </Tooltip>
          </>
        ),
      },
    ]
    const data = []
    const rowSelection = {
      onChange: selectedRowKeys => {
        if (selectedRowKeys) this.onSelectRowItem(selectedRowKeys)
        selectedRowKeys = []
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows)
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows)
      },
    }
    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Trade Routes History</span>
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
            <Tooltip title="Filter">
              <Icon type="filter" className="mr-3" onClick={this.showDrawer} />
            </Tooltip>
            <Button
              hidden={Object.entries(rowItem).length === 0 || Object.entries(rowItem).length > 1}
              type="primary"
              className="ml-3"
              onClick={this.onDeleteRoutes}
            >
              Delete
              <Icon type="close" />
            </Button>
            <Button
              hidden={Object.entries(rowItem).length === 0 || Object.entries(rowItem).length < 2}
              type="primary"
              className="ml-3"
              onClick={this.onBulkDeleteRoutes}
            >
              Bulk Delete
              <Icon type="close" />
            </Button>
            {/* <Button type="primary" className="ml-3" onClick={this.navigateToNewRoute}>
              New Route
              <Icon type="plus" />
            </Button> */}
          </div>
        }
      >
        <Helmet title="Trades" />
        <div className={styles.block}>
          {allRoutes.forEach(route => {
            const routeData = []
            routeData.push({
              value: route.createdAt ? formatToZoneDateOnly(route.createdAt, timeZone) : nullSymbol,
            })
            routeData.push({
              value: route.tradeReference || nullSymbol,
              style: { alignment: { horizontal: 'center' } },
            })
            routeData.push({
              value: route.depositCurrency || nullSymbol,
              style: { alignment: { horizontal: 'center' } },
            })
            routeData.push({
              value: route.totalDepositAmount || nullSymbol,
              style: { numFmt: '0,0.00' },
            })
            routeData.push({
              value: route.settlementCurrency || nullSymbol,
              style: { alignment: { horizontal: 'center' } },
            })
            routeData.push({
              value: route.settlementAmount || nullSymbol,
              style: { numFmt: '0,0.00' },
            })
            routeData.push({
              value: route.tradeStatus || nullSymbol,
              style: { alignment: { horizontal: 'center' } },
            })
            data.push(routeData)
          })}
          {this.getSearchUI()}
          {this.getFilterDrawer()}
          <div className="row">
            <div className="col-xl-12">
              <Spin tip="Loading..." spinning={loading}>
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  rowSelection={rowSelection}
                  pagination={pagination}
                  dataSource={allRoutes}
                  scroll={{ x: 'max-content' }}
                  onChange={this.handleTableChange}
                />
              </Spin>
              <Modal
                title={selectedListRoutes.transactionReference}
                visible={visibleModal}
                onCancel={this.handleModalCancel}
                style={{ top: '30px' }}
                width={isEditRoutesMode ? '60%' : '50%'}
                footer={
                  isEditRoutesMode ? (
                    [
                      <Button key="back" onClick={this.handleModalCancel}>
                        Cancel
                      </Button>,
                      <Button
                        key="submit"
                        htmlType="submit"
                        type="primary"
                        loading={loading}
                        onClick={this.onEditSubmit}
                      >
                        Submit
                      </Button>,
                    ]
                  ) : (
                    <Button key="button" onClick={this.handleModalCancel} disabled>
                      <Icon type="download" /> Download PDF
                    </Button>
                  )
                }
              >
                {this.getEditOrViewDescription()}
              </Modal>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

export default RoutingEngine
