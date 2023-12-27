import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import lodash from 'lodash'

import {
  Table,
  Pagination,
  Row,
  Col,
  Button,
  Card,
  Form,
  Tooltip,
  Icon,
  Select,
  Spin,
  Dropdown,
  Menu,
  Badge,
} from 'antd'
import {
  updateSelectedAccount,
  getAllPaymentsAccounts,
  updateSelectedType,
  getPaymentAccountsByFilters,
  updateSelectedFilters,
  getAllVendorClientVendorPlAccounts,
  setAccountsFilters,
} from 'redux/currencyAccounts/action'
import {
  getClients,
  getVendorsList,
  getCompaniesList,
  getBrands,
  getIntroducers,
} from 'redux/general/actions'
import { updateSelectedPaymentType } from 'redux/caTransactions/actions'
import {
  amountFormatter,
  getCompanyName,
  getName,
  getVendorsName,
  formatToZoneDate,
} from 'utilities/transformer'
import styles from './style.module.scss'
import data from './data.json'

const { Option } = Select

const mapStateToProps = ({ currencyAccounts, general, user, settings }) => ({
  timeZone: settings.timeZone.value,
  allPaymentsAccountsList: currencyAccounts.allPaymentsAccountsList,

  clients: general.clients,
  vendors: general.newVendors,
  companies: general.companies,
  introducers: general.introducers,

  token: user.token,
  listLoading: currencyAccounts.listLoading,
  totalAccountList: currencyAccounts.totalAccountList,
  addCALoading: currencyAccounts.addCALoading,
  selectedType: currencyAccounts.selectedType,
  selectedCurrencyData: currencyAccounts.selectedCurrencyData,
  currencies: general.newCurrencies,
  loading: currencyAccounts.loading,

  companiesListLoading: currencyAccounts.companiesListLoading,
  clientListloading: currencyAccounts.clientListloading,
  vendorListLoading: currencyAccounts.vendorListLoading,
  // currencyAccountsList: currencyAccounts.currencyAccountsList,
  accountsFilters: currencyAccounts.accountsFilters,
})

@withRouter
@Form.create()
@connect(mapStateToProps)
class AccountList extends Component {
  state = {
    columns: [],
    fromNumber: 1,
    toNumber: 50,
    activePage: 1,
    limit: 50,
    defaultCurrent: 1,
    visibleSearch: true,

    combinedClientsAndIntroducers: [],
  }

