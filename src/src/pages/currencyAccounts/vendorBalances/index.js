import React, { Component } from 'react'
// import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { SearchOutlined } from '@ant-design/icons'
import lodash from 'lodash'
import env from 'config/config'
import {
  Table,
  Icon,
  Select,
  // Tag,
  Pagination,
  Row,
  Col,
  Button,
  Card,
  Menu,
  Dropdown,
  Modal,
  Input,
  List,
  Avatar,
  Spin,
  Popconfirm,
} from 'antd'
import {
  getAllVendorAccounts,
  getVendorCAByFilters,
  showCurrencyListModal,
  closeCurrencyListModal,
  addVendorCAByCurrency,
  updateSelectedAccount,
} from 'redux/currencyAccounts/action'
import { updateSelectedPaymentType } from 'redux/caTransactions/actions'
import { amountFormatter } from 'utilities/transformer'
import jsondata from './data.json'
import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ currencyAccounts, general, user }) => ({
  vendorAccounts: currencyAccounts.vendorAccounts,
  vendors: general.vendors,
  token: user.token,
  CAlistLoading: currencyAccounts.CAlistLoading,
  totalPages: currencyAccounts.totalPages,
  modalVisible: currencyAccounts.modalVisible,
  addCALoading: currencyAccounts.addCALoading,

  // currencyAccountsList: currencyAccounts.currencyAccountsList,
})

@withRouter
@connect(mapStateToProps)
class AccountBalances extends Component {
  state = {
    columns: [],
    showClientIdFilter: true,
    vendorName: undefined,
    vendorId: undefined,

    fromNumber: 1,
    toNumber: 50,
    // pageSize: 10,
    activePage: 1,
    limit: 50,
    defaultCurrent: 1,

    accountCurrencyList: [],
    currencyList: [],
    currency: undefined,
    //  dropDownOpen : false
  }

  componentDidMount() {
    const { dispatch, token, vendorAccounts } = this.props
    const { limit, activePage } = this.state
    this.setTableColumns()
    const value = {
      limit,
      activePage,
      toNumber: vendorAccounts.length,
    }
    dispatch(getAllVendorAccounts(value, token))
  }

  componentDidUpdate(prevProps) {
    const { vendorAccounts } = this.props

    if (prevProps.vendorAccounts !== vendorAccounts) {
      this.updateSelectedAccountTostate()
    }
  }

  updateSelectedAccountTostate = () => {
    this.getCurrencyList()
  }

