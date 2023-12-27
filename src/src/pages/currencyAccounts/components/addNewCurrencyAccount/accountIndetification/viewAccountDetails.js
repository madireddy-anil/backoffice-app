import React, { Component } from 'react'
import { Table, Button, Icon, Popconfirm } from 'antd'
import { deleteAccountIdentificationDetails } from 'redux/currencyAccounts/action'
import { connect } from 'react-redux'

import styles from './style.module.scss'

const mapStateToProps = ({ user, currencyAccounts, general }) => ({
  token: user.token,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,
  addAccountIdentifierLoading: currencyAccounts.addAccountIdentifierLoading,
  countries: general.countries,
})

@connect(mapStateToProps)
class viewAccountDetails extends Component {
  state = {
    // noData: '--',
    pagination: {
      pageSize: 50,
    },
  }

  handleDeletedAccountIdentifier = record => {
    const { dispatch, selectedCurrencyAccount, token } = this.props
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    const accIdentifierId = record._id
    dispatch(deleteAccountIdentificationDetails(selectedCurrencyAccount.id, accIdentifierId, token))
  }

  getCountryName = countryISO => {
    const { countries } = this.props
    const selectedCountry = countries.filter(country => country.alpha2Code === countryISO)
    return selectedCountry.length > 0 ? selectedCountry[0].name : ''
  }

  render() {
    const { selectedCurrencyAccount, addAccountIdentifierLoading } = this.props
    const { pagination } = this.state
    const popConfirmtext = 'Are sure you want to delete this record ?'
    const fiatColumns = [
      {
        title: 'Account Region',
        dataIndex: 'accountRegion',
        key: 'accountRegion',
        align: 'center',
        render: text => this.getCountryName(text),
      },
      {
        title: 'Account Number',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
        align: 'center',
      },
      {
        title: 'Bank Code',
        dataIndex: 'bankCode',
        key: 'bankCode',
        align: 'center',
      },
      {
        title: 'IBAN',
        dataIndex: 'IBAN',
        key: 'IBAN',
        align: 'center',
      },
      {
        title: 'SWIFT BIC',
        dataIndex: 'BIC',
        key: 'BIC',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'isActiveAccountIdentification',
        key: 'isActiveAccountIdentification',
        align: 'center',
        // fixed: 'right',
        render: record => {
          if (record) {
            return (
              <Button
                type="link"
                icon="check-circle"
                size="small"
                style={{ color: '#3CB371', fontWeight: '600' }}
              >
                Active
              </Button>
            )
          }
          return (
            <Button
              type="link"
              size="small"
              icon="close-circle"
              style={{ color: '#ff6e6e', fontWeight: '600' }}
            >
              Inactive
            </Button>
          )
        },
      },

      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        // fixed: 'right',
        render: record => (
          <>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletedAccountIdentifier(record)}
              okText="Yes"
              cancelText="No"
              loading={addAccountIdentifierLoading}
            >
              <Button
                type="link"
                className={styles.deleteIcon}
                disabled={
                  !selectedCurrencyAccount.isActiveAccount || !record.isActiveAccountIdentification
                }
              >
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ]
    const cryptoColumns = [
      {
        title: 'Wallet Address',
        dataIndex: 'accountNumber',
        key: 'accountNumber',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'isActiveAccountIdentification',
        key: 'isActiveAccountIdentification',
        align: 'center',
        // fixed: 'right',
        render: record => {
          if (record) {
            return (
              <Button
                type="link"
                icon="check-circle"
                size="small"
                style={{ color: '#3CB371', fontWeight: '600' }}
              >
                Active
              </Button>
            )
          }
          return (
            <Button
              type="link"
              size="small"
              icon="close-circle"
              style={{ color: '#ff6e6e', fontWeight: '600' }}
            >
              Inactive
            </Button>
          )
        },
      },

      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        // fixed: 'right',
        render: record => (
          <>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletedAccountIdentifier(record)}
              okText="Yes"
              cancelText="No"
              loading={addAccountIdentifierLoading}
            >
              <Button
                type="link"
                className={styles.deleteIcon}
                disabled={
                  !selectedCurrencyAccount.isActiveAccount || !record.isActiveAccountIdentification
                }
              >
                <Icon type="delete" />
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-xl-12">
            <Table
              columns={
                selectedCurrencyAccount.currencyType === 'fiat' ? fiatColumns : cryptoColumns
              }
              // eslint-disable-next-line no-param-reassign, no-underscore-dangle
              rowKey={record => record._id}
              loading={addAccountIdentifierLoading}
              dataSource={selectedCurrencyAccount.accountIdentification}
              scroll={{ x: 'max-content' }}
              pagination={pagination}
              onChange={this.handleTableChange}
              bordered
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default viewAccountDetails
