import React, { Component } from 'react'
import { Card, Collapse, Icon, Spin, Popconfirm, Button } from 'antd'
import { connect } from 'react-redux'
import {
  updatePaymentDataEditView,
  deletePaymentRecord,
  updateIsPaymentTieredPricing,
  updatePaymentTieringMethodSelected,
  updatePaymentDataViewMode,
  updatePaymentTieringViewMode,
  updatePaymentDataAddView,
  showPaymentTieringOptions,
  updateTradeDataEditView,
  deleteTradeRecord,
  updateIsTradeTieredPricing,
  updateTradeDataViewMode,
  updateTradeTieringViewMode,
  updateTradeTieringMethodSelected,
} from 'redux/pricingProfile/action'
import InitialPricingDataView from './components/initialPricingProfileView'
import InitialPricingProfile from './components/initialPricingProfileSetup'
import AddPaymentData from './components/paymentPricing/addPaymentData'
import ViewPaymentData from './components/paymentPricing/ViewPaymentData'
import EditPaymentData from './components/paymentPricing/editPaymentData'
import ViewPaymentTieringList from './components/paymentPricing/Tiering/viewPaymentTiering'
import AddPaymentTiering from './components/paymentPricing/Tiering/addPaymentTiering'
import AddTradeData from './components/tradePricing/addTradeData'
import ViewTradeData from './components/tradePricing/viewTradeTiering'
import EditTradeData from './components/tradePricing/editTradeTiering'
import TieringOptions from './components/paymentPricing/Tiering'
import TradeTieringOptions from './components/tradePricing/tiering'
import AddTradeTiering from './components/tradePricing/tiering/addTradeTiering'
import ViewTradesTieringList from './components/tradePricing/tiering/viewTradeTiering'

import styles from './style.module.scss'

const { Panel } = Collapse

const UNDEFINED_VALUE = undefined
const TRUE_VALUE = true

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
}

const mapStateToProps = ({ user, pricing }) => ({
  token: user.token,
  selectedPricingProfile: pricing.selectedPricingProfile,

  isNewPricing: pricing.isNewPricing,

  // payment Data
  isPaymentDataAddView: pricing.isPaymentDataAddView,
  isPaymentDataViewMode: pricing.isPaymentDataViewMode,
  isPaymentDataEditView: pricing.isPaymentDataEditView,

  // Payemnt tiering
  showTieringOptions: pricing.showTieringOptions,
  paymentsTieringListView: pricing.paymentsTieringListView,
  paymentsTieringAddView: pricing.paymentsTieringAddView,

  loading: pricing.loading,

  // Trade Data
  isTradeDataAddView: pricing.isTradeDataAddView,
  isTradeDataViewMode: pricing.isTradeDataViewMode,
  isTradeDataEditView: pricing.isTradeDataEditView,

  showTradeTieringOptions: pricing.showTradeTieringOptions,
  tradesTieringListView: pricing.tradesTieringListView,
  tradesTieringAddView: pricing.tradesTieringAddView,
})

@connect(mapStateToProps)
class editPricingProfile extends Component {
  state = {
    isInitialPricingProfileEditMode: false,
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isProfileUpdate) {
      this.setValues()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { selectedPricingProfile, isNewPricing } = this.props
    const isPropsUpdated = {
      isProfileUpdate: prevProps.selectedPricingProfile !== selectedPricingProfile && !isNewPricing,
    }
    return isPropsUpdated
  }

