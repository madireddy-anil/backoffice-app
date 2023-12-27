import React, { Component } from 'react'
import { Card, Table, Tooltip, Button, Form, Select, Icon, Row, Col, Pagination } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
// import moment from 'moment'
import lodash from 'lodash'
import {
  getPaymentsListByFilters,
  getQueueListByFilters,
  getRejectedPaymentsByFilters,
  updateSelectedFilters,
} from 'redux/paymentErrorQueue/action'
import Spacer from 'components/CleanUIComponents/Spacer'
import {
  getName,
  amountFormatter,
  formatToZoneDate,
  getExceptionMessage,
} from '../../utilities/transformer'

import data from './data.json'
import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, paymentErrorQueue, general, settings }) => ({
  token: user.token,
  paymentErrorQueue: paymentErrorQueue.allErrorQueueList,
  timeZone: settings.timeZone.value,
  loading: paymentErrorQueue.loading,
  clients: general.clients,
  currencies: general.currencies,
  totalPages: paymentErrorQueue.totalPages,
  selectedQueueStatus: paymentErrorQueue.selectedFilters.selectedQueueStatus,
  selectedFilters: paymentErrorQueue.selectedFilters,
  entities: general.entities,
})

// const UNDEFINED_VALUE = undefined
// const TRUE_VALUE = true
// const FALSE_VALUE = false

@Form.create()
@connect(mapStateToProps)
class errorQueueList extends Component {
  state = {
    visibleSearch: true,
    selectedOwnerEntityId: undefined,

    selectedCurrency: undefined,
    selectedProcessFlow: undefined,
    selectedQueueStatus: 'awaitingReview',
    selectedExitStatusCode: undefined,
    fromNumber: 1,
    toNumber: 50,
    // pageSize: 10,
    limit: 50,
    activePage: 1,
    selectedDays: undefined,
    sortBy: 'asc',
  }

  componentDidMount() {
    const { token, dispatch, location } = this.props
    if (location.state === undefined) {
      const value = {
        activePage: 1,
        limit: 50,
        selectedOwnerEntityId: undefined,
        selectedDays: undefined,
        selectedExitStatusCode: undefined,
        selectedCurrency: undefined,
        selectedQueueStatus: 'awaitingReview',
        selectedProcessFlow: undefined,
        sortBy: 'asc',
      }
      dispatch(updateSelectedFilters(value))
    }
    Promise.resolve(this.updateFiltersToState()).then(() => {
      const { selectedFilters, selectedQueueStatus } = this.props
      if (selectedQueueStatus === 'awaitingReview') {
        dispatch(getQueueListByFilters(selectedFilters, token))
      } else {
        dispatch(getRejectedPaymentsByFilters(selectedFilters, token))
      }
    })
    // this.resetFilters()
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isFiltersUpdate) {
      this.updateFiltersToState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { selectedFilters } = this.props

    const isPropsUpdated = {
      isFiltersUpdate: prevProps.selectedFilters !== selectedFilters,
    }
    return isPropsUpdated
  }

  updateFiltersToState = () => {
    const { selectedFilters } = this.props
    this.setState({
      selectedOwnerEntityId: selectedFilters.selectedOwnerEntityId,
      selectedCurrency: selectedFilters.selectedCurrency,
      selectedDays: selectedFilters.selectedDays,
      selectedExitStatusCode: selectedFilters.selectedExitStatusCode,
      limit: selectedFilters.limit,
      activePage: selectedFilters.activePage,
      toNumber: selectedFilters.limit,
      sortBy: selectedFilters.sortBy,
    })
  }

  navigateToSummaryPage = record => {
    const { dispatch, token, history } = this.props
    // dispatch(updateSelectedErrorRecord(record))
    const value = {
      // ownerEntityId: record.ownerEntityId,
      // remittanceInformation: record.remittanceInformation,
      // creditorAgent: record.creditorAgent,
      // originalInstructedAmount: record.originalInstructedAmount,
      // requestedValueDate: record.isOutbound ? record.requestedValueDate : record.valueDate,
      id: record.id,
    }
    dispatch(getPaymentsListByFilters(value, token))
    history.push('/error-approval-request')
  }

