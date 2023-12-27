import React, { Component } from 'react'
import { Card, Table, Icon, Tooltip, Button, Select, Form, Input } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Excel from 'components/CleanUIComponents/Excel'
import { sortTable } from 'utilities/transformer'
import { getAllCountries } from 'redux/general/actions'
import { updatedCountries, updateSelectedCountry } from 'redux/currencies/actions'

import styles from './style.module.scss'

const { Search } = Input
const { Option } = Select

const mapStateToProps = ({ user, general, currencies }) => ({
  token: user.token,
  countries: general.countries,
  dcountries: currencies.countries,
  loading: currencies.loading,
})

@Form.create()
@connect(mapStateToProps)
class Country extends Component {
  state = {
    visibleSearch: true,
    selectedAlph3Code: undefined,
    searchValue: undefined,
    allCountries: [],
    countryCodeAndNames: [],
    pagination: {
      pageSize: 50,
    },
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    dispatch(getAllCountries(token))
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isCountryListUpdated) {
      this.updateState()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { countries } = this.props
    const isPropsUpdated = {
      isCountryListUpdated: prevProps.countries !== countries,
    }
    return isPropsUpdated
  }

  updateState = () => {
    const { countries } = this.props
    const result = []
    const map = new Map()
    if (countries.length > 0) {
      countries.map(item => {
        if (!map.has(item.alpha3Code)) {
          map.set(item.alpha3Code)
          result.push({
            code: item.alpha3Code,
            name: item.name,
          })
        }
        return countries
      })
    }
    this.setState({
      countryCodeAndNames: result,
      allCountries: countries,
    })
  }

  onClearSearch = () => {
    const { dispatch, countries } = this.props
    this.setState(prevState => ({
      visibleSearch: !prevState.visibleSearch,
      selectedAlph3Code: undefined,
      searchValue: undefined,
    }))
    dispatch(updatedCountries(countries))
  }

  navigateToEditCountry = record => {
    const { dispatch, history } = this.props
    history.push('/edit-country')
    dispatch(updateSelectedCountry(record))
  }

  navigateToViewCountry = record => {
    const { dispatch, history } = this.props
    history.push('/view-country')
    dispatch(updateSelectedCountry(record))
  }

  searchCountry = e => {
    const { value } = e.target
    const { dispatch, countries } = this.props
    if (!value) {
      this.setState({ searchValue: undefined })
      dispatch(updatedCountries(countries))
    } else {
      this.setState({ selectedAlph3Code: undefined, searchValue: value })
      this.SearchCountryCodeOrName(value)
    }
  }

  SearchCountryCodeOrName = value => {
    const { dispatch } = this.props
    const { allCountries } = this.state
    let searchName
    const searchCurrency = allCountries.filter(
      item => item.alpha3Code && item.alpha3Code.toLowerCase().indexOf(value.toLowerCase()) > -1,
    )
    if (searchCurrency.length === 0) {
      searchName = allCountries.filter(
        item => item.name && item.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
      )
      if (searchName.length === 0) {
        searchName = allCountries.filter(
          item =>
            item.riskCategory && item.riskCategory.toLowerCase().indexOf(value.toLowerCase()) > -1,
        )
      }
      dispatch(updatedCountries(searchName))
    } else {
      dispatch(updatedCountries(searchCurrency))
    }
  }

  handleSelectedCountry = value => {
    const { dispatch } = this.props
    const { allCurrencies } = this.state
    if (!value) {
      dispatch(getAllCountries(allCurrencies))
    } else {
      this.setState({ selectedAlph3Code: value })
      this.filterCountryCode(value)
    }
  }

  filterCountryCode = value => {
    const { dispatch, countries } = this.props
    const searchCountry = countries.filter(item => item.alpha3Code === value)
    dispatch(updatedCountries(searchCountry))
  }

