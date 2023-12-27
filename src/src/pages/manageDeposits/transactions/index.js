import React, { Component } from 'react'
import {
  Card,
  Table,
  Spin,
  Icon,
  Tooltip,
  Button,
  Select,
  Drawer,
  Col,
  Row,
  Form,
  Input,
} from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
// import moment from 'moment'

// import { updateCurrentTradeId, updateCurrentChannelDetails } from 'redux/trade/actions'
import {
  formatToZoneDateOnly,
  formatToZoneDate,
  amountFormatter,
} from '../../../utilities/transformer'
import variables from '../../../utilities/variables'
// import Excel from '../../../components/CleanUIComponents/Excel'

import {
  getAllTransactions,
  editTransaction,
  deleteTransaction,
  bulkDeleteTransaction,
  handlePagination,
} from '../../../redux/transactions/actions'
import styles from './style.module.scss'

// const { RangePicker } = DatePicker
const { Option } = Select
const { transactionActiveStatus } = variables

const mapStateToProps = ({ general, user, settings, transactions, trades }) => ({
  clients: general.clients,
  currencies: general.currencies,
  vendors: general.newVendors,
  timeZone: settings.timeZone.value,
  token: user.token,
  allTransactions: transactions.allTransactions,
  totalTransactions: transactions.totalTransactions,
  selectedTransaction: transactions.selectedTransaction,
  isEditTxnMode: transactions.isEditTxnMode,
  loading: transactions.txnLoading,
  trades: trades.totalTransfer,
  pagination: transactions.pagination,
})

@Form.create()
@connect(mapStateToProps)
class Transactions extends Component {
  state = {
    visibleFilter: false,
    rowItems: {},
    filters: {},
  }

  componentDidMount() {
    const { token, dispatch } = this.props
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
    dispatch(getAllTransactions(value, token))
  }

  navigateToNewTransaction = () => {
    const { history } = this.props
    history.push('/new-transaction')
  }

  // navigateToRoute = () => {
  //   const { history } = this.props
  //   history.push('/route-details')
  // }

  onClientFilterChange = value => {
    // console.log(`selected ${value}`)
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
    const { form, dispatch, token } = this.props
    form.setFieldsValue({
      clientId: undefined,
      transactionReference: undefined,
      vendorId: undefined,
      depositCurrency: undefined,
      totalDepositAmount: undefined,
      settlementCurrency: undefined,
      transactionStatus: undefined,
    })
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    dispatch(handlePagination(pagination))
    dispatch(getAllTransactions('', token))
    this.onClose()
  }

