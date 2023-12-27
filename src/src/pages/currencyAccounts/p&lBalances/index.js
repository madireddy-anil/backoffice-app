import React, { Component } from 'react'
// import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import { SearchOutlined } from '@ant-design/icons'
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
  // Menu,
  // Dropdown,
  Modal,
  Input,
  // List,
  // Avatar,
  Spin,
  Form,
  // Popconfirm,
} from 'antd'
import {
  getAllplAccounts,
  getAllplAccountsByFilters,
  showCurrencyListModal,
  closeCurrencyListModal,
  addPLCAByCurrency,
  updateSelectedAccount,
  updateSelectedType,
  updateSelectedCurrencyData,
} from 'redux/currencyAccounts/action'
import InfoCard from 'components/customComponents/InfoCard'
import { updateSelectedPaymentType } from 'redux/caTransactions/actions'
import { amountFormatter, getProductName } from 'utilities/transformer'
import jsondata from './data.json'
import styles from './style.module.scss'

const { Option } = Select
const { Meta } = Card
const gbpRegex = '[A-Z]{2,2}[0-9]{2,2}[a-zA-Z0-9]{1,30}$'
const otherCurrenciesRegex = '^[0-9]{1,32}$'

const mapStateToProps = ({ currencyAccounts, user }) => ({
  plAccounts: currencyAccounts.plAccounts,
  token: user.token,
  CAlistLoading: currencyAccounts.CAlistLoading,
  totalPages: currencyAccounts.totalPages,
  modalVisible: currencyAccounts.modalVisible,
  addCALoading: currencyAccounts.addCALoading,
  selectedType: currencyAccounts.selectedType,
  selectedCurrencyData: currencyAccounts.selectedCurrencyData,
  // plAccounts: currencyAccounts.plAccounts,
})

@withRouter
@Form.create()
@connect(mapStateToProps)
class AccountBalances extends Component {
  state = {
    columns: [],
    showClientIdFilter: true,
    unUsedValues: false,
    fromNumber: 1,
    toNumber: 50,
    // pageSize: 10,
    activePage: 1,
    limit: 50,
    defaultCurrent: 1,

    accountCurrencyList: [],
    currencyList: [],
    currency: undefined,
    searchedAccountNum: undefined,
    accountNumber: undefined,
    selectedCurrency: undefined,

    regexp: otherCurrenciesRegex,
  }

  componentDidMount() {
    const { dispatch, token, plAccounts } = this.props
    const { limit, activePage } = this.state
    this.setTableColumns()
    const value = {
      limit,
      activePage,
      toNumber: plAccounts.length,
    }
    dispatch(getAllplAccounts(value, token))
    const type = 'pl'
    dispatch(updateSelectedType(type))
  }

  componentDidUpdate(prevProps) {
    const { plAccounts } = this.props

    if (prevProps.plAccounts !== plAccounts) {
      this.updateSelectedAccountTostate()
    }
  }

  updateSelectedAccountTostate = () => {
    this.getCurrencyList()
  }

