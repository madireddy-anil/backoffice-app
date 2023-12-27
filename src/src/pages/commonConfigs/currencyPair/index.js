import React, { Component } from 'react'
import { Card, Table, Icon, Tooltip, Button, Form, Input, Popconfirm } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import moment from 'moment'
// import Excel from 'components/CleanUIComponents/Excel'
// import { sortTable } from 'utilities/transformer'
import { getAllCurrencyPairs } from 'redux/general/actions'
import {
  updatedCurrencyPair,
  updateSelectedCurrencyPair,
  deleteSelectedCurrencyPair,
} from 'redux/currencyPairs/action'

import styles from './style.module.scss'

const { Search } = Input
// const { Option } = Select

const mapStateToProps = ({ user, general, currencyPairs }) => ({
  token: user.token,
  vendorCurrencyPairs: general.vendorCurrencyPairs,
  currencyPairs: currencyPairs.vendorCurrencyPairs,
  loading: currencyPairs.loading,
})

@Form.create()
@connect(mapStateToProps)
class Currency extends Component {
  state = {
    visibleSearch: true,
    // selectedCode: undefined,
    searchValue: undefined,
    allCurrenciesPairs: [],
    // currencyCodeAndNames: [],
    pagination: {
      pageSize: 50,
    },
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    dispatch(getAllCurrencyPairs(token))
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isCurrencyPairListUpdated) {
      this.updateState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { vendorCurrencyPairs } = this.props
    const isPropsUpdated = {
      isCurrencyPairListUpdated: prevProps.vendorCurrencyPairs !== vendorCurrencyPairs,
    }
    return isPropsUpdated
  }

  onClearSearch = () => {
    const { dispatch, vendorCurrencyPairs } = this.props
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
      //   selectedCode: undefined,
      searchValue: undefined,
    }))
    dispatch(updatedCurrencyPair(vendorCurrencyPairs))
  }

  updateState = () => {
    const { vendorCurrencyPairs } = this.props
    const result = []
    const map = new Map()
    if (vendorCurrencyPairs.length > 0) {
      vendorCurrencyPairs.map(item => {
        if (!map.has(item.code)) {
          map.set(item.code)
          result.push({
            buyCurrency: item.buyCurrency,
            sellCurrency: item.sellCurrency,
          })
        }
        return vendorCurrencyPairs
      })
    }
    this.setState({
      //   currencyCodeAndNames: result,
      allCurrenciesPairs: vendorCurrencyPairs,
    })
  }

  navigateToEditCurrency = record => {
    const { dispatch, history } = this.props
    history.push('/edit-currency-pair')
    dispatch(updateSelectedCurrencyPair(record))
  }

  navigateToViewCurrency = record => {
    const { dispatch, history } = this.props
    history.push('/view-currency-pair')
    dispatch(updateSelectedCurrencyPair(record))
  }

  searchCurrency = e => {
    const { value } = e.target
    const { dispatch, vendorCurrencyPairs } = this.props
    if (!value) {
      this.setState({ searchValue: undefined })
      dispatch(updatedCurrencyPair(vendorCurrencyPairs))
    } else {
      this.setState({ searchValue: value })
      this.filterCurrency(value)
    }
  }

  filterCurrency = value => {
    const { dispatch } = this.props
    const { allCurrenciesPairs } = this.state
    const searchCurrency = allCurrenciesPairs.filter(
      item => item.buyCurrency && item.buyCurrency.toLowerCase().indexOf(value.toLowerCase()) > -1,
    )
    if (searchCurrency.length === 0) {
      const searchName = allCurrenciesPairs.filter(
        item =>
          item.sellCurrency && item.sellCurrency.toLowerCase().indexOf(value.toLowerCase()) > -1,
      )
      dispatch(updatedCurrencyPair(searchName))
    } else {
      dispatch(updatedCurrencyPair(searchCurrency))
    }
  }

  getSearchUI = () => {
    const { visibleSearch, searchValue } = this.state

    return (
      <div hidden={visibleSearch} className="mb-2 p-2">
        <Search
          placeholder="Search..."
          className="ml-4 mt-4 mb-3 mr-4"
          value={searchValue}
          onChange={this.searchCurrency}
          style={{ width: 250 }}
        />
        <Button className="mt-4 mb-3 mr-4" type="primary" ghost onClick={this.onClearSearch}>
          Clear Search
        </Button>
      </div>
    )
  }

  handleAddCurrencyPair = () => {
    const { history } = this.props
    history.push('/new-currency-pair')
  }

  handleDeletedCurrencyPair = record => {
    const { dispatch, token } = this.props
    dispatch(deleteSelectedCurrencyPair(record.id, token))
  }

  render() {
    const { loading, currencyPairs } = this.props
    const { pagination } = this.state
    const popConfirmtext = 'Are you sure to delete this record?'
    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: text => <a>{moment(text, 'YYY-MM-DD').format('DD-MM-YY HH:MM:SS')}</a>,
      },
      {
        title: 'Vendor',
        dataIndex: 'vendor',
        key: 'vendor',
        align: 'center',
      },
      {
        title: 'Buy Currency',
        dataIndex: 'buyCurrency',
        key: 'buyCurrency',
        align: 'center',
      },
      {
        title: 'Sell Currency',
        dataIndex: 'sellCurrency',
        key: 'sellCurrency',
        align: 'center',
      },
      {
        title: 'Trading Hours',
        dataIndex: 'allowedTradingTimes',
        key: 'allowedTradingTimes',
        align: 'center',
        render: text => <a>{`${text.start} to ${text.end}`}</a>,
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
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletedCurrencyPair(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" style={{ color: 'red' }}>
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Vendor Currency Pairs</span>
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
              <Tooltip title="Add New Currency Pair">
                <Icon type="plus" className="mr-3" onClick={this.handleAddCurrencyPair} />
              </Tooltip>
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
                  dataSource={currencyPairs}
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
