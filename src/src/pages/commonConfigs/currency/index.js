import React, { Component } from 'react'
import { Card, Table, Icon, Tooltip, Button, Select, Form, Input } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Excel from 'components/CleanUIComponents/Excel'
import { sortTable } from 'utilities/transformer'
import { getAllCurrencies } from 'redux/general/actions'
import { updatedCurrencies, updateSelectedCurrency } from 'redux/currencies/actions'

import styles from './style.module.scss'

const { Search } = Input
const { Option } = Select

const mapStateToProps = ({ user, general, currencies }) => ({
  token: user.token,
  currencies: general.newCurrencies,
  dCurrencies: currencies.currencies,
  loading: currencies.loading,
})

@Form.create()
@connect(mapStateToProps)
class Currency extends Component {
  state = {
    visibleSearch: true,
    selectedCode: undefined,
    searchValue: undefined,
    allCurrencies: [],
    currencyCodeAndNames: [],
    pagination: {
      pageSize: 50,
    },
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    dispatch(getAllCurrencies(token))
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isCurrencyListUpdated) {
      this.updateState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { currencies } = this.props
    const isPropsUpdated = {
      isCurrencyListUpdated: prevProps.currencies !== currencies,
    }
    return isPropsUpdated
  }

  onClearSearch = () => {
    const { dispatch, currencies } = this.props
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
      selectedCode: undefined,
      searchValue: undefined,
    }))
    dispatch(updatedCurrencies(currencies))
  }

  updateState = () => {
    const { currencies } = this.props
    const result = []
    const map = new Map()
    if (currencies.length > 0) {
      currencies.map(item => {
        if (!map.has(item.code)) {
          map.set(item.code)
          result.push({
            code: item.code,
            name: item.name,
          })
        }
        return currencies
      })
    }
    this.setState({
      currencyCodeAndNames: result,
      allCurrencies: currencies,
    })
  }

  navigateToEditCurrency = record => {
    const { dispatch, history } = this.props
    history.push('/edit-currency')
    dispatch(updateSelectedCurrency(record))
  }

  navigateToViewCurrency = record => {
    const { dispatch, history } = this.props
    history.push('/view-currency')
    dispatch(updateSelectedCurrency(record))
  }

  handleSelectedCurrencyCode = value => {
    const { token, dispatch } = this.props
    if (!value) {
      dispatch(getAllCurrencies(token))
    } else {
      this.setState({ selectedCode: value })
      this.filterCurrencyCode(value)
    }
  }

  filterCurrencyCode = value => {
    const { dispatch, currencies } = this.props
    const searchCurrency = currencies.filter(item => item.code === value)
    dispatch(updatedCurrencies(searchCurrency))
  }

  searchCurrency = e => {
    const { value } = e.target
    const { dispatch, currencies } = this.props
    if (!value) {
      this.setState({ searchValue: undefined })
      dispatch(updatedCurrencies(currencies))
    } else {
      this.setState({ selectedCode: undefined, searchValue: value })
      this.filterCurrency(value)
    }
  }

  filterCurrency = value => {
    const { dispatch } = this.props
    const { allCurrencies } = this.state
    const searchCurrency = allCurrencies.filter(
      item => item.code && item.code.toLowerCase().indexOf(value.toLowerCase()) > -1,
    )
    if (searchCurrency.length === 0) {
      const searchName = allCurrencies.filter(
        item => item.name && item.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
      )
      dispatch(updatedCurrencies(searchName))
    } else {
      dispatch(updatedCurrencies(searchCurrency))
    }
  }

  getSearchUI = () => {
    const { visibleSearch, searchValue, selectedCode, currencyCodeAndNames } = this.state
    const currencyCodesOption = currencyCodeAndNames.map(option => (
      <Option key={option.code} value={option.code}>
        <h6>{option.code}</h6>
        <small>{option.name}</small>
      </Option>
    ))
    return (
      <div hidden={visibleSearch} className="mb-2 p-2">
        <Search
          placeholder="Search..."
          className="ml-4 mt-4 mb-3 mr-4"
          value={searchValue}
          onChange={this.searchCurrency}
          style={{ width: 250 }}
        />
        <Select
          showSearch
          style={{ width: 250 }}
          className="mt-4 mb-3 mr-4"
          optionLabelProp="value"
          placeholder="Select Currency"
          value={selectedCode}
          filterOption={(input, option) =>
            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={this.handleSelectedCurrencyCode}
        >
          {currencyCodesOption}
        </Select>
        <Button className="mt-4 mb-3 mr-4" type="primary" ghost onClick={this.onClearSearch}>
          Clear Search
        </Button>
      </div>
    )
  }

  downloadData = () => {
    const { dCurrencies } = this.props
    const data = []
    if (dCurrencies.length > 0) {
      dCurrencies.forEach(txn => {
        const txnData = []
        txnData.push(txn.name)
        txnData.push(txn.code)
        txnData.push(txn.currencyAccount)
        txnData.push(txn.deposits)
        txnData.push(txn.payments)
        txnData.push(txn.restrictedDeposits)
        data.push(txnData)
      })
      return data
    }
    return data
  }

  render() {
    const { loading, dCurrencies } = this.props
    const { pagination } = this.state
    const columns = [
      {
        title: 'Currency Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: 'Currency Code',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
      },
      {
        title: 'Currency Account',
        dataIndex: 'currencyAccount',
        key: 'currencyAccount',
        align: 'center',
      },
      {
        title: 'Deposits',
        dataIndex: 'deposits',
        key: 'deposits',
        align: 'center',
      },
      {
        title: 'Payments',
        dataIndex: 'payments',
        key: 'payments',
        align: 'center',
      },
      {
        title: 'Restricted Deposits',
        dataIndex: 'restrictedDeposits',
        key: 'restrictedDeposits',
        align: 'center',
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        fixed: 'right',
        render: record => (
          <>
            <Tooltip title="Edit">
              <Button onClick={() => this.navigateToEditCurrency(record)} type="link">
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button onClick={() => this.navigateToViewCurrency(record)} type="link">
                <Icon type="eye" />
              </Button>
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
              <span className="font-size-16">Currencies List</span>
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
              <Tooltip title="Serach">
                <Icon
                  type="search"
                  className="mr-3"
                  onClick={() =>
                    this.setState(prevState => ({
                      visibleSearch: !prevState.visibleSearch,
                    }))
                  }
                />
              </Tooltip>
              <Excel
                columns={[
                  'Currency Name',
                  'Currency Code',
                  'Currency Account',
                  'Payments',
                  'Deposits',
                  'Restricted Deposits',
                ]}
                data={this.downloadData()}
                fileName="Currency"
                isIconOnly
              />
            </div>
          }
        >
          <Helmet title="Currency" />
          <div className={styles.data}>
            {this.getSearchUI()}
            <div className="row">
              <div className="col-xl-12">
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  loading={loading}
                  dataSource={dCurrencies.sort(sortTable)}
                  scroll={{ x: 'max-content' }}
                  pagination={pagination}
                  onChange={this.handleTableChange}
                />
              </div>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default Currency