  componentDidMount() {
    const {
      dispatch,
      token,
      allPaymentsAccountsList,
      totalAccountList,
      accountsFilters,
    } = this.props
    const {
      selectedCurrency,
      selectedAccountType,
      selectedOnwerEntityId,
      selectedIssuerEntityId,
    } = accountsFilters
    const { limit, activePage } = this.state
    this.setTableColumns()
    this.setState({
      toNumber: totalAccountList < limit * activePage ? totalAccountList : limit * activePage,
    })
    if (
      selectedCurrency === undefined &&
      selectedAccountType === undefined &&
      selectedOnwerEntityId === undefined &&
      selectedIssuerEntityId === undefined
    ) {
      const payload = {
        limit,
        activePage,
        toNumber: allPaymentsAccountsList.length,
      }
      dispatch(getAllPaymentsAccounts(payload, token))
    } else {
      const payload = {
        limit,
        activePage,
        selectedCurrency,
        selectedAccountType,
        selectedOnwerEntityId,
        selectedIssuerEntityId,
      }
      dispatch(getPaymentAccountsByFilters(payload, token))
      this.setState({
        visibleSearch: false,
      })
    }
    dispatch(getAllVendorClientVendorPlAccounts(token))
    const type = 'client'
    dispatch(updateSelectedType(type))
    dispatch(getClients(token))
    dispatch(getIntroducers(token))
    dispatch(getVendorsList(token))
    dispatch(getCompaniesList(token))
    // dispatch(getProducts(token))
    dispatch(getBrands(token))
    this.updateToState()
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    const { limit, activePage } = this.state
    if (snapShot.isClientsUpdated) {
      this.updateToState()
    }
    if (snapShot.isAllPaymentAccountsListUpdated) {
      this.arrayPaginationCount(limit, activePage)
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { clients, introducers, totalAccountList } = this.props
    const isPropsUpdated = {
      isClientsUpdated: prevProps.clients !== clients || prevProps.introducers !== introducers,
      isAllPaymentAccountsListUpdated: prevProps.totalAccountList !== totalAccountList,
    }
    return isPropsUpdated
  }

  updateToState = () => {
    const { clients, introducers } = this.props
    const combinedClientsAndIntroducers = [...clients, ...introducers]
    this.setState({ combinedClientsAndIntroducers })
  }

  navigateToEditPaymentAccount = record => {
    const { history } = this.props

    switch (record.accountType) {
      case 'client':
        return history.push(`/edit-client-payment-account/${record.id}`)
      case 'pl':
        return history.push(`/edit-pl-payment-account/${record.id}`)
      case 'vendor_client':
        return history.push(`/edit-vendor-client-payment-account/${record.id}`)
      case 'vendor_pl':
        return history.push(`/edit-vendor-pl-payment-account/${record.id}`)
      case 'suspense':
        return history.push(`/edit-suspense-payment-account/${record.id}`)
      default:
        return ''
    }
  }

  getOwner = (type, ownerEntityId) => {
    const { companies } = this.props
    const { combinedClientsAndIntroducers } = this.state
    switch (type) {
      case 'client':
        return getName(combinedClientsAndIntroducers, ownerEntityId)
      case 'pl':
        return getCompanyName(companies, ownerEntityId)
      case 'vendor_client':
        return getCompanyName(companies, ownerEntityId)
      case 'vendor_pl':
        return getCompanyName(companies, ownerEntityId)
      case 'suspense':
        return getCompanyName(companies, ownerEntityId)
      default:
        return ''
    }
  }

  getIssuer = (type, issuerEntityId) => {
    const { companies, vendors } = this.props
    switch (type) {
      case 'client':
        return getCompanyName(companies, issuerEntityId)
      case 'pl':
        return getCompanyName(companies, issuerEntityId)
      case 'vendor_client':
        return getVendorsName(vendors, issuerEntityId)
      case 'vendor_pl':
        return getVendorsName(vendors, issuerEntityId)
      case 'suspense':
        return getCompanyName(companies, issuerEntityId)
      default:
        return ''
    }
  }

  setTableColumns = () => {
    const { timeZone } = this.props
    const columns = [
      {
        title: 'Created Date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Account Owner',
        dataIndex: 'ownerEntityId',
        key: 'ownerEntityId',
        align: 'center',
        render: (text, record) => this.getOwner(record.accountType, record.ownerEntityId),
      },
      {
        title: 'Account Issuer',
        dataIndex: 'issuerEntityId',
        key: 'issuerEntityId',
        align: 'center',
        render: (text, record) => this.getIssuer(record.accountType, record.issuerEntityId),
      },
      {
        title: 'Account Type',
        dataIndex: 'accountType',
        key: 'accountType',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Account',
        dataIndex: 'account',
        key: 'account',
        align: 'center',
        render: (text, record) => {
          let account
          if (record?.accountIdentification?.accountNumber) {
            account = record?.accountIdentification?.accountNumber
          } else if (record?.accountIdentification?.IBAN) {
            account = record?.accountIdentification?.IBAN
          } else {
            account = '---'
          }
          return account
        },
      },
      {
        title: 'Account Name',
        dataIndex: 'accountName',
        key: 'accountName',
        align: 'center',
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
      },

      {
        title: 'Currency Type',
        dataIndex: 'currencyType',
        key: 'currencyType',
        align: 'center',
        render: text => lodash.capitalize(text),
      },

      {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        align: 'center',
        render: (text, record) => (record.balance ? amountFormatter(record.balance.balance) : ' '),
      },
      {
        title: 'Status',
        dataIndex: 'accountStatus',
        key: 'accountStatus',
        align: 'center',
        render: text => lodash.capitalize(text),
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        fixed: 'right',
        render: record => (
          <>
            <Tooltip title="Edit Account Details">
              <Button onClick={() => this.navigateToEditPaymentAccount(record)} type="link">
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View Transaction Summary">
              <Button onClick={() => this.handleCASummary(record)} type="link">
                <Icon type="eye" />
              </Button>
            </Tooltip>
          </>
        ),
      },
    ]
    this.setState({ columns })
  }

  handleCASummary = record => {
    const { dispatch, history } = this.props
    const value = record
    dispatch(updateSelectedAccount(value))
    dispatch(updateSelectedPaymentType(''))
    history.push(`/account-balance/transactions-account-details/${value.id}`)
  }

  handleTableChange = currentPage => {
    const { dispatch, token, accountsFilters } = this.props
    const { limit } = this.state
    const {
      selectedAccountType,
      selectedCurrency,
      selectedOnwerEntityId,
      selectedIssuerEntityId,
    } = accountsFilters
    this.setState({
      activePage: currentPage,
    })
    const value = {
      limit,
      activePage: currentPage,
      selectedAccountType,
      selectedCurrency,
      selectedOnwerEntityId,
      selectedIssuerEntityId,
    }
    dispatch(getPaymentAccountsByFilters(value, token))
    this.arrayPaginationCount(limit, currentPage)
  }

  arrayPaginationCount = (limit, activePage) => {
    const { totalAccountList } = this.props
    const skip = (activePage - 1) * limit
    const fromNumb = skip + 1
    const toNumb = skip + limit
    this.setState({
      fromNumber: fromNumb,
      toNumber: activePage * limit > totalAccountList ? totalAccountList : toNumb,
    })
  }

  handlePageSizeChange = (current, pageSize) => {
    Promise.resolve(
      this.setState({
        limit: pageSize,
        activePage: 1,
      }),
    ).then(() => {
      const { activePage } = this.state
      this.fetchTransactions()
      this.arrayPaginationCount(pageSize, activePage)
    })
  }

  onClearFilters = () => {
    const { dispatch } = this.props
    Promise.resolve(
      dispatch(
        setAccountsFilters({
          selectedCurrency: undefined,
          selectedAccountType: undefined,
          selectedOnwerEntityId: undefined,
          selectedIssuerEntityId: undefined,
        }),
      ),
    )
      .then(() => {
        this.setState({
          limit: 50,
          activePage: 1,
          fromNumber: 1,
        })
      })
      .then(() => {
        this.fetchTransactions()
      })
  }

  fetchTransactions = () => {
    const { dispatch, token, accountsFilters } = this.props
    const { limit, activePage } = this.state
    const {
      selectedAccountType,
      selectedCurrency,
      selectedOnwerEntityId,
      selectedIssuerEntityId,
    } = accountsFilters
    const value = {
      limit,
      activePage,
      selectedAccountType,
      selectedCurrency,
      selectedOnwerEntityId,
      selectedIssuerEntityId,
    }
    dispatch(updateSelectedFilters(value, token))
    dispatch(getPaymentAccountsByFilters(value, token))
  }

  handleAddClientPaymentAccount = () => {
    const { history } = this.props
    history.push('/add-new-client-payment-account')
  }

  handleAddPlPaymentAccount = () => {
    const { history } = this.props
    history.push('/add-new-pl-payment-account')
  }

  handleAddVendorClientPaymentAccount = () => {
    const { history } = this.props
    history.push('/add-new-vendor-client-payment-account')
  }

  handleAddVendorPlPaymentAccount = () => {
    const { history } = this.props
    history.push('/add-new-vendor-pl-payment-account')
  }

  handleAddSuspensePaymentAccount = () => {
    const { history } = this.props
    history.push('/add-new-suspense-payment-account')
  }

  onChangeAccountType = value => {
    const { dispatch } = this.props
    Promise.resolve(
      dispatch(
        setAccountsFilters({
          selectedAccountType: value,
          selectedOnwerEntityId: undefined,
          selectedIssuerEntityId: undefined,
        }),
      ),
    ).then(() => {
      this.fetchTransactions()
    })
  }

  onChangeCurrencySelected = value => {
    const { dispatch } = this.props
    Promise.resolve(
      dispatch(
        setAccountsFilters({
          selectedCurrency: value,
        }),
      ),
    ).then(() => {
      this.fetchTransactions()
    })
  }

  getSearchUI = () => {
    const { currencies, accountsFilters } = this.props
    const { selectedAccountType, selectedCurrency } = accountsFilters
    const { visibleSearch } = this.state
    const accountTypes = data.accountTypes.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.code} label={option.code}>
        {option.code}
      </Option>
    ))
    return (
      <div hidden={visibleSearch} className={`${styles.data} mb-2 p-2`}>
        <div className="row">
          <div className="col-lg-3">
            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              optionLabelProp="label"
              className={styles.cstmSelectInput}
              placeholder="Please select account type"
              style={{ width: '100%' }}
              value={selectedAccountType}
              filterOption={(input, option) =>
                option.props.label
                  ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  : ''
              }
              onChange={(value, id) => this.onChangeAccountType(value, id)}
            >
              {accountTypes}
            </Select>
          </div>
          <div className="col-lg-3">
            <Select
              showSearch
              allowClear
              className={styles.cstmSelectInput}
              optionFilterProp="children"
              optionLabelProp="label"
              placeholder="please select account currency"
              style={{ width: '100%' }}
              value={selectedCurrency}
              filterOption={(input, option) =>
                option.props.label
                  ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  : ''
              }
              onChange={(value, id) => this.onChangeCurrencySelected(value, id)}
            >
              {currencyOption}
            </Select>
          </div>
          {selectedAccountType ? (
            <div className="col-md-6 col-lg-3">
              {this.getOwnerEntityDropDown(selectedAccountType)}
            </div>
          ) : (
            ''
          )}
          {selectedAccountType ? (
            <div className="col-md-6 col-lg-3">
              {this.getIssuerEntityDropDown(selectedAccountType)}
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

  onChangeAccountOwner = value => {
    const { dispatch } = this.props
    Promise.resolve(
      dispatch(
        setAccountsFilters({
          selectedOnwerEntityId: value,
        }),
      ),
    ).then(() => {
      this.fetchTransactions()
    })
  }

  onChangeAccountIssuer = value => {
    const { dispatch } = this.props
    Promise.resolve(
      dispatch(
        setAccountsFilters({
          selectedIssuerEntityId: value,
        }),
      ),
    ).then(() => {
      this.fetchTransactions()
    })
  }

  getOwnerEntityDropDown = type => {
    const { companies, accountsFilters } = this.props
    const { selectedOnwerEntityId } = accountsFilters
    const { combinedClientsAndIntroducers } = this.state
    const combinedClientsIntroducers = combinedClientsAndIntroducers.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))

    const companiesList = companies.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
        {/* <small>{option.registeredCompanyName}</small> */}
      </Option>
    ))

    switch (type) {
      case 'client':
        return (
          <Select
            showSearch
            allowClear
            style={{ width: '100%' }}
            optionFilterProp="children"
            value={selectedOnwerEntityId}
            optionLabelProp="label"
            placeholder="Please select account owner"
            className={styles.cstmSelectInput}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountOwner(value, id)}
          >
            {combinedClientsIntroducers}
          </Select>
        )

      case 'pl':
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            optionLabelProp="label"
            value={selectedOnwerEntityId}
            placeholder="Please select account owner"
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountOwner(value, id)}
          >
            {companiesList}
          </Select>
        )
      case 'vendor_client':
        return (
          <Select
            // showArrow={false}
            className={styles.cstmSelectInput}
            style={{ width: '100%' }}
            showSearch
            allowClear
            value={selectedOnwerEntityId}
            placeholder="Please select account owner"
            optionLabelProp="label"
            onClick={() => this.handleSelectClick}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountOwner(value, id)}
          >
            {companiesList}
          </Select>
        )

      case 'vendor_pl':
        return (
          <Select
            // showArrow={false}
            className={styles.selectDropDown}
            style={{ width: '100%' }}
            showSearch
            allowClear
            value={selectedOnwerEntityId}
            placeholder="Please select account owner"
            optionLabelProp="label"
            onClick={() => this.handleSelectClick}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountOwner(value, id)}
          >
            {companiesList}
          </Select>
        )
      case 'suspense':
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            optionLabelProp="label"
            value={selectedOnwerEntityId}
            placeholder="Please select account owner"
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountOwner(value, id)}
          >
            {companiesList}
          </Select>
        )
      default:
        return ''
    }
  }

  getIssuerEntityDropDown = type => {
    const { companies, vendors, accountsFilters } = this.props
    const { selectedIssuerEntityId } = accountsFilters
    // const { selectedIssuerEntityId } = this.state

    const vendorOption = vendors.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))

    const companiesList = companies.map(option => (
      <Option
        key={option.id}
        label={
          option.genericInformation
            ? option.genericInformation.registeredCompanyName
            : 'dummy record'
        }
        value={option.id}
      >
        {option.genericInformation
          ? option.genericInformation.registeredCompanyName
          : 'dummy record'}
      </Option>
    ))

    switch (type) {
      case 'client':
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            value={selectedIssuerEntityId}
            optionLabelProp="label"
            placeholder="Please select account issuer"
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountIssuer(value, id)}
          >
            {companiesList}
          </Select>
        )

      case 'pl':
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            optionLabelProp="label"
            value={selectedIssuerEntityId}
            placeholder="Please select account issuer"
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountIssuer(value, id)}
          >
            {companiesList}
          </Select>
        )

      case 'vendor_client':
        return (
          <Select
            // showArrow={false}
            className={styles.selectDropDown}
            style={{ width: '100%' }}
            showSearch
            allowClear
            value={selectedIssuerEntityId}
            placeholder="Please select account issuer"
            optionLabelProp="label"
            onClick={() => this.handleSelectClick}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountIssuer(value, id)}
          >
            {vendorOption}
          </Select>
        )
      case 'vendor_pl':
        return (
          <Select
            // showArrow={false}
            // className={styles.selectDropDown}
            style={{ width: '100%', borderRadius: '9px' }}
            showSearch
            allowClear
            value={selectedIssuerEntityId}
            placeholder="Please select account issuer"
            optionLabelProp="label"
            onClick={() => this.handleSelectClick}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountIssuer(value, id)}
          >
            {vendorOption}
          </Select>
        )

      case 'suspense':
        return (
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            optionLabelProp="label"
            value={selectedIssuerEntityId}
            placeholder="Please select account issuer"
            style={{ width: '100%' }}
            filterOption={(input, option) =>
              option.props.label
                ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                : ''
            }
            onChange={(value, id) => this.onChangeAccountIssuer(value, id)}
          >
            {companiesList}
          </Select>
        )
      default:
        return ''
    }
  }

  render() {
    const {
      allPaymentsAccountsList,
      listLoading,
      totalAccountList,
      companiesListLoading,
      clientListloading,
      vendorListLoading,
      accountsFilters,
    } = this.props
    const {
      selectedCurrency,
      selectedAccountType,
      selectedOnwerEntityId,
      selectedIssuerEntityId,
    } = accountsFilters
    const { columns, fromNumber, toNumber, defaultCurrent } = this.state
    const settingsMenu = (
      <Menu style={{ width: '250px' }}>
        <Menu.Item onClick={this.handleAddClientPaymentAccount}>
          <span className="pr-4"> Client Account </span>
        </Menu.Item>
        <Menu.Item onClick={this.handleAddPlPaymentAccount}>
          <span className="pr-4"> PL Account </span>
        </Menu.Item>
        <Menu.Item onClick={this.handleAddSuspensePaymentAccount}>
          <span className="pr-4"> Suspense Account </span>
        </Menu.Item>
        <Menu.Item onClick={this.handleAddVendorClientPaymentAccount}>
          <span className="pr-4"> Vendor Client Account </span>
        </Menu.Item>
        <Menu.Item onClick={this.handleAddVendorPlPaymentAccount}>
          <span className="pr-4"> Vendor PL Account </span>
        </Menu.Item>
      </Menu>
    )
    return (
      <Spin spinning={companiesListLoading || clientListloading || vendorListLoading}>
        <div>
          <Card
            title={
              <div>
                <span className="font-size-16">Accounts</span>
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
                <Tooltip title="Add A New Account">
                  <Dropdown overlay={settingsMenu} trigger={['click']}>
                    <Button type="primary" className="mr-3">
                      {' '}
                      Add A New Account{' '}
                    </Button>
                  </Dropdown>
                </Tooltip>
                <Tooltip title="filters">
                  <Badge
                    dot={
                      selectedCurrency !== undefined ||
                      selectedAccountType !== undefined ||
                      selectedOnwerEntityId !== undefined ||
                      selectedIssuerEntityId !== undefined
                    }
                  >
                    <Icon
                      type="filter"
                      onClick={() =>
                        this.setState(prevState => ({
                          visibleSearch: !prevState.visibleSearch,
                        }))
                      }
                    />
                  </Badge>
                </Tooltip>
              </div>
            }
          >
            <div>
              {this.getSearchUI()}
              <div className="row">
                <div className="col-xl-12">
                  <Table
                    loading={listLoading}
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={allPaymentsAccountsList}
                    bordered={false}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    className={styles.tableBlock}
                  />
                </div>
              </div>
              <div className="pl-3 mt-4 mb-3">
                <Row>
                  <Col
                    xs={{ span: 12 }}
                    md={{ span: 5 }}
                    lg={{ span: 4 }}
                    className={styles.totalPageBlock}
                  >
                    <span>
                      Show {fromNumber} to <b>{toNumber}</b> of <b>{totalAccountList}</b> entries
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
                      total={totalAccountList}
                      loading={listLoading}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        </div>
      </Spin>
    )
  }
}

export default AccountList
