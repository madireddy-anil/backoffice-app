import React, { Component } from 'react'
import { Card, Button, Form, Icon, Collapse, Spin, Table } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import { v4 as uuid } from 'uuid'
import lodash from 'lodash'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  updateTradeListView,
  updatePaymentListView,
  getPricingProfileById,
} from '../../../../redux/pricing/action'
import { capitalize } from '../../../../utilities/transformer'

import data from '../data.json'
import styles from '../style.module.scss'

const { Panel } = Collapse

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
}

const mapStateToProps = ({ user, general, pricingProfiles }) => ({
  token: user.token,
  currencies: general.currencies,
  errorList: pricingProfiles.errorList,
  loading: pricingProfiles.loading,
  clients: general.clients,
  // payments: pricingProfiles.payments,
  paymentsListView: pricingProfiles.paymentsListView,
  // tradesPricingList: pricingProfiles.tradesPricingList,
  tradesListView: pricingProfiles.tradesListView,

  selectedPricingProfile: pricingProfiles.selectedPricingProfile,

  paymentTiering: pricingProfiles.payment.tiering,
})

@Form.create()
@connect(mapStateToProps)
class viewPricingProfile extends Component {
  state = {
    selectedProfileType: undefined,
    selectedProductType: [],
    paymentsTieredPricingList: [],
    tradeTieredPricingList: [],
    noData: '--',
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isSelectedPricingProfileUpdated) {
      this.setValues()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { selectedPricingProfile } = this.props
    const isPropsUpdated = {
      isSelectedPricingProfileUpdated: prevProps.selectedPricingProfile !== selectedPricingProfile,
    }
    return isPropsUpdated
  }

  setValues = () => {
    const { selectedPricingProfile, dispatch } = this.props
    this.setState({
      selectedProfileType: selectedPricingProfile.profileType || [],
      selectedProductType: selectedPricingProfile.products || [],
    })
    if (
      Object.entries(selectedPricingProfile).length > 0 &&
      selectedPricingProfile.products.includes('trades')
    ) {
      Promise.resolve(
        this.setState({
          tradeTieredPricingList: selectedPricingProfile.trades.tiering || [],
          selcetdTradeTier: selectedPricingProfile.trades.tiering[0].tradesTier,
          selectedTradeTieringMethod: selectedPricingProfile.trades.tiering[0].tradesTier
            ? selectedPricingProfile.trades.tiering[0].tradesTieringMethod
            : undefined,
        }),
      ).then(() => {
        dispatch(updateTradeListView(true))
      })
    }
    if (
      Object.entries(selectedPricingProfile).length > 0 &&
      selectedPricingProfile.products.includes('payments')
    ) {
      Promise.resolve(
        this.setState({
          paymentsTieredPricingList: selectedPricingProfile.payments.tiering || [],
          selcetdpaymentsTier: selectedPricingProfile.payments.tiering[0].paymentsTier,
          selectedPaymentTieringMethod: selectedPricingProfile.payments.tiering[0].paymentsTier
            ? selectedPricingProfile.payments.tiering[0].paymentsTieringMethod
            : undefined,
        }),
      ).then(() => {
        dispatch(updatePaymentListView(true))
      })
    }
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/pricing-profiles')
  }

  formateData = dataElement => {
    return dataElement.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(',')
  }