  setValues = () => {
    const { selectedPricingProfile, dispatch } = this.props
    if (
      selectedPricingProfile.payments &&
      selectedPricingProfile.payments.tiering &&
      selectedPricingProfile.payments.tiering.length > 0
    ) {
      dispatch(
        updateIsPaymentTieredPricing(selectedPricingProfile.payments.tiering[0].paymentsTier),
      )
      dispatch(updatePaymentDataViewMode(TRUE_VALUE))
      dispatch(updatePaymentTieringViewMode(TRUE_VALUE))

      if (selectedPricingProfile.payments.tiering[0].paymentsTier) {
        dispatch(
          updatePaymentTieringMethodSelected(
            selectedPricingProfile.payments.tiering[0].paymentsTieringMethod,
          ),
        )
      } else {
        dispatch(updatePaymentTieringMethodSelected(UNDEFINED_VALUE))
      }
    }
    if (Object.entries(selectedPricingProfile.payments).length === 1) {
      dispatch(updatePaymentDataAddView(TRUE_VALUE))
    }
    if (
      selectedPricingProfile.payments &&
      Object.entries(selectedPricingProfile.payments).length > 1 &&
      selectedPricingProfile.payments.tiering.length === 0
    ) {
      dispatch(showPaymentTieringOptions(TRUE_VALUE))
    }

    if (
      selectedPricingProfile.trades &&
      selectedPricingProfile.trades.tiering &&
      selectedPricingProfile.trades.tiering.length > 0
    ) {
      dispatch(updateIsTradeTieredPricing(selectedPricingProfile.trades.tiering[0].tradesTier))
      dispatch(updateTradeDataViewMode(TRUE_VALUE))
      dispatch(updateTradeTieringViewMode(TRUE_VALUE))

      if (selectedPricingProfile.trades.tiering[0].tradesTier) {
        dispatch(
          updateTradeTieringMethodSelected(
            selectedPricingProfile.trades.tiering[0].tradesTieringMethod,
          ),
        )
      } else {
        dispatch(updateTradeTieringMethodSelected(UNDEFINED_VALUE))
      }
    }
  }

  setEditMode = isEdit => {
    this.setState({ isInitialPricingProfileEditMode: isEdit })
  }

  handlePaymentModeEdit = () => {
    const { dispatch } = this.props
    dispatch(updatePaymentDataEditView(TRUE_VALUE))
  }

  handleDeletePaymentRecord = () => {
    const { selectedPricingProfile, dispatch, token } = this.props
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    const paymentsId = selectedPricingProfile.payments._id
    const pricingId = selectedPricingProfile.id
    dispatch(deletePaymentRecord(paymentsId, pricingId, token))
  }

