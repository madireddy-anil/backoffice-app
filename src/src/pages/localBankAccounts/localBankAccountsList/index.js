import React from 'react'
import { Table, Tooltip, Button, Icon, Skeleton } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { getAllBankAccounts, handlePagination } from 'redux/bankAccounts/actions'
import { formatToZoneDateOnly, formatToZoneDate } from '../../../utilities/transformer'

const mapStateToProps = ({ user, bankAccount, general, settings }) => ({
  bankAccounts: bankAccount.allBankAccounts,
  token: user.token,
  isBankAccountUpdated: bankAccount.isBankAccountUpdated,
  bankAccountLoading: bankAccount.bankAccountLoading,
  pagination: bankAccount.pagination,
  vendors: general.newVendors,
  timeZone: settings.timeZone.value,
  appliedFilters: bankAccount.appliedBankAccountFilters,
})

@connect(mapStateToProps)
@withRouter
class TableComponent extends React.Component {
  componentDidMount() {
    const { dispatch, token, appliedFilters } = this.props
    const values = {
      ...appliedFilters,
      page: 1,
      limit: 10,
    }
    dispatch(getAllBankAccounts(values, token))
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isAccountFetched) {
      this.handleModal()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isBankAccountUpdated } = this.props
    const isPropsUpdated = {
      isAccountFetched:
        prevProps.isBankAccountUpdated !== isBankAccountUpdated && isBankAccountUpdated === true,
    }
    return isPropsUpdated
  }

  handleTableChange = pagination => {
    const { dispatch, token, appliedFilters } = this.props
    dispatch(handlePagination(pagination))
    dispatch(
      getAllBankAccounts(
        { ...appliedFilters, page: pagination.current, limit: pagination.pageSize },
        token,
      ),
    )
  }

  navigateToViewAccount = record => {
    const { id } = record
    const { history } = this.props
    history.push(`/view-account/${id}`)
  }

  navigateToEditAccount = record => {
    const { id } = record
    const { history } = this.props
    history.push(`/edit-account/${id}`)
  }

  render() {
    const nullSymbol = '---'
    const { bankAccounts, pagination, bankAccountLoading, vendors, timeZone } = this.props
    const columns = [
      {
        title: 'Creation Date',
        dataIndex: 'createdAt',
        align: 'center',
        render: createdAt => (
          <Tooltip title={createdAt ? formatToZoneDate(createdAt, timeZone) : nullSymbol}>
            <span>{createdAt ? formatToZoneDateOnly(createdAt, timeZone) : nullSymbol}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Vendor Name',
        dataIndex: 'vendorId',
        align: 'center',
        render: value =>
          vendors.map(res => res.id === value && res.genericInformation?.tradingName),
      },
      {
        title: 'Name On Account',
        dataIndex: 'nameOnAccount',
        align: 'center',
      },
      {
        title: 'Account Number',
        dataIndex: 'accountNumber',
        align: 'center',
      },
      {
        title: 'Account Currency',
        dataIndex: 'accountCurrency',
        align: 'center',
      },
      {
        title: 'Bank Name',
        dataIndex: 'bankName',
        align: 'center',
      },
      {
        title: 'Account Type',
        dataIndex: 'accountType',
        align: 'center',
      },
      {
        title: 'Local Account Type',
        dataIndex: 'localAccountType',
        align: 'center',
      },
      {
        title: 'Account Status',
        dataIndex: 'accountStatus',
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
              <Button onClick={() => this.navigateToEditAccount(record)} type="link">
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
              <Button onClick={() => this.navigateToViewAccount(record)} type="link">
                <Icon type="eye" style={{ color: '#008000' }} />
              </Button>
            </Tooltip>
          </>
        ),
      },
    ]
    return (
      <div className={bankAccountLoading ? 'p-2' : ''}>
        <Skeleton loading={bankAccountLoading} active>
          <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={bankAccounts}
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['10', '25', '50', '100'],
              // locale: { items_per_page: '' },
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            loading={bankAccountLoading}
            scroll={{ x: 'max-content' }}
            onChange={this.handleTableChange}
          />
        </Skeleton>
      </div>
    )
  }
}

export default TableComponent
