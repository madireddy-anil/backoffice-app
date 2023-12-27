import React, { Component } from 'react'
import { Table, Button, Icon, Popconfirm } from 'antd'
import { deleteExoticForeignExchangeId } from 'redux/currencyAccounts/action'
import { connect } from 'react-redux'
import lodash from 'lodash'
import styles from './style.module.scss'

const mapStateToProps = ({ user, currencyAccounts }) => ({
  token: user.token,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,
  addExoticConfigLoading: currencyAccounts.addExoticConfigLoading,
})

@connect(mapStateToProps)
class viewAccountDetails extends Component {
  state = {
    // noData: '--',
    pagination: {
      pageSize: 50,
    },
  }

  handleDeletedExoticFxConfig = exoticForeignExchangeId => {
    const { dispatch, selectedCurrencyAccount, token } = this.props
    dispatch(
      deleteExoticForeignExchangeId(selectedCurrencyAccount.id, exoticForeignExchangeId, token),
    )
  }

  render() {
    const { selectedCurrencyAccount, addExoticConfigLoading } = this.props
    const { pagination } = this.state
    const popConfirmtext = 'Are sure you want to delete this record ?'
    const columns = [
      {
        title: 'Deposit Account Type',
        dataIndex: 'depositAccountType',
        key: 'depositAccountType',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Deposit Window Start',
        dataIndex: 'depositWindowStart',
        key: 'depositWindowStart',
        align: 'center',
      },
      {
        title: 'Deposit Window End',
        dataIndex: 'depositWindowEnd',
        key: 'depositWindowEnd',
        align: 'center',
      },
      {
        title: 'Account Usage',
        dataIndex: 'accountUsage',
        key: 'accountUsage',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Notes',
        dataIndex: 'additionalNotes',
        key: 'additionalNotes',
        align: 'center',
      },

      {
        title: 'Status',
        dataIndex: 'isActiveExoticForeignExchange',
        key: 'isActiveExoticForeignExchange',
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
              // eslint-disable-next-line no-param-reassign, no-underscore-dangle
              onConfirm={() => this.handleDeletedExoticFxConfig(record._id)}
              okText="Yes"
              cancelText="No"
              loading={addExoticConfigLoading}
            >
              <Button
                type="link"
                className={styles.deleteIcon}
                disabled={
                  !selectedCurrencyAccount.isActiveAccount || !record.isActiveExoticForeignExchange
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
              columns={columns}
              // eslint-disable-next-line no-param-reassign, no-underscore-dangle
              rowKey={record => record._id}
              loading={addExoticConfigLoading}
              dataSource={selectedCurrencyAccount.exoticForeignExchange}
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