  setTableColumns = () => {
    const columns = [
      {
        title: 'IBAN',
        dataIndex: 'externalAccountNumber',
        key: 'externalAccountNumber',
        align: 'center',
        // onCell: record => ({
        //   onClick: () => {
        //     this.handleCASummary(record)
        //   },
        // }),
        render: text => (text ? <Button type="link">{text}</Button> : ''),
      },
      {
        title: 'Account Number',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
        align: 'center',
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
      },
      {
        title: 'Product',
        dataIndex: 'product',
        key: 'product',
        align: 'center',
        render: text => (text ? getProductName(jsondata.products, text) : ''),
      },
      {
        title: 'Type',
        dataIndex: 'accountType',
        key: 'accountType',
        align: 'center',
        render: text => lodash.capitalize(text),
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
    history.push(`/p&l-balance/transactions-account-details/${value.id}`)
  }

  handleFilterIconClick = () => {
    this.setState({ showClientIdFilter: true })
  }

  onChangeSelectFilter = (name, id) => {
    const { unUsedValues } = this.state
    if (unUsedValues) {
      console.log(name)
    }
    Promise.resolve(
      this.setState({
        searchedAccountNum: id.props.label,
        activePage: 1,
      }),
    ).then(() => {
      this.fetchTransactions()
      this.getCurrencyList()
    })
  }

  handleRemoveFilter = () => {
    Promise.resolve(
      this.setState({ searchedAccountNum: undefined, showClientIdFilter: true }),
    ).then(() => {
      this.fetchTransactions()
    })
  }

  handleTableChange = currentPage => {
    const { dispatch, token } = this.props
    const { limit, fromDate, toDate, searchedAccountNum } = this.state
    this.setState({
      activePage: currentPage,
    })
    const value = {
      limit,
      activePage: currentPage,
      fromDate,
      toDate,
      searchedAccountNum,
    }
    dispatch(getAllplAccountsByFilters(value, token))
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
    Promise.resolve(this.setState({ limit: pageSize, activePage: 1 })).then(() => {
      const { activePage } = this.state
      this.fetchTransactions()
      this.arrayPaginationCount(pageSize, activePage)
    })
  }

  fetchTransactions = () => {
    const { dispatch, token } = this.props
    const { limit, activePage, searchedAccountNum } = this.state
    const value = {
      limit,
      activePage,
      searchedAccountNum,
    }
    dispatch(getAllplAccountsByFilters(value, token))
  }

  handleAddAccount = () => {
    const { dispatch } = this.props
    this.setState({ selectedCurrency: undefined })
    dispatch(showCurrencyListModal())
  }

  handleAddAccountCancel = () => {
    const emObj = {}
    this.setState({ selectedCurrency: undefined })
    const { dispatch } = this.props
    dispatch(closeCurrencyListModal())
    dispatch(updateSelectedCurrencyData(emObj))
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

  getAccountNumber = e => {
    this.setState({ accountNumber: e.target.value })
  }

  handleCurrency = e => {
    const { dispatch, form } = this.props
    this.setState({ selectedCurrency: e, regexp: e === 'GBP' ? gbpRegex : otherCurrenciesRegex })
    form.setFieldsValue({ accountNumber: undefined })
    const selectedCurrencyData = jsondata.currencyList.filter(item => item.title === e)
    dispatch(updateSelectedCurrencyData(selectedCurrencyData[0]))
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, selectedType } = this.props
    const { selectedCurrency } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        values.type = selectedType
        values.currency = selectedCurrency
        dispatch(addPLCAByCurrency(values, token))
      }
    })
  }

  confirmAddAccount = () => {
    const { dispatch, token, selectedType } = this.props
    const { currency, accountNumber } = this.state
    const value = {
      currency,
      type: selectedType,
      accountNumber,
    }
    dispatch(addPLCAByCurrency(value, token))
  }

  handleRefresh = () => {
    Promise.resolve(
      this.setState({
        searchedAccountNum: undefined,
        activePage: 1,
      }),
    ).then(() => {
      this.fetchTransactions()
    })
  }

  handleUnSelectCurrency = () => {
    this.setState({ selectedCurrency: undefined })
  }

  render() {
    const {
      plAccounts,
      CAlistLoading,
      totalPages,
      modalVisible,
      addCALoading,
      selectedCurrencyData,
      form,
    } = this.props
    const {
      columns,
      showClientIdFilter,
      // clientId,
      fromNumber,
      toNumber,
      defaultCurrent,
      accountCurrencyList,
      // currency,
      searchedAccountNum,
      selectedCurrency,
      regexp,
    } = this.state
    const clientOption = plAccounts.map(option => (
      <Option key={option.id} label={option.accountNumber} value={option.id}>
        <h5>{option.accountNumber}</h5>
        <small>{option.currency}</small>
      </Option>
    ))

    const options = accountCurrencyList.map(option => (
      <Option key={option.title} label={option.title} value={option.title}>
        <h5>{option.title}</h5>
        <small>{option.subTitle}</small>
      </Option>
    ))

    const productOptions = jsondata.products.map(option => (
      <Option key={option.title} label={option.title} value={option.value}>
        <h5>{option.title}</h5>
      </Option>
    ))
    // const menu = (
    //   <Menu>
    //     <Menu.Item onClick={this.handleAddAccount}>
    //       <Icon type="plus" />
    //       Add Account
    //     </Menu.Item>
    //   </Menu>
    // )
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
                      className={styles.selectDropDown}
                      style={{ width: '100%', borderRadius: '9px' }}
                      showSearch
                      placeholder="Choose account"
                      optionLabelProp="label"
                      value={searchedAccountNum}
                      onSelect={(name, id) => this.onChangeSelectFilter(name, id)}
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                      allowClear
                      clearIcon={
                        <div className={styles.selectCloseBtn}>
                          <Button
                            type="link"
                            icon="close"
                            onClick={this.handleRefresh}
                            style={{ color: searchedAccountNum ? '#F43F54' : '#bbb1b1' }}
                          />
                        </div>
                      }
                    >
                      {clientOption}
                    </Select>
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

                {/* {clientId ? (
                  <div className="col-6 col-sm-7 col-md-7 col-lg-8">
                    <Dropdown overlay={menu} trigger={['click']}>
                      <Icon type="more" className={styles.moreIcon} />
                    </Dropdown>
                  </div>
                ) : (
                  ''
                )} */}
                {searchedAccountNum ? (
                  ''
                ) : (
                  <div className="col-6 col-sm-7 col-md-7 col-lg-8">
                    <Button
                      type="primary"
                      icon="plus"
                      className={styles.addAcccountBtn}
                      onClick={this.handleAddAccount}
                    >
                      Add Account
                    </Button>
                  </div>
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
          // extra={
          //   <Button type="primary" icon="plus">
          //     Add Account
          //   </Button>
          // }
        >
          <Table
            loading={CAlistLoading}
            rowKey={record => record.id}
            columns={columns}
            dataSource={plAccounts}
            bordered={false}
            pagination={false}
            className={styles.tableBlock}
            onRow={record => {
              return {
                onClick: () => this.handleCASummary(record), // click row
              }
            }}
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
              <div className={styles.modalHeader}>
                <InfoCard
                  minHeight="80px"
                  imgHeight="100px"
                  imgTop="43%"
                  header="Add Account"
                  closeButton={this.handleAddAccountCancel}
                />
              </div>
            }
            footer={null}
            className={styles.modalBlock}
            closable={false}
          >
            <Spin spinning={addCALoading}>
              <div>
                {/* <List
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
                            // title={`Do you want to create account for ${currency} ?`}
                            title={
                              <div>
                                <span>Please enter Account Number/IBAN to proceed !</span>
                                <div className={styles.ibanBlock}>
                                  <Input onChange={e=>this.getAccountNumber(e)} />
                                </div>
                              </div>
                            }
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
                /><
                 */}
                <Form layout="vertical" onSubmit={this.onSubmit}>
                  <div className="row">
                    <div className="col-md-6 col-lg-12">
                      <Form.Item label="Product : " hasFeedback>
                        {form.getFieldDecorator('product', {
                          rules: [{ required: true, message: 'Please select product' }],
                        })(
                          <Select
                            style={{ width: '100%' }}
                            optionLabelProp="label"
                            className={styles.cstmSelectInput}
                            placeholder="select product"
                            // onChange={this.handleCurrency}
                            showSearch
                          >
                            {productOptions}
                          </Select>,
                        )}
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row">
                    {selectedCurrency ? (
                      <div className="col-md-6 col-lg-12">
                        <Card
                          // closable={true}
                          bodyStyle={{
                            padding: '10px',
                            borderRadius: '5px',
                          }}
                          className={styles.cardBlock}
                          // extra={<a href="#">More</a>}
                        >
                          <Meta
                            avatar={
                              <img
                                src={selectedCurrencyData.logo}
                                height="70px"
                                width="70px"
                                alt=""
                                className={styles.iconBlock}
                              />
                            }
                            title={
                              <div className="row">
                                <div className={`col-lg-10 ${styles.title}`}>
                                  {selectedCurrencyData.title}
                                </div>
                                <div className="col-lg-2">
                                  <Icon
                                    type="close"
                                    className={styles.closeBtn}
                                    onClick={this.handleUnSelectCurrency}
                                  />
                                </div>
                              </div>
                            }
                            description={selectedCurrencyData.subTitle}
                          />
                        </Card>
                      </div>
                    ) : (
                      <div className="col-md-6 col-lg-12">
                        <Form.Item label="Currency : " hasFeedback>
                          {form.getFieldDecorator('currency', {
                            rules: [{ required: true, message: 'Please input currency' }],
                          })(
                            <Select
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              className={styles.cstmSelectInput}
                              placeholder="select currency"
                              onChange={this.handleCurrency}
                              showSearch
                            >
                              {options}
                            </Select>,
                          )}
                        </Form.Item>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-lg-12">
                      <Form.Item label="Account Number/ IBAN : " hasFeedback>
                        {form.getFieldDecorator('accountNumber', {
                          rules: [
                            {
                              pattern: new RegExp(regexp),
                              message: 'Invalid Account Number/ IBAN',
                            },
                          ],
                        })(<Input />)}
                      </Form.Item>
                    </div>
                  </div>
                  <div className={styles.btnStyles}>
                    <Button className={styles.btnCANCEL} onClick={this.handleAddAccountCancel}>
                      Cancel
                    </Button>
                    <Button className={styles.btnSAVE} loading={addCALoading} htmlType="submit">
                      Create
                    </Button>
                  </div>
                </Form>
              </div>
            </Spin>
          </Modal>
        </div>
      </div>
    )
  }
}

export default AccountBalances
