import React, { Component } from 'react'
import _ from 'lodash'
import {
  Card,
  Table,
  Spin,
  Icon,
  Tooltip,
  DatePicker,
  Button,
  Select,
  Drawer,
  Col,
  Row,
  Form,
  Input,
  Menu,
  Dropdown,
  Modal,
  Skeleton,
} from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import moment from 'moment'
import {
  getTradeById,
  updateCurrentChannelDetails,
} from 'redux/restrictedCurrencies/trade/tradeProcess/tradeDetails/actions'
import {
  getChatToken,
  initialiseTwilioChatClient,
} from 'redux/restrictedCurrencies/trade/tradeProcess/chat/actions'

import {
  getTrades,
  // insertNewTrade,
  deleteTrade,
  bulkDeleteTrades,
  handlePagination,
  getTradesBulkDownload,
  // updateCSTrade,
  updateTradeFilters,
  updateDownloadableData,
} from 'redux/restrictedCurrencies/trade/tradesHistory/actions'

import SubMenu from 'antd/lib/menu/SubMenu'
import {
  formatToZoneDateOnly,
  formatToZoneDate,
  amountFormatter,
  formatNumberDecimal,
  disabledFutureDate,
  restrictDateFor45Days,
} from 'utilities/transformer'
import globalVariables from 'utilities/variables'
import DownloadUI from '../../reports/downloadComponents/downloadUI'
import styles from './style.module.scss'

const { RangePicker } = DatePicker
const { Option } = Select
const { tradeActiveStatus } = globalVariables
const { confirm } = Modal

const mapStateToProps = ({ general, user, trades, npChat, settings, npTrade }) => ({
  clients: general.clients,
  currencies: general.currencies,
  beneficiaries: general.beneficiaries,
  allStreamChannels: general.allStreamChannels,
  timeZone: settings.timeZone.value,
  token: user.token,
  email: user.email,
  userType: user.userType,
  dateFrom: trades.dateFrom,
  dateTo: trades.dateTo,
  trades: trades.totalTransfer,
  loading: trades.loading,
  activeChannel: trades.activeChannel,
  chatToken: npChat.token,
  streamingChannels: general.allStreamChannels,
  chatClient: npChat.chatClient,
  activeTradeStreamingChannel: npChat.activeTradeStreamingChannel,
  tradeId: npTrade.id,
  pagination: trades.pagination,
  allTradesDownload: trades.allTradesDownload,
  totalTradesDownload: trades.totalClientsDownload,
  isDownloadDisabled: trades.isDownloadDisabled,
  previousChangeStreamIndex: trades.previousChangeStreamIndex,
  appliedFilters: trades.appliedTradeFilters,
  cryptoBeneficiaries: general.cryptoBeneficiaries,
})

@Form.create()
@connect(mapStateToProps)
class TradesHistory extends Component {
  state = {
    visibleSearch: true,
    visibleFilter: false,
    selectedRowKeys: [],
    search: {
      clientName: '',
      dateFrom: '',
      dateTo: '',
      status: '',
    },
    filters: {},
    clientName: '',
    nameOnAccount: '',
    depositCurrency: '',
    settlementCurrency: '',
    tradeStatus: '',
    searchText: '',
    downloadSelectedType: 'current',
    visibleDownload: true,
    isDownloadDateRangeSelected: false,
  }

  componentDidMount() {
    const {
      token,
      dispatch,
      chatToken,
      activeTradeStreamingChannel,
      streamingChannels,
      chatClient,
      email,
      userType,
      appliedFilters,
      form,
    } = this.props
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    let filterDates
    if (appliedFilters.DateAndTime) {
      filterDates = appliedFilters.DateAndTime
      filterDates[0] = moment(filterDates[0], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
      filterDates[1] = moment(filterDates[1], 'YYYY-MM-DDTHH:mm:ss.SSSSZ')
    }
    const value = {
      ...appliedFilters,
      page: pagination.current,
      limit: pagination.pageSize,
    }
    form.setFieldsValue({ ...appliedFilters })
    dispatch(handlePagination(pagination))
    dispatch(getTrades(value, token))
    if (
      chatToken &&
      Object.entries(activeTradeStreamingChannel).length === 0 &&
      Object.entries(chatClient).length === 0
    ) {
      Promise.resolve(dispatch(initialiseTwilioChatClient(chatToken, streamingChannels, '')))
    } else if (chatToken === '' || chatToken === undefined) {
      const chatValues = {
        clientEmail: email,
        userType,
        token,
      }
      dispatch(getChatToken(chatValues))
    }
    // this.messageHandler()
    this.mounted = true
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      chatClient,
      dispatch,
      chatAccessToken,
      streamingChannels,
      email,
      userType,
      token,
      activeTradeStreamingChannel,
    } = this.props
    if (snapshot.updateRequired) {
      if (
        chatAccessToken &&
        Object.entries(activeTradeStreamingChannel).length === 0 &&
        Object.entries(chatClient).length === 0
      ) {
        Promise.resolve(
          dispatch(initialiseTwilioChatClient(chatAccessToken, streamingChannels, '')),
        )
      } else if (chatAccessToken === '') {
        const chatValues = {
          clientEmail: email,
          userType,
          token,
        }
        dispatch(getChatToken(chatValues))
      }
    }
    // this.messageHandler()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { chatToken } = this.props
    return { updateRequired: prevProps.chatToken !== chatToken && chatToken !== '' }
  }

