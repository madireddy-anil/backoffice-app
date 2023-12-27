import React, { Component } from 'react'
import { Card, Icon, Table, Tooltip, Button, Form, Popconfirm } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  getAllPricingProfiles,
  getPricingProfileById,
  deleteSelectedPricingProfile,
  updateIsNewPricingProfile,
} from 'redux/pricing/action'

import styles from './style.module.scss'

const mapStateToProps = ({ user, pricingProfiles }) => ({
  token: user.token,
  pricingProfiles: pricingProfiles.pricingProfiles,
  loading: pricingProfiles.allPricingListLoading,
})

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
    dispatch(getAllPricingProfiles(token))
  }

  navigateToEditPricingProfile = record => {
    const { dispatch, history, token } = this.props
    dispatch(getPricingProfileById(record.id, token))
    dispatch(updateIsNewPricingProfile(false))
    history.push('/edit-pricing-profile')
  }

  navigateToViewPricingProfile = record => {
    const { dispatch, history, token } = this.props
    history.push('/view-pricing-profile')
    dispatch(getPricingProfileById(record.id, token))
    dispatch(updateIsNewPricingProfile(false))
  }

  handleAddPricingProfile = () => {
    const { history } = this.props
    history.push('/new-pricing-profile')
  }

  handleDeletedPricingProfile = record => {
    const { dispatch, token } = this.props
    dispatch(deleteSelectedPricingProfile(record.id, token))
  }

  render() {
    const { loading, pricingProfiles } = this.props
    const { pagination } = this.state
    const popConfirmtext = 'Are you sure to delete this record?'
    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        // render: text => <a>{moment(text, 'YYY-MM-DD').format('DD-MM-YY HH:MM:SS')}</a>,
      },
      {
        title: 'Client',
        dataIndex: 'tradingName',
        key: 'tradingName',
        align: 'center',
      },
      {
        title: 'Profile Type',
        dataIndex: 'profileType',
        key: 'profileType',
        align: 'center',
      },
      {
        title: 'Payments',
        dataIndex: 'payments',
        key: 'payments',
        align: 'payments',
        children: [
          {
            title: 'Currency',
            dataIndex: 'payments.transactionCurrency',
            key: 'transactionCurrency',
            width: 150,
            align: 'center',
          },
          {
            title: 'Direction',
            dataIndex: 'payments.direction',
            key: 'direction',
            width: 150,
            align: 'center',
          },
          {
            title: 'Type',
            dataIndex: 'payments.type',
            key: 'type',
            width: 150,
            align: 'center',
          },
          {
            title: 'Priority',
            dataIndex: 'payments.priority',
            key: 'priority',
            width: 150,
            align: 'center',
          },
          // {
          //   title: 'Invoice Currency',
          //   dataIndex: 'payments.invoiceCurrency',
          //   key: 'invoiceCurrency',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Invoice Amount',
          //   dataIndex: 'payments.invoiceAmount',
          //   key: 'invoiceAmount',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Lifting Fee Amount',
          //   dataIndex: 'payments.liftingFeeAmount',
          //   key: 'liftingFeeAmount',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Minimum Single Transaction Value',
          //   dataIndex: 'payments.single.fromValueOfSinglePayment',
          //   key: 'fromValueOfSinglePayment',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Maximum Single Transaction Value',
          //   dataIndex: 'payments.single.maxValueOfSinglePayment',
          //   key: 'maxValueOfSinglePayment',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Montly Minimum Transaction Count',
          //   dataIndex: 'payments.monthly.fromNumber',
          //   key: 'fromNumber',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Montly Maximum Transaction Count',
          //   dataIndex: 'payments.monthly.maxNumber',
          //   key: 'maxNumber',
          //   width: 150,
          //   align: 'center',
          // },
        ],
      },
      {
        title: 'Trades',
        dataIndex: 'trades',
        key: 'trades',
        align: 'trades',
        children: [
          {
            title: 'Buy Currency',
            dataIndex: 'trades.buyCurrency',
            key: 'buyCurrency',
            width: 150,
            align: 'center',
          },
          {
            title: 'Sell Currency',
            dataIndex: 'trades.sellCurrency',
            key: 'sellCurrency',
            width: 150,
            align: 'center',
          },
          // {
          //   title: 'Minimun Buy Amount',
          //   dataIndex: 'trades.fromBuyAmount',
          //   key: 'fromBuyAmount',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Maximum Buy Amount',
          //   dataIndex: 'trades.maxBuyAmount',
          //   key: 'maxBuyAmount',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Minimum No.of Trades',
          //   dataIndex: 'trades.fromNumberOfTrades',
          //   key: 'fromNumberOfTrades',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Maximum No.of Trades',
          //   dataIndex: 'trades.maxNumberOfTrades',
          //   key: 'maxNumberOfTrades',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Mark Up',
          //   dataIndex: 'trades.markup',
          //   key: 'markup',
          //   width: 150,
          //   align: 'center',
          // },
          // {
          //   title: 'Spread',
          //   dataIndex: 'trades.spread',
          //   key: 'spread',
          //   width: 150,
          //   align: 'center',
          // },
        ],
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
              <Button onClick={() => this.navigateToEditPricingProfile(record)} type="link">
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Tooltip title="View">
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
              <span className="font-size-16">Pricing Profiles</span>
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
              <Tooltip title="Add New Pricing Profile">
                <Button type="primary" className="mr-3" onClick={this.handleAddPricingProfile}>
                  Add New Pricing Profile
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
                  dataSource={pricingProfiles}
                  scroll={{ x: 'max-content' }}
                  pagination={pagination}
                  onChange={this.handleTableChange}
                  bordered
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
