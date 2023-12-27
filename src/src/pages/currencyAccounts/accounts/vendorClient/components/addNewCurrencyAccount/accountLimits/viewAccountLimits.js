import React, { Component } from 'react'
import lodash from 'lodash'
import { Table, Button, Icon, Popconfirm } from 'antd'
import {
  deleteVendorClientAccountThreshold,
  updateSelectedRecordToEdit,
  updateShowEditAccountLimits,
} from 'redux/currencyAccounts/action'
import { connect } from 'react-redux'
import { amountFormatter } from 'utilities/transformer'

import styles from './style.module.scss'
import data from './data.json'

const mapStateToProps = ({ user, currencyAccounts }) => ({
  token: user.token,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,
  addThresholdsLoading: currencyAccounts.addThresholdsLoading,
})

@connect(mapStateToProps)
class viewAccountDetails extends Component {
  state = {
    // noData: '--',
    pagination: {
      pageSize: 50,
    },
  }

  handleDeletedThreshold = thresholdId => {
    const { dispatch, selectedCurrencyAccount, token } = this.props
    dispatch(deleteVendorClientAccountThreshold(selectedCurrencyAccount.id, thresholdId, token))
  }

  getLabelName = text => {
    const selectedData = data.types.filter(item => item.value === text)
    return selectedData[0].label
  }

  handleEditClientAccountLimits = record => {
    const { dispatch } = this.props
    dispatch(updateSelectedRecordToEdit(record))
    dispatch(updateShowEditAccountLimits(true))
  }

  render() {
    const { selectedCurrencyAccount, addThresholdsLoading } = this.props
    const { pagination } = this.state
    const popConfirmtext = 'Are sure you want to delete this record ?'
    const columns = [
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        render: text => this.getLabelName(text),
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        align: 'center',
        render: text => amountFormatter(text),
      },
      {
        title: 'Period',
        dataIndex: 'period',
        key: 'period',
        align: 'center',
        render: text => lodash.startCase(text),
      },

      {
        title: 'Status',
        dataIndex: 'isActiveAccountThreshold',
        key: 'isActiveAccountThreshold',
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
            <Button
              type="link"
              // className={styles.deleteIcon}
              onClick={() => this.handleEditClientAccountLimits(record)}
              disabled={
                !selectedCurrencyAccount.isActiveAccount || !record.isActiveAccountThreshold
              }
            >
              <Icon type="edit" />
            </Button>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              // eslint-disable-next-line no-param-reassign, no-underscore-dangle
              onConfirm={() => this.handleDeletedThreshold(record.id)}
              okText="Yes"
              cancelText="No"
              loading={addThresholdsLoading}
            >
              <Button
                type="link"
                className={styles.deleteIcon}
                disabled={
                  !selectedCurrencyAccount.isActiveAccount || !record.isActiveAccountThreshold
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
              loading={addThresholdsLoading}
              dataSource={selectedCurrencyAccount.accountThresholds}
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