  genExtra = () => {
    const popConfirmtext = 'Are you sure to delete this payment pricing profile?'
    return (
      <React.Fragment>
        <Icon
          type="edit"
          className={styles.editIcon}
          onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation()
            this.handlePaymentModeEdit()
          }}
        />
        <Popconfirm
          placement="topLeft"
          title={popConfirmtext}
          onConfirm={this.handleDeletePaymentRecord}
          okText="Yes"
          cancelText="No"
        >
          <Icon type="delete" className={styles.deleteIcon} />
        </Popconfirm>
      </React.Fragment>
    )
  }

  handleTradeModeEdit = () => {
    const { dispatch } = this.props
    dispatch(updateTradeDataEditView(TRUE_VALUE))
  }

  handleDeleteTradeRecord = () => {
    const { selectedPricingProfile, dispatch, token } = this.props
    // eslint-disable-next-line no-param-reassign, no-underscore-dangle
    const tradesId = selectedPricingProfile.trades._id
    const pricingId = selectedPricingProfile.id
    dispatch(deleteTradeRecord(tradesId, pricingId, token))
  }

  genTradeExtra = () => {
    const popConfirmtext = 'Are you sure to delete this trade pricing profile?'
    return (
      <React.Fragment>
        <Icon
          type="edit"
          className={styles.editIcon}
          onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation()
            this.handleTradeModeEdit()
          }}
        />
        <Popconfirm
          placement="topLeft"
          title={popConfirmtext}
          onConfirm={this.handleDeleteTradeRecord}
          okText="Yes"
          cancelText="No"
        >
          <Icon type="delete" className={styles.deleteIcon} />
        </Popconfirm>
      </React.Fragment>
    )
  }

  handleBack = () => {
    const { history } = this.props
    history.push('/pricing-profile-list')
  }

  render() {
    const { isInitialPricingProfileEditMode } = this.state
    const {
      selectedPricingProfile,
      isPaymentDataAddView,
      paymentsTieringAddView,
      isPaymentDataViewMode,
      isPaymentDataEditView,
      showTieringOptions,
      paymentsTieringListView,
      loading,
      isTradeDataAddView,
      isTradeDataViewMode,
      isTradeDataEditView,
      showTradeTieringOptions,
      tradesTieringListView,
      tradesTieringAddView,
    } = this.props
    const paymentTieringList = selectedPricingProfile.payments
      ? selectedPricingProfile.payments.tiering
      : []
    const tradesTieringList = selectedPricingProfile.trades
      ? selectedPricingProfile.trades.tiering
      : []
    return (
      <React.Fragment>
        <Spin spinning={loading}>
          <Card
            title={
              <div>
                <span className="font-size-16">Pricing Profile</span>
              </div>
            }
            bordered
            headStyle={{
              //   border: '1px solid #a8c6fa',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
            bodyStyle={{
              padding: '30px',
              //   border: '1px solid #a8c6fa',
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
            className={styles.mainCard}
            extra={
              <Button type="primary" onClick={this.handleBack}>
                Back
              </Button>
            }
          >
            {isInitialPricingProfileEditMode ? (
              <InitialPricingProfile fromEditView checkEditMode={this.setEditMode} />
            ) : (
              <InitialPricingDataView checkEditMode={this.setEditMode} />
              //   edit button
            )}
          </Card>
          {selectedPricingProfile.products.length > 0 ? (
            <Card>
              <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => (
                  <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                )}
              >
                {selectedPricingProfile.products.includes('payments') ? (
                  <Panel
                    header="Payment Pricing Details"
                    key="1"
                    style={customPanelStyle}
                    extra={
                      isPaymentDataViewMode &&
                      selectedPricingProfile.payments &&
                      selectedPricingProfile.payments.paymentsActive &&
                      selectedPricingProfile.profileActive
                        ? this.genExtra()
                        : ''
                    }
                  >
                    {isPaymentDataAddView ? <AddPaymentData /> : ''}
                    {isPaymentDataViewMode ? <ViewPaymentData /> : ''}
                    {isPaymentDataEditView ? <EditPaymentData /> : ''}
                    {showTieringOptions &&
                    selectedPricingProfile.payments &&
                    selectedPricingProfile.payments.paymentsActive ? (
                      <TieringOptions />
                    ) : (
                      ''
                    )}
                    {paymentTieringList.length > 0 && paymentsTieringListView ? (
                      <ViewPaymentTieringList />
                    ) : (
                      ''
                    )}
                    {paymentsTieringAddView ? <AddPaymentTiering /> : ''}
                  </Panel>
                ) : (
                  ''
                )}
                {selectedPricingProfile.products.includes('trades') ? (
                  <Panel
                    header="Foreign Exchange Pricing Details"
                    key="2"
                    style={customPanelStyle}
                    extra={
                      isTradeDataViewMode &&
                      selectedPricingProfile.trades &&
                      selectedPricingProfile.trades.tradesActive &&
                      selectedPricingProfile.profileActive
                        ? this.genTradeExtra()
                        : ''
                    }
                  >
                    {isTradeDataAddView ? <AddTradeData /> : ''}
                    {isTradeDataViewMode ? <ViewTradeData /> : ''}
                    {isTradeDataEditView ? <EditTradeData /> : ''}
                    {showTradeTieringOptions &&
                    selectedPricingProfile.trades &&
                    selectedPricingProfile.trades.tradesActive ? (
                      <TradeTieringOptions />
                    ) : (
                      ''
                    )}
                    {tradesTieringList.length > 0 && tradesTieringListView ? (
                      <ViewTradesTieringList />
                    ) : (
                      ''
                    )}
                    {tradesTieringAddView ? <AddTradeTiering /> : ''}
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

export default editPricingProfile