  setTableColumns = () => {
    const columns = [
      {
        title: 'Vendor',
        dataIndex: 'tradingName',
        key: 'tradingName',
        align: 'center',
      },
      {
        title: 'Reference',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
        align: 'center',
        onCell: record => ({
          onClick: () => {
            this.handleCASummary(record)
          },
        }),
        render: text =>
          text ? <Button type="link">{text.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</Button> : '',
      },
      {
        title: 'Type',
        dataIndex: 'accountType',
        key: 'accountType',
        align: 'center',
        render: text => lodash.capitalize(text),
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        align: 'center',
        render: text => amountFormatter(text.balance),
      },
      {
        title: 'Status',
        dataIndex: 'accountStatus',
        key: 'accountStatus',
        align: 'center',
        render: text => lodash.capitalize(text),
      },
    ]
    this.setState({ columns })
  }

  handleCASummary = record => {
    const { dispatch, history } = this.props
    const value = record
    dispatch(updateSelectedAccount(value))
    dispatch(updateSelectedPaymentType(''))
    history.push(`/vendor-balance/transactions-account-details/${value.id}`)
  }

  handleFilterIconClick = () => {
    this.setState({ showClientIdFilter: true })
  }

  onChangeSelectVendor = (name, id) => {
    Promise.resolve(
      this.setState({
        vendorName: id.props.label,
        vendorId: id.key,
        defaultCurrent: 1,
        activePage: 1,
      }),
    ).then(() => {
      this.fetchTransactions()
      this.getCurrencyList()
    })
  }

  handleRemoveFilter = () => {
    Promise.resolve(
      this.setState({ vendorName: undefined, vendorId: undefined, showClientIdFilter: true }),
    ).then(() => {
      this.fetchTransactions()
    })
  }

  handleTableChange = currentPage => {
    const { dispatch, token } = this.props
    const { limit, fromDate, toDate } = this.state
    this.setState({
      activePage: currentPage,
    })
    const value = {
      limit,
      activePage: currentPage,
      fromDate,
      toDate,
    }
    dispatch(getVendorCAByFilters(value, token))
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
    const { activePage } = this.state
    Promise.resolve(this.setState({ limit: pageSize, activePage: 1 })).then(() =>
      this.fetchTransactions(),
    )
    this.arrayPaginationCount(pageSize, activePage)
  }

  fetchTransactions = () => {
    const { dispatch, token } = this.props
    const { limit, activePage, vendorId } = this.state
    const value = {
      limit,
      activePage,
      vendorId,
    }

    dispatch(getVendorCAByFilters(value, token))
  }

  handleAddAccount = () => {
    const { dispatch } = this.props
    dispatch(showCurrencyListModal())
  }

  handleAddAccountCancel = () => {
    const { dispatch } = this.props
    dispatch(closeCurrencyListModal())
  }

  getCurrencyList = () => {
    const envBasedCurrencyList = this.getEnvBasedCurrencies(jsondata.currencyList)
    this.setState({ accountCurrencyList: envBasedCurrencyList, currencyList: envBasedCurrencyList })
  }

  getEnvBasedCurrencies = currencyList => {
    let envCurrencyList = []
    if (env.env === 'production') {
      envCurrencyList = currencyList.filter(item => item.title !== 'TST')
      return envCurrencyList
    }
    if (env.env === 'development' || env.env === 'test') {
      envCurrencyList = currencyList.filter(item => item.title !== 'USDT' && item.title !== 'USDC')
      return envCurrencyList
    }
    return envCurrencyList
  }

  // onChangeSelectClient = (name, id) => {
  //   const { dispatch, token } = this.props
  //   dispatch(getCurrencyAccountsofClient(id.key, token))
  //   dispatch(closeCurrencyListModal())

  //   this.setState({ clientName: id.props.label, clientId: id.key, accountCurrencyList: [] })
  // }

  handleCurrencySearch = e => {
    const { currencyList } = this.state
    let searchedData = []
    const searchedText = e.target.value
    if (searchedText !== '') {
      searchedData = currencyList.filter(data => {
        return (
          data.title.toLowerCase().includes(searchedText.toLowerCase()) ||
          data.subTitle.toLowerCase().includes(searchedText.toLowerCase())
        )
      })
      this.setState({ accountCurrencyList: searchedData })
    } else {
      this.setState({ accountCurrencyList: currencyList })
    }
  }

  handleSelectedCurrency = e => {
    this.setState({ currency: e.target.value })
  }

  confirmAddAccount = () => {
    const { dispatch, token } = this.props
    const { currency, vendorId } = this.state
    const value = {
      accountId: vendorId,
      currency,
    }
    dispatch(addVendorCAByCurrency(value, token))
  }

  handleRefresh = () => {
    Promise.resolve(
      this.setState({
        vendorId: undefined,
        activePage: 1,
        vendorName: undefined,
      }),
    ).then(() => {
      this.fetchTransactions()
    })
  }

  render() {
    const {
      vendorAccounts,
      vendors,
      CAlistLoading,
      totalPages,
      modalVisible,
      addCALoading,
    } = this.props
    const {
      columns,
      showClientIdFilter,
      vendorName,
      vendorId,
      fromNumber,
      toNumber,
      defaultCurrent,
      accountCurrencyList,
      currency,
      // dropDownOpen
    } = this.state
    const vendorOption = vendors.map(option => (
      <Option key={option.id} label={option.tradingName} value={option.id}>
        <h5>{option.tradingName}</h5>
        <small>{option.registeredCompanyName}</small>
      </Option>
    ))

    const menu = (
      <Menu>
        <Menu.Item onClick={this.handleAddAccount}>
          <Icon type="plus" />
          Add Account
        </Menu.Item>
      </Menu>
    )
    return (
      <div>
        <Card
          // loading={CAlistLoading}
          title={
            <div className={styles.headerBlock}>
              <div className="row">
                <div className="col-1 col-sm-1 col-md-1 col-lg-1">
                  <Icon
                    type="filter"
                    className={styles.filterIcon}
                    onClick={this.handleFilterIconClick}
                  />
                </div>
                {showClientIdFilter ? (
                  <div className="d-flex flex-row col-5 col-sm-4 col-md-4 col-lg-3">
                    <Select
                      showArrow={false}
                      className={styles.selectDropDown}
                      style={{ width: '100%', borderRadius: '9px' }}
                      showSearch
                      placeholder="Choose Vendor Name"
                      optionLabelProp="label"
                      value={vendorName}
                      onClick={() => this.handleSelectClick}
                      onSelect={(name, id) => this.onChangeSelectVendor(name, id)}
                      filterOption={(input, option) =>
                        option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {vendorOption}
                    </Select>
                    <div className={styles.selectCloseBtn}>
                      <Button
                        type="link"
                        icon={vendorName ? 'close' : 'caret-down'}
                        onClick={this.handleRefresh}
                        style={{ color: vendorName ? '#F43F54' : '#bbb1b1' }}
                      />
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {/* {clientId ? (
                  <div className="col-5 col-sm-6 col-md-5 col-lg-7">
                    <Icon type="sync" className={styles.refreshIcon} onClick={this.handleRefresh} />
                  </div>
                ) : (
                  ''
                )} */}
                {vendorId ? (
                  <div className="col-6 col-sm-7 col-md-7 col-lg-8">
                    <Dropdown overlay={menu} trigger={['click']}>
                      <Icon type="more" className={styles.moreIcon} />
                    </Dropdown>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          }
          bordered
          headStyle={{
            padding: '0',
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
        >
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={vendorAccounts}
            bordered={false}
            pagination={false}
            className={styles.tableBlock}
            loading={CAlistLoading}
          />
          <div className="pl-3 mt-4 mb-3">
            <Row>
              <Col
                xs={{ span: 12 }}
                md={{ span: 5 }}
                lg={{ span: 4 }}
                className={styles.totalPageBlock}
              >
                <span>
                  Show {fromNumber} to <b>{toNumber}</b> of <b>{totalPages}</b> entries
                </span>
              </Col>
              <Col xs={{ span: 12 }} md={{ span: 19 }} lg={{ span: 20 }}>
                <Pagination
                  className={styles.paginationTab}
                  onChange={this.handleTableChange}
                  showSizeChanger
                  defaultCurrent={defaultCurrent}
                  defaultPageSize={50}
                  pageSizeOptions={['10', '50', '100']}
                  onShowSizeChange={this.handlePageSizeChange}
                  total={totalPages}
                />
              </Col>
            </Row>
          </div>
        </Card>
        <div>
          <Modal
            visible={modalVisible}
            title={
              <div className="row">
                <div className="col-sm-1 col-lg-1">
                  <Icon
                    type="close"
                    onClick={this.handleAddAccountCancel}
                    style={{ float: 'left', marginTop: '3px' }}
                  />
                </div>
                <div className="col-sm-4 col-lg-5">
                  <span className={styles.modalTitle}>Add Account</span>
                </div>
                <div className="col-sm-24 col-lg-5">
                  <Input
                    placeholder="Searh Currency"
                    bordered={false}
                    className={styles.searchInput}
                    onChange={e => this.handleCurrencySearch(e)}
                    suffix={<SearchOutlined />}
                  />
                </div>
              </div>
            }
            footer={null}
            className={styles.modalBlock}
            closable={false}
            heigt="300px"
          >
            <Spin spinning={addCALoading}>
              <div className={styles.listDiv}>
                <List
                  className={styles.listBlock}
                  itemLayout="horizontal"
                  dataSource={accountCurrencyList}
                  renderItem={item => (
                    <List.Item className={styles.listItem}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={item.logo}
                            style={{ width: item.width, height: item.height, marginTop: '6px' }}
                          />
                        }
                        title={
                          <Popconfirm
                            placement="right"
                            title={`Do you want to create account for ${currency} ?`}
                            onConfirm={this.confirmAddAccount}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              className={styles.modaltitle}
                              type="link"
                              value={item.title}
                              onClick={e => this.handleSelectedCurrency(e)}
                            >
                              {item.title}
                            </Button>
                          </Popconfirm>
                        }
                        description={<div className={styles.subTitle}>{item.subTitle}</div>}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </Spin>
          </Modal>
        </div>
      </div>
    )
  }
}

export default AccountBalances