  paymentRecordView = payments => {
    const columns = [
      {
        title: 'Is Tiering ',
        dataIndex: 'paymentsTier',
        key: 'paymentsTier',
        align: 'center',
        render: record => (record ? 'Yes' : 'No'),
      },
      {
        title: 'Tiering Method',
        dataIndex: 'paymentsTieringMethod',
        key: 'paymentsTieringMethod',
        align: 'center',
        render: record => lodash.startCase(record),
      },
      {
        title: 'Minimum Value',
        dataIndex: 'monthly.fromValueOfMonthlyPayments',
        key: 'fromValueOfMonthlyPayments',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'monthly.maxValueOfMonthlyPayments',
        key: 'maxValueOfMonthlyPayments',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.monthly.maxValueOfMonthlyPayments,
      },
      {
        title: 'Minimum Value',
        dataIndex: 'monthly.fromNumberOfMonthlyPayments',
        key: 'fromNumberOfMonthlyPayments',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'monthly.maxNumberOfMonthlyPayments',
        key: 'maxNumberOfMonthlyPayments',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.monthly.maxNumberOfMonthlyPayments,
      },
      {
        title: 'Minimum Value',
        dataIndex: 'single.fromValueOfSinglePayment',
        key: 'fromValueOfSinglePayment',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'single.maxValueOfSinglePayment',
        key: 'maxValueOfSinglePayment',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.single.maxValueOfSinglePayment,
      },

      {
        title: 'Lifting Fee Method',
        dataIndex: 'liftingFeeMethod',
        key: 'liftingFeeMethod',
        align: 'center',
        render: record => lodash.startCase(record),
      },
      {
        title: 'Lifting fee Amount :',
        dataIndex: 'liftingFeeAmount',
        key: 'liftingFeeAmount',
        align: 'center',
      },
      {
        title: 'Invoice Fee Method :',
        dataIndex: 'invoiceFeeMethod',
        key: 'invoiceFeeMethod',
        align: 'center',
        render: record => lodash.startCase(record),
      },
      {
        title: 'Invoice Amount ',
        dataIndex: 'invoiceAmount',
        key: 'invoiceAmount',
        align: 'center',
      },
      {
        title: 'Invoice Currency',
        dataIndex: 'invoiceCurrency',
        key: 'invoiceCurrency',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'paymentsTieringActive',
        key: 'paymentsTieringActive',
        align: 'center',
        fixed: 'right',
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
        dataIndex: 'actions',
        key: 'x',
        align: 'center',
        fixed: 'right',
        render: (text, record) => (
          <>{record.isFinalTier ? <Button type="link">Final Tier</Button> : ''}</>
        ),
      },
    ]
    const filteredColumns = this.setColumnsHandler()
    const columnsList = this.getColumns(filteredColumns, columns)
    return (
      <div>
        <Table
          columns={columnsList}
          rowKey={record => record.index}
          // loading={loading}
          dataSource={payments}
          scroll={{ x: 'max-content' }}
          // pagination={pagination}
          // onChange={this.handleTableChange}
        />
      </div>
    )
  }

  setColumnsHandler = () => {
    const { selectedPaymentTieringMethod, selcetdpaymentsTier } = this.state
    let selcetedMethodColumns
    if (selcetdpaymentsTier) {
      switch (selectedPaymentTieringMethod) {
        case 'monthly_value':
          selcetedMethodColumns = data.montlyValue
          return selcetedMethodColumns
        case 'monthly_volume':
          selcetedMethodColumns = data.montlyVolume
          return selcetedMethodColumns
        case 'single_value':
          selcetedMethodColumns = data.singleValue
          return selcetedMethodColumns
        default:
          selcetedMethodColumns = []
          return selcetedMethodColumns
      }
    } else {
      selcetedMethodColumns = data.nonTieringList
    }
    return selcetedMethodColumns
  }

  getColumns = (selcetedMethodColumns, transactionColumns) => {
    const headerData = []
    let header = {}
    selcetedMethodColumns.forEach(headerdata => {
      transactionColumns.forEach(dataItem => {
        if (headerdata === dataItem.dataIndex) {
          header = dataItem
          headerData.push(header)
        }
      })
    })
    return headerData
  }

