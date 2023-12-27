import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Icon, Tooltip, Button, Dropdown, Menu } from 'antd'
import { getVendors } from 'redux/general/actions'
import { getAllBankAccounts, handleBankAccountFilters } from 'redux/bankAccounts/actions'
// import Excel from 'components/CleanUIComponents/Excel'
import FilterComponent from './filterComponent'
import TableComponent from './localBankAccountsList'
import { CardContainer } from './style'
import { ClearFilterOnComponentUnMount } from '../../utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ bankAccount, user }) => ({
  token: user.token,
  bankAccounts: bankAccount.bankAccounts,
  pagination: bankAccount.pagination,
  appliedFilters: bankAccount.appliedBankAccountFilters,
})

@connect(mapStateToProps)
class BankAccounts extends React.Component {
  state = {
    rowItem: {},
    selectedRowId: '',
    visibleFilter: false,
    // visibleSearch: false,
    filters: {},
  }

  componentDidMount() {
    const {
      token,
      dispatch,
      pagination: { current, pageSize },
      appliedFilters,
    } = this.props
    const values = {
      ...appliedFilters,
      page: current,
      limit: pageSize,
    }
    dispatch(getAllBankAccounts(values, token))
    dispatch(getVendors(token))
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
    const { history, dispatch } = this.props
    ClearFilterOnComponentUnMount(
      ['/view-account', '/edit-account'].includes(history.location.pathname.slice(0, 13))
        ? history.location.pathname.slice(0, 13)
        : history.location.pathname,
      handleBankAccountFilters,
      dispatch,
    )
  }

  onSelectRowItem = (selectedRowKeys, record) => {
    const { selectedRowId, rowItem } = this.state
    this.setState({
      rowItem: selectedRowKeys,
      selectedRowId: _.first(record).id,
    })
    console.log(record)
    console.log(rowItem)
    console.log(selectedRowId)
  }

  onDeleteBankAccount = () => {
    // const { dispatch } = this.props
    const { rowItem } = this.state
    console.log(rowItem)
  }

  navigateToNewBankAccount = () => {
    const { history } = this.props
    history.push('/add-bank-account')
  }

  redirectTo = () => {
    const { history } = this.props
    history.push('/bank-account')
  }

  showDrawer = () => {
    const { visibleFilter } = this.state
    this.setState({ visibleFilter: !visibleFilter })
  }

  onResetFilter = () => {
    this.setState({ filters: {} })
  }

  setFilters = filters => {
    this.setState({ filters })
  }

  render() {
    const { rowItem, visibleFilter } = this.state
    const { filters } = this.state

    const settingsMenu = (
      <Menu style={{ width: '250px' }}>
        <Menu.Item onClick={this.showDrawer}>
          <Icon type="filter" />
          <span className="pr-4"> Filter </span>
        </Menu.Item>
      </Menu>
    )

    return (
      <React.Fragment>
        <CardContainer
          title={
            <div>
              <span className="font-size-16">Local Deposit Bank Accounts</span>
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
                hidden={Object.entries(rowItem).length === 0 || Object.entries(rowItem).length > 1}
                type="primary"
                className="ml-3"
                onClick={this.onDeleteBankAccount}
              >
                Delete
                <Icon type="close" />
              </Button>
              <Button
                hidden={Object.entries(rowItem).length === 0 || Object.entries(rowItem).length < 2}
                type="primary"
                className="ml-3"
                onClick={this.onBulkDeleteTrades}
              >
                Bulk Delete
                <Icon type="close" />
              </Button>
              <Button type="primary" className="ml-3" onClick={this.navigateToNewBankAccount}>
                <Icon type="plus" />
                New Bank Account
              </Button>
              <Tooltip title="settings">
                <Dropdown overlay={settingsMenu} trigger={['click']}>
                  <Icon type="setting" className="m-3" />
                </Dropdown>
              </Tooltip>
            </div>
          }
        >
          <Helmet tittle="Bank-Acounts" />
          <div className={styles.block}>
            {visibleFilter && (
              <FilterComponent
                filters={filters}
                visibleFilter={visibleFilter}
                onReset={this.onResetFilter}
                onClose={this.showDrawer}
                setFilters={value => this.setFilters(value)}
              />
            )}
            <TableComponent filters={filters} redirectTo={this.redirectTo} />
          </div>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default BankAccounts