  // messageHandler = () => {
  //   const { dispatch, activeTradeStreamingChannel, trades } = this.props
  //   if (Object.entries(activeTradeStreamingChannel).length !== 0) {
  //     activeTradeStreamingChannel.on('messageAdded', result => {
  //       const data = result.body ? JSON.parse(result.body) : {}

  //       data.document.beneficiary =
  //         Object.entries(data.document.cryptoBeneficiary).length !== 0
  //           ? data.document.cryptoBeneficiary
  //           : data.document.beneficiary
  //       if (data.operationType === 'insert') {
  //         dispatch(insertNewTrade(data.document, result.index))
  //       }
  //       if (data.operationType === 'update') {
  //         const oldTrade = trades.find(trade => trade.id === data.document.id)
  //         if (JSON.stringify(data.document) !== JSON.stringify(oldTrade)) {
  //           dispatch(updateCSTrade(data.document, result.index))
  //         }
  //       }
  //     })
  //   }
  // }

  navigateToNewTrade = () => {
    const { history } = this.props
    history.push('/np-new-trade')
  }

  navigateToTrade = trade => {
    const { dispatch, token } = this.props
    // const { dispatch, history } = this.props
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

  // search
  onClientSearchChange = value => {
    this.setState(prevState => ({
      search: {
        ...prevState.search,
        clientName: value,
      },
    }))
  }

  onClientSearchBlur = () => {
    console.log('blur')
  }

  onClientSearchFocus = () => {
    console.log('focus')
  }

  onClientSearch = val => {
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
      this.searchTrades()
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

  searchTrades = () => {
    const {
      search: { clientName, dateFrom, dateTo, status },
    } = this.state
    const { token, dispatch } = this.props
    const value = {
      clientName,
      dateFrom,
      dateTo,
      status,
      token,
    }
    dispatch(getTrades(value))
  }

  onClearSearch = () => {
    const { form, token, dispatch } = this.props
    form.setFieldsValue({
      clientName: undefined,
      status: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    })
    dispatch(getTrades(token))
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
    }))
  }

  onSubmitSearch = e => {
    const { form, dispatch, clients } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        const client = clients.find(el => el.tradingName === values.clientName)
        const value = {
          clientId: client ? client.id : '',
          status: values.status,
        }
        dispatch(getTrades(value))
      }
    })
  }

  // Filter
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
    const { form, token, dispatch } = this.props
    this.setState({
      filters: {},
      downloadSelectedType: 'current',
      isDownloadDateRangeSelected: false,
    })
    form.setFieldsValue({
      clientName: undefined,
      sourceCurrency: undefined,
      status: undefined,
      tradeReference: undefined,
      fiatBeneficiaryId: undefined,
      cryptoBeneficiaryId: undefined,
      depositCurrency: undefined,
      settlementCurrency: undefined,
      totalDepositAmount: undefined,
      settlementAmount: undefined,
      DateAndTime: undefined,
      downloadSelectedType: 'current',
      DateAndTimeForDownload: [],
    })
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    dispatch(updateTradeFilters({}))
    dispatch(handlePagination(pagination))
    dispatch(getTrades('', token))
    this.onClose()
  }

  onSubmitFilter = e => {
    e.preventDefault()
    const { form, dispatch, token, appliedFilters } = this.props
    this.setState({
      downloadSelectedType: 'current',
      isDownloadDateRangeSelected: false,
    })
    form.validateFields((err, values) => {
      if (!err) {
        const value = {
          ...appliedFilters,
          clientId: values.clientName,
          status: values.status,
          tradeReference: values.tradeReference,
          fiatBeneficiaryId: values.fiatBeneficiaryId,
          cryptoBeneficiaryId: values.cryptoBeneficiaryId,
          depositCurrency: values.depositCurrency,
          settlementCurrency: values.settlementCurrency,
          totalDepositAmount: values.totalDepositAmount,
          settlementAmount: values.settlementAmount,
          DateAndTime: values.DateAndTime,
          dateFrom: values.DateAndTime
            ? values.DateAndTime[0]
              ? values.DateAndTime[0].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : ''
            : '',
          dateTo: values.DateAndTime
            ? values.DateAndTime[1]
              ? values.DateAndTime[1].format('YYYY-MM-DDTHH:mm:ss.SSS').concat('Z')
              : ''
            : '',
        }
        form.setFieldsValue({
          downloadSelectedType: 'current',
          DateAndTimeForDownload: restrictDateFor45Days(values.DateAndTime)
            ? values.DateAndTime
            : undefined,
        })
        const pagination = {
          current: 1,
          total: 0,
          pageSize: 10,
        }
        dispatch(updateTradeFilters(value))
        dispatch(handlePagination(pagination))
        this.setState({ filters: value })
        dispatch(getTrades(value, token))
      }
    })
    this.onClose()
  }

  getFilterDrawer = () => {
    const { visibleFilter } = this.state
    const {
      form,
      clients,
      currencies,
      beneficiaries,
      cryptoBeneficiaries,
      appliedFilters,
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
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    return (
      <Drawer
        title="Filter Trades"
        width={600}
        onClose={this.onClose}
        visible={visibleFilter}
        keyboard={false}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical" onSubmit={this.onSubmitFilter}>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Client Name">
                {getFieldDecorator('clientName', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Filter by Client Name"
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
              <Form.Item label="Trade Id">
                {getFieldDecorator('tradeReference', {
                  initialValue: undefined,
                })(
                  <Input
                    placeholder="Filter by Trade Id"
                    onChange={this.onClientFilterChange}
                    onFocus={this.onClientFilterFocus}
                    onBlur={this.onClientFilterBlur}
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
                        updateTradeFilters({ ...appliedFilters, disableCryptoBeneField: true }),
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
                        updateTradeFilters({ ...appliedFilters, disableFiatBeneField: true }),
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
              <Form.Item label="Deposit Currency">
                {getFieldDecorator('depositCurrency', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
                    placeholder="Search by deposit Currency"
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
            <Col span={12}>
              <Form.Item label="Local Currency Amount">
                {getFieldDecorator('totalDepositAmount', {
                  initialValue: undefined,
                })(<Input placeholder="Filter by Local Currency Amount" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Settlement Currency">
                {getFieldDecorator('settlementCurrency', {
                  initialValue: undefined,
                })(
                  <Select
                    showSearch
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
            <Col span={12}>
              <Form.Item label="Settlement Amount">
                {getFieldDecorator('settlementAmount', {
                  initialValue: undefined,
                })(<Input placeholder="Filter by Settlement Amount" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col span={12}>
              <Form.Item label="Status">
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
            <Col span={12}>
              <Form.Item label="Date Time">
                {getFieldDecorator('DateAndTime')(
                  <RangePicker
                    style={{ width: '258px !important', margin: '0px' }}
                    disabledDate={disabledFutureDate}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    format="YYYY/MM/DD HH:mm:ss"
                    // onChange={this.onSearchTradeDateChange}
                    showTime={{
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('23:59:59', 'HH:mm:ss'),
                      ],
                    }}
                  />,
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

  onSelectRowItem = idArray => {
    this.setState({ selectedRowKeys: idArray })
  }

  onDeleteTrade = () => {
    const { dispatch, token } = this.props
    const { selectedRowKeys } = this.state
    const insidethis = this
    confirm({
      title: 'Are you sure delete this transaction?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        Promise.resolve(dispatch(deleteTrade(selectedRowKeys, token))).then(() => {
          insidethis.setState({ selectedRowKeys: [] })
        })
      },
      onCancel() {},
    })
  }

  onBulkDeleteTrades = () => {
    const { dispatch, token } = this.props
    const { selectedRowKeys } = this.state
    const insidethis = this
    confirm({
      title: 'Are you sure delete this transaction?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        Promise.resolve(dispatch(bulkDeleteTrades(selectedRowKeys, token))).then(() => {
          insidethis.setState({ selectedRowKeys: [] })
        })
      },
      onCancel() {},
    })
  }

  handleTableChange = (paginationParam, filter, sorter, extra) => {
    const { dispatch, token, form, appliedFilters, pagination } = this.props
    const { isDownloadDateRangeSelected } = this.state

    if (!isDownloadDateRangeSelected) {
      this.setState({
        downloadSelectedType: 'current',
      })
      form.setFieldsValue({
        downloadSelectedType: 'current',
      })
      dispatch(updateDownloadableData(extra.currentDataSource))

      if (
        paginationParam.current !== pagination.current ||
        paginationParam.pageSize !== pagination.pageSize
      ) {
        dispatch(
          getTrades(
            { page: paginationParam.current, limit: paginationParam.pageSize, ...appliedFilters },
            token,
          ),
        )
      }
    }
    dispatch(handlePagination(paginationParam))
  }

  filterColumnDatas = value => {
    const obj = { text: '', value: '' }
    obj.text = value
    obj.value = value
    return obj
  }

  getFilteredArrays = fieldName => {
    const { clients, beneficiaries, currencies } = this.props
    const data = []
    switch (fieldName) {
      case 'clientName':
        clients.map(option => {
          const filterData = this.filterColumnDatas(option.genericInformation.tradingName)
          data.push(filterData)
          return data
        })
        return _.uniqBy(data, 'text')
      case 'nameOnAccount':
        beneficiaries.map(option => {
          const filterData = this.filterColumnDatas(option.bankAccountDetails.nameOnAccount)
          data.push(filterData)
          return data
        })
        return _.uniqBy(data, 'text')
      case 'depositCurrency':
        currencies.map(option => {
          const filterData = this.filterColumnDatas(option.value)
          data.push(filterData)
          return data
        })
        return _.uniqBy(data, 'text')
      case 'settlementCurrency':
        currencies.map(option => {
          const filterData = this.filterColumnDatas(option.value)
          data.push(filterData)
          return data
        })
        return _.uniqBy(data, 'text')
      case 'tradeStatus':
        tradeActiveStatus.map(option => {
          const filterData = this.filterColumnDatas(option.label)
          data.push(filterData)
          return data
        })
        return _.uniqBy(data, 'text')
      default:
        return ''
    }
  }

  onFetchFilteredRecord = (value, dataIndex, confirmed) => {
    confirmed()
    const { dispatch, token } = this.props
    const pagination = {
      current: 1,
      total: 0,
      pageSize: 10,
    }
    this.setState({ searchText: value, searchedColumn: dataIndex, [dataIndex]: value })
    const {
      clientName,
      depositCurrency,
      settlementCurrency,
      nameOnAccount,
      tradeStatus,
    } = this.state
    const filter = {
      clientName: clientName || '',
      depositCurrency: depositCurrency || '',
      settlementCurrency: settlementCurrency || '',
      nameOnAccount: nameOnAccount || '',
      tradeStatus: tradeStatus || '',
    }
    dispatch(handlePagination(pagination))
    dispatch(getTrades(filter, token))
  }

  onHandleReset = (clearFilters, setSelectedKeys, dataIndex) => {
    const { searchText, searchedColumn } = this.state
    console.log(searchText, searchedColumn)
    clearFilters()
    setSelectedKeys('')
    this.setState({ searchText: '', searchedColumn: '', [dataIndex]: '' })
    const { dispatch, token } = this.props
    dispatch(getTrades('', token))
  }

  onSelectChange = (value, setSelectedKeys, fieldName) => {
    setSelectedKeys(value ? [value] : [])
    this.setState({ [fieldName]: value })
  }

  getDropdown = (fieldName, setSelectedKeys) => {
    const { clients, beneficiaries, currencies } = this.props
    const {
      clientName,
      nameOnAccount,
      settlementCurrency,
      depositCurrency,
      tradeStatus,
    } = this.state
    const clientOption = clients.map(option => (
      <Option key={option.id} value={option.genericInformation.tradingName}>
        {option.genericInformation.tradingName}
      </Option>
    ))
    const beneficiaryOption = beneficiaries.map(option => (
      <Option key={option.id} value={option.bankAccountDetails.nameOnAccount}>
        {option.bankAccountDetails.nameOnAccount}
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.key} value={option.value}>
        {option.value}
      </Option>
    ))

    switch (fieldName) {
      case 'clientName':
        return (
          <Select
            style={{ width: '15rem' }}
            showSearch
            placeholder="Filter by Client Name"
            optionFilterProp="children"
            value={clientName}
            onChange={e => this.onSelectChange(e, setSelectedKeys, 'clientName')}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {clientOption}
          </Select>
        )
      case 'nameOnAccount':
        return (
          <Select
            style={{ width: '15rem' }}
            showSearch
            placeholder="Filter by Beneficiary Name"
            optionFilterProp="children"
            value={nameOnAccount}
            onChange={e => this.onSelectChange(e, setSelectedKeys, 'nameOnAccount')}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {beneficiaryOption}
          </Select>
        )
      case 'depositCurrency':
        return (
          <Select
            style={{ width: '15rem' }}
            showSearch
            placeholder="Filter by Deposit Currency"
            optionFilterProp="children"
            value={depositCurrency}
            onChange={e => this.onSelectChange(e, setSelectedKeys, 'depositCurrency')}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {currencyOption}
          </Select>
        )
      case 'settlementCurrency':
        return (
          <Select
            style={{ width: '15rem' }}
            showSearch
            placeholder="Filter by Settlement Currency"
            optionFilterProp="children"
            value={settlementCurrency}
            onChange={e => this.onSelectChange(e, setSelectedKeys, 'settlementCurrency')}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {currencyOption}
          </Select>
        )
      case 'tradeStatus':
        return (
          <Select
            style={{ width: '15rem' }}
            showSearch
            placeholder="Filter by Trade Status"
            optionFilterProp="children"
            value={tradeStatus}
            onChange={e => this.onSelectChange(e, setSelectedKeys, 'tradeStatus')}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="completed">COMPLETED</Option>
            <Option value="funds_remitted">FUNDS REMITTED</Option>
            <Option value="quote_confirmed">QUOTE CONFIRMED</Option>
            <Option value="deposits_confirmed">DEPOSITS CONFIRMED</Option>
            <Option value="accounts_provided">ACCOUNTS PROVIDED</Option>
            <Option value="accounts_requested">ACCOUNTS REQUESTED</Option>
            <Option value="new">NEW</Option>
          </Select>
        )
      default:
        return ''
    }
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, clearFilters, confirmed }) => (
      <div style={{ padding: '8px', height: '8rem' }}>
        {this.getDropdown(dataIndex, setSelectedKeys)}
        <div style={{ marginTop: '2rem' }}>
          <Button
            type="primary"
            onClick={() => this.onFetchFilteredRecord(selectedKeys, dataIndex, confirmed)}
            icon={<FilterOutlined />}
            size="small"
            style={{ width: 90, marginRight: '1rem' }}
          >
            Filter
          </Button>
          <Button
            onClick={() => this.onHandleReset(clearFilters, setSelectedKeys, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      </div>
    ),
    filterIcon: filtered => <FilterOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput)
      }
    },
  })

  setFilter = () => {
    const tableContent = document.querySelector('.ant-card-body').innerHTML
    console.log('tableContent', tableContent)
  }

  onChangeDownload = (e, dateFrom, dateTo) => {
    const {
      token,
      dispatch,
      pagination: { current, pageSize },
    } = this.props
    const { filters } = this.state
    if (e === 'all') {
      filters.limit = 0
      filters.dateFrom = dateFrom
      filters.dateTo = dateTo
      this.setState({
        downloadSelectedType: e,
        isDownloadDateRangeSelected: true,
      })
      dispatch(getTradesBulkDownload(filters, token))
    } else {
      filters.page = current
      filters.limit = pageSize
      this.setState({
        downloadSelectedType: e,
        isDownloadDateRangeSelected: false,
      })
      dispatch(getTradesBulkDownload(filters, token))
    }
  }

  render() {
    const nullSymbol = '---'
    const {
      trades,
      loading,
      timeZone,
      pagination,
      allTradesDownload,
      isDownloadDisabled,
      form,
    } = this.props
    const { selectedRowKeys, visibleDownload, downloadSelectedType } = this.state
    const columns = [
      {
        title: 'Client Name',
        dataIndex: 'clientName',
        key: 'clientName',
        align: 'center',
        position: 'bottom',
        ellipsis: true,
        width: 100,
        render: clientName => (
          <Tooltip title={clientName || nullSymbol}>
            <span>{clientName || nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Date Initiated',
        dataIndex: 'progressLogs.tradeRequestedAt',
        key: 'scheduledDate',
        align: 'center',
        width: 100,
        render: sd => (
          <Tooltip title={sd ? formatToZoneDate(sd, timeZone) : nullSymbol}>
            <span>{sd ? formatToZoneDateOnly(sd, timeZone) : nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Trade ID',
        dataIndex: 'tradeReference',
        key: 'tradeReference',
        align: 'center',
        ellipsis: true,
        width: 150,
        render: tradeReference => (
          <Button style={{ height: 0 }} type="link">
            {tradeReference || nullSymbol}
          </Button>
        ),
      },
      {
        title: 'Beneficiary Name',
        dataIndex: 'beneficiary',
        key: 'nameOnAccount',
        align: 'center',
        ellipsis: true,
        width: 150,
        render: beneficiary => {
          if (beneficiary) {
            if (beneficiary.bankAccountDetails) {
              return (
                <Tooltip placement="topLeft" title={beneficiary.bankAccountDetails.nameOnAccount}>
                  <span>{beneficiary.bankAccountDetails.nameOnAccount}</span>
                </Tooltip>
              )
            }
            return (
              <Tooltip placement="topLeft" title={beneficiary.aliasName}>
                <span>{beneficiary.aliasName}</span>
              </Tooltip>
            )
          }
          return {}
        },
      },
      {
        title: 'Deposit Currency',
        dataIndex: 'depositCurrency',
        key: 'depositCurrency',
        align: 'center',
        width: 100,
      },
      {
        title: 'Local Currency Amount',
        dataIndex: 'totalDepositAmount',
        key: 'totalDepositAmount',
        align: 'right',
        width: 100,
        render: totalDepositAmount => amountFormatter(totalDepositAmount) || nullSymbol,
      },
      {
        title: 'Deposit Amount in $',
        dataIndex: 'depositEquivalentCostInUSD',
        key: 'depositEquivalentCostInUSD',
        align: 'right',
        width: 100,
        render: depositEquivalentCostInUSD =>
          amountFormatter(formatNumberDecimal(depositEquivalentCostInUSD)) || nullSymbol,
      },
      {
        title: 'Settlement Currency',
        dataIndex: 'settlementCurrency',
        key: 'settlementCurrency',
        align: 'center',
        width: 100,
      },
      {
        title: 'Converted Amount',
        dataIndex: 'settlementAmount',
        key: 'settlementAmount',
        align: 'right',
        width: 100,
        render: ca => amountFormatter(ca || '') || nullSymbol,
      },
      {
        title: 'Sub Status',
        dataIndex: 'subStatus',
        key: 'subStatus',
        align: 'left',
        width: 150,
        render: value => {
          const getIcon = () => {
            if (value === 'completed') {
              return <Icon type="check-circle" style={{ color: '#72bb53', paddingRight: '10px' }} />
            }
            if (value === 'cancelled') {
              return <Icon type="close-circle" style={{ color: '#FF4D4F', paddingRight: '10px' }} />
            }
            return <Icon type="clock-circle" style={{ color: '#ecb160', paddingRight: '10px' }} />
          }
          return (
            <>
              {value ? getIcon() : ''}
              {value ? _.startCase(_.camelCase(value)) : nullSymbol}
            </>
          )
        },
      },
      {
        title: 'Status',
        dataIndex: 'tradeStatus',
        key: 'tradeStatus',
        align: 'left',
        width: 200,
        fixed: 'right',
        sorter: (a, b) => a.tradeStatus.localeCompare(b.tradeStatus),
        render: value => {
          return value === 'completed' ? (
            <>
              <Icon
                type="check-circle"
                style={{ color: '#72bb53', paddingRight: '10px', paddingLeft: '10px' }}
              />
              <span>{_.startCase(_.camelCase(value))}</span>
            </>
          ) : (
            <>
              <Icon
                type="clock-circle"
                style={{ color: '#ecb160', paddingRight: '10px', paddingLeft: '10px' }}
              />
              <span>{_.startCase(_.camelCase(value))}</span>
            </>
          )
        },
      },
    ]
    const data = []
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectRowItem,
    }

    const settingsMenu = (
      <Menu style={{ width: '250px' }}>
        <Menu.Item onClick={this.showDrawer}>
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
      </Menu>
    )

    return (
      <Card
        title={
          <div>
            <span className="font-size-16">Trade History</span>
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
            <Button
              hidden={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
              type="primary"
              className="ml-3"
              onClick={this.onDeleteTrade}
            >
              Delete
              <Icon type="close" />
            </Button>
            <Button
              hidden={selectedRowKeys.length === 0 || selectedRowKeys.length < 2}
              type="primary"
              className="ml-3"
              onClick={this.onBulkDeleteTrades}
            >
              Bulk Delete
              <Icon type="close" />
            </Button>
            <Button type="primary" className="ml-3" onClick={this.navigateToNewTrade}>
              New Trade
              <Icon type="plus" />
            </Button>
            <Tooltip title="settings">
              <Dropdown overlay={settingsMenu} trigger={['click']}>
                <Icon type="setting" className="m-3" />
              </Dropdown>
            </Tooltip>
          </div>
        }
      >
        <Helmet title="Trades" />
        <div className={`${styles.block} trades`}>
          {allTradesDownload.forEach(trade => {
            const tradeData = []
            tradeData.push({
              value: trade.progressLogs.tradeRequestedAt
                ? formatToZoneDate(trade.progressLogs.tradeRequestedAt, timeZone)
                : nullSymbol,
            })
            tradeData.push({
              value: trade.tradeReference || nullSymbol,
              style: { alignment: { horizontal: 'center' } },
            })
            tradeData.push({
              value: trade.clientName,
              style: { alignment: { horizontal: 'center' } },
            })
            const beneficiaryDetails = beneficiary => {
              if (beneficiary) {
                if (beneficiary.bankAccountDetails) {
                  return beneficiary.bankAccountDetails.nameOnAccount
                }
                return beneficiary.aliasName
              }
              return nullSymbol
            }
            tradeData.push({
              value: beneficiaryDetails(trade.beneficiary),
              style: { alignment: { horizontal: 'center' } },
            })
            tradeData.push({
              value: trade.depositCurrency || nullSymbol,
              style: { alignment: { horizontal: 'center' } },
            })
            tradeData.push({
              value: trade.totalDepositAmount || nullSymbol,
              style: { numFmt: '0,0.00' },
            })
            tradeData.push({
              value: formatNumberDecimal(trade.depositEquivalentCostInUSD) || nullSymbol,
              style: { numFmt: '0,0.00' },
            })
            tradeData.push({
              value: trade.settlementCurrency || nullSymbol,
              style: { alignment: { horizontal: 'center' } },
            })
            tradeData.push({
              value: trade.settlementAmount || nullSymbol,
              style: { numFmt: '0,0.00' },
            })
            tradeData.push({
              value: _.startCase(_.camelCase(trade.subStatus)) || nullSymbol,
              style: { alignment: { horizontal: 'center' } },
            })
            tradeData.push({
              value: _.startCase(_.camelCase(trade.tradeStatus)) || nullSymbol,
              style: { alignment: { horizontal: 'center' } },
            })
            data.push(tradeData)
          })}
          {this.getFilterDrawer()}
          <DownloadUI
            titleForDownload="Trade History"
            reportType="Trade History"
            toggleDownload={visibleDownload}
            isDownloadDisabled={isDownloadDisabled}
            downloadData={data}
            onChangeDownload={this.onChangeDownload}
            downloadColumnHeaders={[
              'Trade Initiated Date',
              'Transaction ID',
              'Client Name',
              'Beneficiary Name',
              'Local Currency',
              'Local Currency Amount',
              'Deposit amount in $',
              'Converted Currency',
              'Converted Amount',
              'Sub Status',
              'Status',
            ]}
            currentValue={downloadSelectedType}
            form={form}
          />
          <div className="row">
            <div className="col-xl-12">
              <div className={loading ? 'p-2' : ''}>
                <Skeleton loading={loading} active>
                  <Spin tip="Loading..." spinning={loading}>
                    <Table
                      columns={columns}
                      rowKey={record => record.id}
                      onRow={record => ({
                        onClick: () => {
                          this.navigateToTrade(record)
                        },
                      })}
                      rowSelection={rowSelection}
                      pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '25', '50', '100'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      }}
                      dataSource={trades}
                      scroll={{ x: 'max-content' }}
                      onChange={this.handleTableChange}
                    />
                  </Spin>
                </Skeleton>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }
}

export default TradesHistory