  tradeRecordView = tradesPricingList => {
    const columns = [
      { title: 'Is Tiering ', dataIndex: 'paymentsTier', key: 'paymentsTier', align: 'center' },
      {
        title: 'Tiering Method',
        dataIndex: 'tradesTieringMethod',
        key: 'tradesTieringMethod',
        align: 'center',
        render: record => lodash.startCase(record),
      },
      {
        title: 'Minimum Value',
        dataIndex: 'monthly.fromNumberOfMonthlyTrades',
        key: 'fromNumberOfMonthlyTrades',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'monthly.maxNumberOfMonthlyTrades',
        key: 'maxNumberOfMonthlyTrades',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.monthly.maxNumberOfMonthlyTrades,
      },
      {
        title: 'Minimum Value',
        dataIndex: 'single.fromValueOfSingleBuyAmount',
        key: 'fromValueOfSingleBuyAmount',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'single.maxValueOfSingleBuyAmount',
        key: 'maxValueOfSingleBuyAmount',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.single.maxValueOfSingleBuyAmount,
      },
      {
        title: 'Minimum Value',
        dataIndex: 'monthly.fromMonthlyBuyAmount',
        key: 'fromMonthlyBuyAmount',
        align: 'center',
      },
      {
        title: 'Maximum Value',
        dataIndex: 'monthly.maxMonthlyBuyAmount',
        key: 'maxMonthlyBuyAmount',
        align: 'center',
        render: (text, record) =>
          record.isFinalTier ? 'unlimited' : record.monthly.maxMonthlyBuyAmount,
      },

      {
        title: 'Mark Up',
        dataIndex: 'markup',
        key: 'markup',
        align: 'center',
      },
      {
        title: 'Spread',
        dataIndex: 'spread',
        key: 'spread',
        align: 'center',
      },
      {
        title: 'Status',
        dataIndex: 'tradesTieringActive',
        key: 'tradesTieringActive',
        align: 'center',
        fixed: 'right',
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
        dataIndex: 'actions',
        key: 'x',
        align: 'center',
        fixed: 'right',
        render: (text, record) => (
          <>{record.isFinalTier ? <Button type="link">Final Tier</Button> : ''}</>
        ),
      },
    ]
    const filteredColumns = this.setTradesColumnsHandler()
    const columnsList = this.getColumns(filteredColumns, columns)
    return (
      <div>
        <Table
          columns={columnsList}
          rowKey={record => record.index}
          // loading={loading}
          dataSource={tradesPricingList}
          scroll={{ x: 'max-content' }}
          // pagination={pagination}
          // onChange={this.handleTableChange}
        />
      </div>
    )
  }

  navigateToEditPricingProfile = () => {
    const { dispatch, history, token, selectedPricingProfile } = this.props
    dispatch(getPricingProfileById(selectedPricingProfile.id, token))
    history.push('/edit-pricing-profile')
  }

  setTradesColumnsHandler = () => {
    const { selectedTradeTieringMethod, selcetdTradeTier } = this.state
    let selcetedMethodColumns
    if (selcetdTradeTier) {
      switch (selectedTradeTieringMethod) {
        case 'monthly_value':
          selcetedMethodColumns = data.tradeMontlyValue
          return selcetedMethodColumns
        case 'monthly_volume':
          selcetedMethodColumns = data.tradeMontlyVolume
          return selcetedMethodColumns
        case 'single_value':
          selcetedMethodColumns = data.tradeSingleValue
          return selcetedMethodColumns
        default:
          selcetedMethodColumns = []
          return selcetedMethodColumns
      }
    } else {
      selcetedMethodColumns = data.nonTieringTradeList
    }
    return selcetedMethodColumns
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/pricing-profiles')
  }

