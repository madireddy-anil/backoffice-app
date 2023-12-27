import React, { Component } from 'react'
import { Card, Table, Tooltip, Button, Form } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import lodash from 'lodash'
import {
  getAllAccountingProfile,
  getAccountingProfileById,
  updateIsNewAccoutingProfile,
} from 'redux/accountingProfile/actions'
import { formatToZoneDate } from 'utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ user, accountingProfile, settings }) => ({
  token: user.token,
  accountingProfile: accountingProfile.allAccountingProfiles,
  loading: accountingProfile.loading,
  timeZone: settings.timeZone.value,
})

// const UNDEFINED_VALUE = undefined
const TRUE_VALUE = true
const FALSE_VALUE = false

@Form.create()
@connect(mapStateToProps)
class Currency extends Component {
  state = {
    pagination: {
      pageSize: 50,
    },
  }

  componentDidMount() {
    const { token, dispatch } = this.props
    dispatch(getAllAccountingProfile(token))
  }

  navigateToEditAccountingProfile = record => {
    const { dispatch, history, token } = this.props
    dispatch(getAccountingProfileById(record.id, token))
    dispatch(updateIsNewAccoutingProfile(FALSE_VALUE))
    history.push('/edit-accounting-pprofile')
  }

  //   navigateToViewPricingProfile = record => {
  //     const { dispatch, history, token } = this.props
  //     history.push('/view-pricing-profile')
  //     dispatch(getPricingProfileById(record.id, token))
  //     dispatch(updateIsNewPricingProfile(FALSE_VALUE))
  //   }

  handleAddAccoutingProfile = () => {
    const { history, dispatch } = this.props
    dispatch(updateIsNewAccoutingProfile(TRUE_VALUE))
    history.push('/new-accounting-pprofile')
  }

  //   handleDeletedPricingProfile = record => {
  //     const { dispatch, token } = this.props
  //     dispatch(deleteSelectedPricingProfile(record.id, token))
  //   }

  render() {
    const { loading, accountingProfile, timeZone } = this.props
    const { pagination } = this.state
    // const popConfirmtext = 'Are you sure to delete this record?'
    const expandedRowRender = record => {
      const columns = [
        {
          title: 'Account Number',
          dataIndex: 'accountNumber',
          key: 'accountNumber',
          align: 'center',
          render: text => lodash.startCase(text),
          width: '10%',
        },
        {
          title: 'Balance Id',
          dataIndex: 'balanceId',
          key: 'balanceId',
          align: 'center',
          width: '10%',
          render: text => lodash.startCase(text),
        },
        {
          title: 'Debit /Credit',
          dataIndex: 'debitCredit',
          key: 'debitCredit',
          align: 'center',
          width: '10%',
          render: text => lodash.startCase(text),
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          align: 'center',
          width: '10%',
          render: text => lodash.startCase(text),
        },
        {
          title: 'Currency',
          dataIndex: 'currency',
          key: 'currency',
          align: 'center',
          width: '10%',
        },
        {
          title: 'Status',
          dataIndex: 'entryActive',
          key: 'entryActive',
          align: 'center',
          width: '10%',
          render: recordData => {
            if (recordData) {
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
      ]
      return (
        <Table
          columns={columns}
          dataSource={record.entries}
          pagination={pagination}
          // eslint-disable-next-line no-param-reassign, no-underscore-dangle
          rowKey={recordItem => recordItem._id}
          scroll={{ x: 'max-content' }}
        />
      )
    }

    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Process Flow',
        dataIndex: 'processFlow',
        key: 'processFlow',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Settlement Channel',
        dataIndex: 'settlementChannel',
        key: 'settlementChannel',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Debtor Account Type',
        dataIndex: 'debtorAccountType',
        key: 'debtorAccountType',
        align: 'center',
        render: text => (text !== 'p&l' ? lodash.startCase(text) : 'P&L'),
      },
      {
        title: 'Creditor Account Type',
        dataIndex: 'creditorAccountType',
        key: 'creditorAccountType',
        align: 'center',
        render: text => (text !== 'p&l' ? lodash.startCase(text) : 'P&L'),
      },
      {
        title: 'Status',
        dataIndex: 'profileActive',
        key: 'profileActive',
        align: 'center',
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
            <Tooltip title="view">
              <Button onClick={() => this.navigateToEditAccountingProfile(record)} type="link">
                View Details
              </Button>
            </Tooltip>
            {/* <Tooltip title="View">
              <Button onClick={() => this.navigateToViewPricingProfile(record)} type="link">
                <Icon type="eye" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletedPricingProfile(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" style={{ color: 'red' }}>
                <Icon type="delete" />
              </Button>
            </Popconfirm> */}
          </>
        ),
      },
    ]
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">Accounting Profile List</span>
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
              {/* <Tooltip title="Serach">
                <Icon
                  type="search"
                  className="mr-3"
                  onClick={() =>
                    this.setState(prevState => ({
                      visibleSearch: !prevState.visibleSearch,
                    }))
                  }
                />
              </Tooltip> */}
              <Tooltip title="Add New Accounting Profile">
                <Button type="primary" className="mr-3" onClick={this.handleAddAccoutingProfile}>
                  Add New Accounting Profile
                </Button>
              </Tooltip>
            </div>
          }
        >
          <Helmet title="Currency" />
          <div className={styles.data}>
            {/* {this.getSearchUI()} */}
            <div className="row">
              <div className="col-xl-12">
                <Table
                  columns={columns}
                  rowKey={record => record.id}
                  loading={loading}
                  dataSource={accountingProfile}
                  scroll={{ x: 'max-content' }}
                  pagination={pagination}
                  onChange={this.handleTableChange}
                  bordered
                  expandedRowRender={record => expandedRowRender(record)}
                  onRow={record => ({
                    onClick: () => {
                      this.navigateToEditAccountingProfile(record)
                    },
                  })}
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