  handleTableChange = currentPage => {
    const { dispatch, token } = this.props
    const {
      limit,
      sortBy,
      selectedProcessFlow,
      selectedCurrency,
      selectedOwnerEntityId,
      selectedQueueStatus,
      selectedExitStatusCode,
    } = this.state
    this.setState({
      activePage: currentPage,
    })
    const value = {
      limit,
      activePage: currentPage,
      sortBy,
      selectedProcessFlow,
      selectedCurrency,
      selectedOwnerEntityId,
      selectedQueueStatus,
      selectedExitStatusCode,
    }
    if (selectedQueueStatus === 'awaitingReview') {
      dispatch(getQueueListByFilters(value, token))
    } else {
      dispatch(getRejectedPaymentsByFilters(value, token))
    }
    this.arrayPaginationCount(limit, currentPage)
  }

  arrayPaginationCount = (limit, activePage) => {
    const skip = (activePage - 1) * limit
    const fromNumb = skip + 1
    const toNumb = skip + limit
    this.setState({
      fromNumber: fromNumb,
      toNumber: toNumb,
    })
  }

  handlePageSizeChange = (current, pageSize) => {
    Promise.resolve(
      this.setState({ limit: pageSize, activePage: 1, fromNumber: current }),
    ).then(() => this.fetchListByFilters())
  }

  onChangeSelectClient = e => {
    Promise.resolve(this.setState({ selectedOwnerEntityId: e, activePage: 1, fromNumber: 1 })).then(
      () => {
        this.fetchListByFilters()
      },
    )
  }

  onChangedebitCurrencySelect = e => {
    Promise.resolve(this.setState({ selectedCurrency: e, activePage: 1, fromNumber: 1 })).then(
      () => {
        this.fetchListByFilters()
      },
    )
  }

  onChangeProcessFlowSelect = e => {
    Promise.resolve(this.setState({ selectedProcessFlow: e, activePage: 1, fromNumber: 1 })).then(
      () => {
        this.fetchListByFilters()
      },
    )
  }

  onChangeDaysOutStandingSelect = e => {
    Promise.resolve(this.setState({ selectedDays: e, activePage: 1, fromNumber: 1 })).then(() => {
      this.fetchListByFilters()
    })
  }

  onChangeExceptionSelect = e => {
    Promise.resolve(
      this.setState({ selectedExitStatusCode: e, activePage: 1, fromNumber: 1 }),
    ).then(() => {
      this.fetchListByFilters()
    })
  }

  onChangeQueueStatus = e => {
    Promise.resolve(this.setState({ activePage: 1, fromNumber: 1, selectedQueueStatus: e })).then(
      () => {
        this.fetchListByFilters()
      },
    )
  }

  onClearFilters = () => {
    // const { dispatch } = this.props
    //  dispatch(updateSelectedQueueStatus('awaitingReview'))
    Promise.resolve(
      this.setState({
        selectedOwnerEntityId: undefined,
        selectedCurrency: undefined,
        selectedDays: undefined,
        selectedProcessFlow: undefined,
        selectedExitStatusCode: undefined,
        limit: 50,
        sortBy: 'asc',
        activePage: 1,
        fromNumber: 1,
        selectedQueueStatus: 'awaitingReview',
      }),
    ).then(() => {
      this.fetchListByFilters()
    })
  }

  fetchListByFilters = () => {
    const { dispatch, token } = this.props
    const {
      selectedOwnerEntityId,
      limit,
      activePage,
      selectedDays,
      sortBy,
      selectedProcessFlow,
      selectedExitStatusCode,
      selectedCurrency,
      selectedQueueStatus,
    } = this.state
    const value = {
      selectedOwnerEntityId,
      limit,
      activePage,
      selectedDays,
      selectedQueueStatus,
      selectedExitStatusCode,
      sortBy,
      selectedProcessFlow,
      selectedCurrency,
    }
    dispatch(updateSelectedFilters(value))
    if (selectedQueueStatus === 'awaitingReview') {
      dispatch(getQueueListByFilters(value, token))
    } else {
      dispatch(getRejectedPaymentsByFilters(value, token))
    }
  }