  render() {
    const { paymentsListView, tradesListView, loading, selectedPricingProfile } = this.props
    const {
      selectedProfileType,
      selectedProductType,
      paymentsTieredPricingList,
      tradeTieredPricingList,
      noData,
    } = this.state
    return (
      <React.Fragment>
        <Spin spinning={loading}>
          <Card
            title={
              <div>
                <span className="font-size-16">View Pricing Profile</span>
              </div>
            }
            bordered
            headStyle={{
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
            bodyStyle={{
              padding: '30px',
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
            className={styles.mainCard}
            extra={
              <>
                <Button
                  type="link"
                  className="pr-3"
                  onClick={() => this.navigateToEditPricingProfile()}
                >
                  Edit
                </Button>
                <Button type="link" onClick={this.onBackButtonHandler}>
                  Back
                </Button>
              </>
            }
          >
            <Helmet title="Country" />

            <div className="row">
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Profile Type</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedPricingProfile.profileType
                      ? capitalize(selectedPricingProfile.profileType)
                      : noData}
                  </span>
                </div>
              </div>
              {selectedProfileType === 'custom' ? (
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Client</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedPricingProfile.entityId ? selectedPricingProfile.entityId : noData}
                    </span>
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className="col-md-6 col-lg-3">
                <div className="col-md-6 col-lg-6">
                  <strong className="font-size-15">Product Type</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedProductType.length > 0
                        ? this.formateData(selectedProductType)
                        : noData}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Spacer height="5px" />
          {selectedProductType.length > 0 ? (
            <Card>
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => (
                  <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                )}
              >
                {selectedProductType.includes('payments') ? (
                  <Panel header="Payment Details" key="1" style={customPanelStyle}>
                    <div className="row">
                      <div className="col-md-6 col-lg-3">
                        <strong className="font-size-15">Direction :</strong>
                        <div className="pb-4 mt-1">
                          <span className="font-size-13">
                            {selectedPricingProfile.payments.direction
                              ? capitalize(selectedPricingProfile.payments.direction)
                              : noData}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <strong className="font-size-15">Priority</strong>
                        <div className="pb-4 mt-1">
                          <span className="font-size-13">
                            {selectedPricingProfile.payments.priority
                              ? selectedPricingProfile.payments.priority
                              : noData}
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <strong className="font-size-15">Transaction Currency :</strong>
                        <div className="pb-4 mt-1">
                          <span className="font-size-13">
                            {selectedPricingProfile.payments.transactionCurrency
                              ? selectedPricingProfile.payments.transactionCurrency
                              : noData}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <div className="col-md-6 col-lg-9">
                          <strong className="font-size-15">Payment Type</strong>
                          <div className="pb-4 mt-1">
                            <span className="font-size-13">
                              {selectedPricingProfile.payments.type
                                ? capitalize(selectedPricingProfile.payments.type)
                                : noData}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {paymentsTieredPricingList.length > 0 && paymentsListView
                      ? this.paymentRecordView(paymentsTieredPricingList)
                      : ''}
                  </Panel>
                ) : (
                  ''
                )}
                {selectedProductType.includes('trades') ? (
                  <Panel header="Trade Details" key="2" style={customPanelStyle}>
                    <div className="row">
                      <div className="col-md-6 col-lg-3">
                        <strong className="font-size-15">Buy Currency</strong>
                        <div className="pb-4 mt-1">
                          <span className="font-size-13">
                            {selectedPricingProfile.trades.buyCurrency
                              ? capitalize(selectedPricingProfile.trades.buyCurrency)
                              : noData}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-3">
                        <strong className="font-size-15">Sell Currency</strong>
                        <div className="pb-4 mt-1">
                          <span className="font-size-13">
                            {selectedPricingProfile.trades.sellCurrency
                              ? selectedPricingProfile.trades.sellCurrency
                              : noData}
                          </span>
                        </div>
                      </div>
                    </div>
                    {tradeTieredPricingList.length > 0 && tradesListView
                      ? this.tradeRecordView(tradeTieredPricingList)
                      : ''}
                  </Panel>
                ) : (
                  ''
                )}
              </Collapse>
            </Card>
          ) : (
            ''
          )}
        </Spin>
      </React.Fragment>
    )
  }
}
export default viewPricingProfile