  getSearchUI = () => {
    const { selectedAlph3Code, searchValue, visibleSearch, countryCodeAndNames } = this.state
    const countryNamesOption = countryCodeAndNames.map(option => (
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
          onChange={this.searchCountry}
          style={{ width: 250 }}
        />
        <Select
          showSearch
          style={{ width: 250 }}
          className="mt-4 mb-3 mr-4"
          optionLabelProp="value"
          placeholder="Select Country"
          value={selectedAlph3Code}
          filterOption={(input, option) =>
            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={this.handleSelectedCountry}
        >
          {countryNamesOption}
        </Select>
        <Button className="mt-4 mb-3 mr-4" type="primary" ghost onClick={this.onClearSearch}>
          Clear Search
        </Button>
      </div>
    )
  }

  formatNamingConvention = key => {
    let returnResp
    switch (key) {
      case 'high':
        returnResp = 'High'
        break
      case 'medium':
        returnResp = 'Medium'
        break
      case 'low':
        returnResp = 'Low'
        break
      case 'prohibited':
        returnResp = 'Prohibited'
        break
      default:
        break
    }
    return returnResp
  }

  downloadData = () => {
    const { dcountries } = this.props
    const data = []
    if (dcountries.length > 0) {
      dcountries.forEach(txn => {
        const txnData = []
        txnData.push(txn.name)
        txnData.push(txn.alpha2Code)
        txnData.push(txn.alpha3Code)
        txnData.push(txn.numericCode)
        txnData.push(txn.telephonePrefix)
        txnData.push(txn.deposits)
        txnData.push(txn.fiatCurrency)
        txnData.push(txn.payments)
        txnData.push(txn.riskCategory && this.formatNamingConvention(txn.riskCategory))
        txnData.push(txn.residency)
        txnData.push(txn.sanction)
        data.push(txnData)
      })
      return data
    }
    return data
  }

  render() {
    const { loading, dcountries } = this.props
    const { pagination } = this.state
    const columns = [
      {
        title: 'Country Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 180,
        fixed: 'left',
      },
      {
        title: 'Alpha-2 Code',
        dataIndex: 'alpha2Code',
        key: 'alpha2Code',
        align: 'center',
        width: 120,
        fixed: 'left',
      },
      {
        title: 'Alpha-3 Code',
        dataIndex: 'alpha3Code',
        key: 'alpha3Code',
        align: 'center',
        width: 120,
        fixed: 'left',
      },
      {
        title: 'Numeric Code',
        dataIndex: 'numericCode',
        key: 'numericCode',
        align: 'center',
        width: 120,
      },
      {
        title: 'Telephone Prefix',
        dataIndex: 'telephonePrefix',
        key: 'telephonePrefix',
        align: 'center',
        width: 120,
      },
      {
        title: 'Deposits',
        dataIndex: 'deposits',
        key: 'deposits',
        align: 'center',
        width: 120,
      },
      {
        title: 'Fiat Currency',
        dataIndex: 'fiatCurrency',
        key: 'fiatCurrency',
        align: 'center',
        width: 120,
      },
      {
        title: 'Payments',
        dataIndex: 'payments',
        key: 'payments',
        align: 'center',
        width: 120,
      },
      {
        title: 'Risk Category',
        dataIndex: 'riskCategory',
        key: 'riskCategory',
        align: 'center',
        width: 120,
        render: record => {
          if (record === 'high') {
            return <div style={{ color: '#FF0400', fontWeight: 500 }}>High</div>
          }
          if (record === 'medium') {
            return <div style={{ color: '#c78e6c', fontWeight: 500 }}>Medium</div>
          }
          if (record === 'low') {
            return <div style={{ color: '#92D050', fontWeight: 500 }}>Low</div>
          }
          if (record === 'prohibited') {
            return <div style={{ color: '#646576', fontWeight: 500 }}>Prohibited</div>
          }
          return record
        },
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
              <Button onClick={() => this.navigateToEditCountry(record)} type="link">
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button onClick={() => this.navigateToViewCountry(record)} type="link">
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
              <span className="font-size-16">Countries List</span>
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
                  'Country Name',
                  'Alpha-2 Code',
                  'Alpha-3 Code',
                  'Numeric Code',
                  'Telephone Prefix',
                  'Deposits',
                  'Fiat Currency',
                  'Payments',
                  'Risk Category',
                  'Residency',
                ]}
                data={this.downloadData()}
                fileName="Country"
                isIconOnly
              />
            </div>
          }
        >
          <Helmet title="Country" />
          <div className={styles.data}>
            {this.getSearchUI()}
            <div className="row">
              <div className="col-xl-12">
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  loading={loading}
                  dataSource={dcountries.sort(sortTable)}
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

export default Country