  getSearchUI = () => {
    const { visibleSearch, selectedProcessFlow } = this.state
    const { entities, currencies, selectedFilters, selectedQueueStatus } = this.props
    const clientOption = entities.map(option => (
      <Option key={option.id} label={option.genericInformation.registeredCompanyName}>
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    const datesOption = data.dataFiltes.map(option => (
      <Option key={option.id} value={option.value} label={option.label}>
        {option.value}
      </Option>
    ))

    const queueStatus = data.queueStatus.map(option => (
      <Option key={option.id} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const processFlowList = data.processFlow.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const exceptionOption = data.exception.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    return (
      <div hidden={visibleSearch} className={`${styles.data} mb-2 p-2`}>
        <div className="row">
          <div className="col-lg-3">
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Filter by Account Owner"
              value={selectedFilters.selectedOwnerEntityId}
              className={styles.cstmSelectInput}
              onSelect={(name, id) => this.onChangeSelectClient(name, id)}
              optionLabelProp="label"
              onFilterProp="children"
              filterOption={(input, option) =>
                option.props.label
                  ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  : ''
              }
            >
              {clientOption}
            </Select>
          </div>
          <div className="col-lg-3">
            <Select
              showSearch
              style={{ width: '100%' }}
              bordered={false}
              placeholder="Filter by Process Flow"
              value={selectedFilters.selectedProcessFlow}
              className={styles.cstmSelectInput}
              optionLabelProp="label"
              filterOption={(input, option) =>
                option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(currency, id) => this.onChangeProcessFlowSelect(currency, id)}
            >
              {processFlowList}
            </Select>
          </div>
          <div className="col-lg-3">
            <Select
              showSearch
              style={{ width: '100%' }}
              bordered={false}
              placeholder="Filter by Days Outstanding"
              value={selectedFilters.selectedQueueStatus}
              className={styles.cstmSelectInput}
              optionLabelProp="label"
              filterOption={(input, option) =>
                option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(currency, id) => this.onChangeQueueStatus(currency, id)}
            >
              {queueStatus}
            </Select>
          </div>
          {selectedProcessFlow ? (
            <div className="col-lg-3">
              <Select
                showSearch
                style={{ width: '100%' }}
                bordered={false}
                placeholder="Filter by Currency"
                value={selectedFilters.selectedCurrency}
                className={styles.cstmSelectInput}
                optionLabelProp="value"
                filterOption={(input, option) =>
                  option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(currency, id) => this.onChangedebitCurrencySelect(currency, id)}
              >
                {currencyOption}
              </Select>
            </div>
          ) : (
            ''
          )}

          {/* <Spacer height="20px" /> */}
          {selectedQueueStatus === 'awaitingReview' ? (
            <div className="col-lg-3">
              <Select
                showSearch
                style={{ width: '100%' }}
                bordered={false}
                placeholder="Filter by Days Outstanding"
                value={selectedFilters.selectedDays}
                className={styles.cstmSelectInput}
                optionLabelProp="value"
                filterOption={(input, option) =>
                  option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={(currency, id) => this.onChangeDaysOutStandingSelect(currency, id)}
              >
                {datesOption}
              </Select>
            </div>
          ) : (
            ''
          )}
          {selectedQueueStatus === 'awaitingReview' ? (
            <div className="col-lg-3">
              <Select
                showSearch
                style={{ width: '100%' }}
                bordered={false}
                placeholder="Filter by Exception"
                value={selectedFilters.selectedExitStatusCode}
                className={styles.cstmSelectInput}
                optionLabelProp="label"
                onChange={(value, id) => this.onChangeExceptionSelect(value, id)}
              >
                {exceptionOption}
              </Select>
            </div>
          ) : (
            ''
          )}

          <div className="col-lg-3">
            <Button
              className={`mt-4 mb-3 mr-4 ${styles.clearBtn}`}
              type="primary"
              ghost
              onClick={this.onClearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    )
  }

  getCurrencyFilter = () => {
    const { clients } = this.props
    const { selectedOwnerEntityId } = this.state
    const clientOption = clients.map(option => (
      <Option key={option.id} label={option.genericInformation.registeredCompanyName}>
        <h5>{option.genericInformation.tradingName}</h5>
        <small>{option.genericInformation.registeredCompanyName}</small>
      </Option>
    ))
    return (
      <Row>
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder="select client"
          className={styles.cstmSelectInput}
          onSelect={(name, id) => this.onChangeSelectClient(name, id)}
          optionLabelProp="label"
          onFilterProp="children"
          value={selectedOwnerEntityId}
          filterOption={(input, option) =>
            option.props.children[0].props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {clientOption}
        </Select>
      </Row>
    )
  }

  getCurrencyFilterIcon = () => {
    const { selectedOwnerEntityId } = this.state
    return <Icon type="filter" style={{ color: selectedOwnerEntityId ? '#1890ff' : '#bfbfbf' }} />
  }

  getColumnVendorFilterProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <div>{this.getCurrencyFilter(setSelectedKeys)}</div>
        <Spacer height="15px" />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, dataIndex, confirm)}
          icon="filter"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Ok
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters, dataIndex)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="filter" style={{ color: filtered ? '#1890ff' : '#bfbfbf' }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',

    // onFilterDropdownVisibleChange: visible => {
    //   if (visible) {
    //     setTimeout(() => this.searchInput.select())
    //   }
    // },
  })

  handleSearch = (selectedKeys, fieldName, confirm) => {
    switch (fieldName) {
      case 'ownerEntityId':
        Promise.resolve(this.setState({ selectedOwnerEntityId: selectedKeys[0] })).then(() =>
          this.fetchListByFilters(),
        )
        break
      default:
        break
    }
    confirm()
  }

  handleReset = (clearFilters, fieldName) => {
    switch (fieldName) {
      case 'ownerEntityId':
        Promise.resolve(this.setState({ selectedOwnerEntityId: undefined })).then(() =>
          this.fetchListByFilters(),
        )
        break

      default:
        break
    }
  }

  getCurrency = record => {
    let value
    if (
      record.processFlow === 'manual_credit_adjustment' ||
      record.processFlow === 'manual_debit_adjustment'
    ) {
      value = record.isOutbound ? record.debitCurrency : record.creditCurrency
    } else {
      value = record.isOutbound ? record.creditCurrency : record.debitCurrency
    }

    return value
  }

  getAmount = record => {
    let value
    if (
      record.processFlow === 'manual_credit_adjustment' ||
      record.processFlow === 'manual_debit_adjustment'
    ) {
      value = record.isOutbound
        ? amountFormatter(record.debitAmount)
        : amountFormatter(record.creditAmount)
    } else {
      value = record.isOutbound
        ? amountFormatter(record.creditAmount)
        : amountFormatter(record.debitAmount)
    }

    return value
  }

  handleTableSorted = (pagination, filters, sorter) => {
    const order = sorter.order !== undefined && sorter.order === 'ascend' ? 'desc' : 'asc'
    Promise.resolve(this.setState({ sortBy: order })).then(() => this.fetchListByFilters())
  }

  getInitiatedSourceName = sourceValue => {
    switch (sourceValue) {
      case 'bms':
        return 'Control Center'
      case 'cms':
        return 'Client Portal'
      case 'efx':
        return 'EFX Engine'
      case 'payments':
        return 'Payments Engine'
      case 'pay-revenue-processor':
        return 'Revenue Processor'
      default:
        return 'Control Center'
    }
  }

  render() {
    const {
      loading,
      paymentErrorQueue,
      entities,
      totalPages,
      // selectedQueueStatus,
      timeZone,
      // selectedFilters,
    } = this.props
    const { fromNumber, toNumber, activePage, limit } = this.state
    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Created By',
        dataIndex: 'created',
        key: 'created',
        align: 'center',
        render: createdData => {
          return (
            <Tooltip title={createdData?.email}>
              {`${createdData?.firstName ?? '---'} ${createdData?.lastName ?? '---'}`}
            </Tooltip>
          )
        },
      },
      {
        title: 'Initiated From',
        dataIndex: 'created',
        key: 'initiatedFrom',
        align: 'center',
        render: createdData => {
          return this.getInitiatedSourceName(createdData?.source)
        },
      },
      {
        title: 'Internal Payment',
        dataIndex: 'internalPayment',
        key: 'internalPayment',
        align: 'center',
        render: internalPayment => {
          return internalPayment ? 'Yes' : 'No'
        },
      },
      {
        title: 'Account Owner',
        dataIndex: 'ownerEntityId',
        key: 'ownerEntityId',
        align: 'center',
        render: text => getName(entities, text),
        // ...this.getColumnVendorFilterProps('ownerEntityId'),
      },
      {
        title: 'Transaction Reference',
        dataIndex: 'transactionReference',
        key: 'transactionReference',
        align: 'center',
      },
      {
        title: 'Process Flow',
        dataIndex: 'processFlow',
        key: 'processFlow',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Payment Type',
        dataIndex: 'isOutbound',
        key: 'isOutbound',
        align: 'center',
        render: text => (text ? 'Debit' : 'Credit'),
      },
      {
        title: 'Debit Amount',
        dataIndex: 'debitAmount',
        key: 'debitAmount',
        align: 'center',
        render: amount => (amount ? amountFormatter(amount) : ''),
      },
      {
        title: 'Debit Currency',
        dataIndex: 'debitCurrency',
        key: 'debitCurrency',
        align: 'center',
      },
      {
        title: 'Credit Amount',
        dataIndex: 'creditAmount',
        key: 'creditAmount',
        align: 'center',
        render: amount => (amount ? amountFormatter(amount) : ''),
      },
      {
        title: 'Credit Currency',
        dataIndex: 'creditCurrency',
        key: 'creditCurrency',
        align: 'center',
      },
      {
        title: 'Days outstanding review',
        dataIndex: 'daysOutstanding',
        key: 'daysOutstanding',
        align: 'center',
        sorter: (a, b) => a.daysOutstanding.length - b.daysOutstanding.length,
        sortDirections: ['ascend', 'descend'],
        // defaultSortOrder: sortBy === 'desc' ? 'ascend' : 'descend'
      },
      {
        title: 'Exception',
        dataIndex: '',
        key: 'messageValidationResult',
        align: 'center',
        fixed: 'right',
        render: text => getExceptionMessage(text),
      },
      // {
      //   title: 'Queue Status',
      //   dataIndex: 'queueStatus',
      //   key: 'queueStatus',
      //   align: 'center',
      //   fixed: 'right',
      //   render: () =>
      //     selectedQueueStatus === 'awaitingReview' ? (
      //       <div style={{ color: 'green', fontWeight: 'bold' }}>Awaiting Review</div>
      //     ) : (
      //       <div style={{ color: 'red', fontWeight: 'bold' }}>Rejected</div>
      //     ),
      // },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        fixed: 'right',
        render: () => (
          <>
            <Tooltip title="View Details">
              <Icon type="eye" />
            </Tooltip>
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Payment Operation Queue</span>
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
          className={styles.mainCard}
          extra={
            <div>
              <Tooltip title="filters">
                <Icon
                  type="filter"
                  className="mr-3"
                  onClick={() =>
                    this.setState(prevState => ({
                      visibleSearch: !prevState.visibleSearch,
                    }))
                  }
                />
              </Tooltip>
            </div>
          }
        >
          <Helmet title="Currency" />
          <div>
            {this.getSearchUI()}
            <div className="row">
              <div className="col-xl-12">
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  loading={loading}
                  dataSource={paymentErrorQueue}
                  scroll={{ x: 'max-content' }}
                  pagination={false}
                  onChange={this.handleTableSorted}
                  bordered
                  onRow={record => ({
                    onClick: () => {
                      this.navigateToSummaryPage(record)
                    },
                  })}
                />
              </div>
            </div>

            <div className={styles.totalData}>
              <Row>
                <Col
                  xs={{ span: 24 }}
                  md={{ span: 5 }}
                  lg={{ span: 4 }}
                  className={styles.totalPageBlock}
                >
                  <span>
                    Show {fromNumber} to <b>{toNumber}</b> of <b>{totalPages}</b> entries
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 19 }} lg={{ span: 20 }}>
                  <Pagination
                    className={styles.paginationTab}
                    onChange={this.handleTableChange}
                    current={activePage}
                    showSizeChanger
                    defaultCurrent={1}
                    // defaultPageSize={limit}
                    pageSize={limit}
                    pageSizeOptions={['10', '50', '100']}
                    onShowSizeChange={this.handlePageSizeChange}
                    total={totalPages}
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default errorQueueList