  onSubmitFilter = e => {
    const { form, dispatch, token } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        dispatch(getAllTransactions(values, token))
      }
      this.setState({ filters: values })
    })
    this.onClose()
  }

  getFilterDrawer = () => {
    const { visibleFilter } = this.state
    const { form, clients, vendors, currencies } = this.props
    const { getFieldDecorator } = form
    const clientOption = clients.map(option => (
      <Option key={option.id} value={option.id}>
        {option.genericInformation.tradingName}
      </Option>
    ))
    const vendorOption = vendors.map(option => (
      <Option key={option.id} value={option.id}>
        {option.genericInformation?.tradingName}
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    const transactionStatusOption = transactionActiveStatus.map(option => (
      <Option key={option.id} value={option.value}>
        {option.label}
      </Option>
    ))
    return (
      <Drawer
        title="Filter Transactions"
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
                    onChange={this.onClientFilterChange}
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                    onSearch={this.onClientFilterSearch}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {clientOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Transaction Reference">
                {getFieldDecorator(
                  'transactionReference',
                  {},
                )(<Input placeholder="Enter a transaction reference" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Vendor Name">
                {getFieldDecorator(
                  'vendorId',
                  {},
                )(
                  <Select
                    showSearch
                    placeholder="Search by Vendor Name"
                    optionFilterProp="children"
                    onChange={this.onClientFilterChange}
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
                    onSearch={this.onClientFilterSearch}
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {vendorOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Deposit Currency">
                {getFieldDecorator(
                  'depositCurrency',
                  {},
                )(
                  <Select showSearch placeholder="Select a Deposit Currency">
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Local Deposit Amount">
                {getFieldDecorator(
                  'totalDepositAmount',
                  {},
                )(<Input placeholder="Enter the local deposit amount" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Settlement Currency">
                {getFieldDecorator(
                  'settlementCurrency',
                  {},
                )(
                  <Select showSearch placeholder="Select a settlement Currency">
                    {currencyOption}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Transaction Status">
                {getFieldDecorator(
                  'transactionStatus',
                  {},
                )(
                  <Select showSearch placeholder="Select the Transaction Status">
                    {transactionStatusOption}
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

  onEditSubmit = e => {
    const { form, dispatch, token } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        dispatch(editTransaction(values, token))
      }
    })
    this.handleModalOk()
  }

  onSelectRowItem = id => {
    this.setState({ rowItems: id })
  }

  onDeleteTransaction = () => {
    const { dispatch, token } = this.props
    const { rowItems } = this.state
    dispatch(deleteTransaction(rowItems[0], token))
  }

  onBulkDeleteTransaction = () => {
    const { dispatch, token } = this.props
    const { rowItems } = this.state
    dispatch(bulkDeleteTransaction(rowItems, token))
  }

  handleTableChange = pagination => {
    const { dispatch, token } = this.props
    const { filters } = this.state
    dispatch(handlePagination(pagination))
    filters.page = pagination.current
    filters.limit = pagination.pageSize
    dispatch(getAllTransactions(filters, token))
  }

  render() {
    const nullSymbol = '---'
    const { clients, allTransactions, loading, timeZone, pagination } = this.props
    const { rowItems } = this.state
    const columns = [
      {
        title: 'Client',
        dataIndex: 'clientId',
        key: 'client',
        align: 'center',
        render: clientId => {
          const obj = clients.find(el => el.id === clientId)
          return obj ? obj.tradingName : nullSymbol
        },
      },
      {
        title: 'Date',
        dataIndex: 'progressLogs.transactionRequestedAt',
        key: 'txnReqDate',
        align: 'center',
        render: txnReqDate => (
          <Tooltip title={txnReqDate ? formatToZoneDate(txnReqDate, timeZone) : nullSymbol}>
            <span>{txnReqDate ? formatToZoneDateOnly(txnReqDate, timeZone) : nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Transaction ID',
        dataIndex: 'transactionReference',
        key: 'transactionReference',
        align: 'center',
        render: transactionReference => transactionReference || nullSymbol,
        // (
        //   <Button style={{ height: 0 }} type="link">
        //     {transactionReference || nullSymbol}
        //   </Button>
        // ),
      },
      {
        title: 'Vendor Name',
        dataIndex: 'vendorName',
        key: 'vendorName',
        align: 'center',
        render: vendorName => vendorName || nullSymbol,
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
        title: 'Status',
        dataIndex: 'transactionStatus',
        key: 'transactionStatus',
        align: 'center',
        render: transactionStatus =>
          transactionActiveStatus.map(res => res.value === transactionStatus && res.label),
      },
    ]
    const rowSelection = {
      onChange: selectedRowKeys => {
        // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        if (selectedRowKeys) this.onSelectRowItem(selectedRowKeys)
        console.log(selectedRowKeys)
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows)
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows)
      },
    }
    // const data = []
    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Transactions History</span>
            {/* <div>
                <small className="utils__titleDescription">Timezone - HKT</small>
              </div> */}
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
              hidden={Object.entries(rowItems).length === 0 || Object.entries(rowItems).length > 1}
              type="primary"
              className="ml-3"
              onClick={this.onDeleteTransaction}
            >
              Delete
              <Icon type="plus" />
            </Button>
            <Button
              hidden={Object.entries(rowItems).length < 2}
              type="primary"
              className="ml-3"
              onClick={this.onBulkDeleteTransaction}
            >
              Bulk Delete
              <Icon type="plus" />
            </Button>
            {/* <Button type="primary" className="ml-3" onClick={this.navigateToNewTransaction}>
              New Transaction
              <Icon type="plus" />
            </Button> */}
          </div>
        }
      >
        <Helmet title="Trades" />
        <div className={styles.block}>
          {this.getFilterDrawer()}
          <div className="row">
            <div className="col-xl-12">
              <Spin tip="Loading..." spinning={loading}>
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  rowSelection={rowSelection}
                  // bordered
                  pagination={pagination}
                  dataSource={allTransactions}
                  scroll={{ x: 'max-content' }}
                  onChange={this.handleTableChange}
                />
              </Spin>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

export default Transactions
