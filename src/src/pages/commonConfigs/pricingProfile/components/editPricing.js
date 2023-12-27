/* eslint-disable */
import React, { Component } from 'react'
import {
  Card,
  Button,
  Form,
  Select,
  Icon,
  Alert,
  Typography,
  // InputNumber,
  Collapse,
  Tooltip,
  Popconfirm,
  Modal,
  Table,
  Spin,
} from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import { v4 as uuid } from 'uuid'
import lodash from 'lodash'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  // addNewPricingProfile,
  // setToInitialValues,
  updateTradeAddView,
  updateTradeRecord,
  updateTradeListView,
  updatePaymentRecord,
  updatePaymentListView,
  updatePaymentAddView,
  updatePaymentEditView,
  updateTradeEditView,
  updatePaymentPricingData,
  updateTradePricingData,
  editSelectedPricingProfile,
  updateIsPaymentTieredPricing,
  updatePaymentTieringMethodSelected,
  deleteSelectedPaymentTiering,
  deleteSelectedTradeTiering,
} from '../../../../redux/pricing/action'
import AddPaymentPricing from './paymentProfile/addPaymentPricing'
import EditPaymentPricing from './paymentProfile/editPaymentPricing'
import AddTradePricing from './tradePricing/addTradePricing'
import EditTradePricing from './tradePricing/editTradePricing'
import data from '../data.json'
import styles from '../style.module.scss'

const { Paragraph, Text } = Typography
const { Option } = Select
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

  paymentsListView: pricingProfiles.paymentsListView,
  paymentsEditView: pricingProfiles.paymentsEditView,
  showPaymentAddTiering: pricingProfiles.paymentsTieringAddView,

  payment: pricingProfiles.payment,
  paymentTiering: pricingProfiles.payment.tiering,
  isPaymentTier: pricingProfiles.isPaymentTier,
  selectedPaymentTieringMethod: pricingProfiles.selectedPaymentTieringMethod,

  tradesListView: pricingProfiles.tradesListView,
  tradeEditView: pricingProfiles.tradeEditView,
  showtradeAddTiering: pricingProfiles.tradesTieringAddView,

  trades: pricingProfiles.trades,
  tradeTiering: pricingProfiles.trades.tiering,
  isTradeTier: pricingProfiles.isTradeTier,
  selectedTradeTieringMethod: pricingProfiles.selectedTradeTieringMethod,

  selectedPricingProfile: pricingProfiles.selectedPricingProfile,
})

@Form.create()
@connect(mapStateToProps)
class NewPricingProfile extends Component {
  state = {
    selectedProfileType: undefined,
    selectedProductType: [],

    selectedPricingRecordToEdit: {},
    selectedTradeRecordToEdit: {},
    addMoreTiering: false,

    paymentsTieredPricingList: [],
    tradeTieredPricingList: [],
    addMoreTradeTiering: false,
    buyCurrency: undefined,
    sellCurrency: undefined,

    selectedDirection: undefined,
    selectedPriority: undefined,
    selectedTransactionCurrency: undefined,
    selectedPaymentType: undefined,
    selectedClientId: undefined,
  }

  // can be removed
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(updatePaymentEditView(false))
  }

  // till this line

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
      selectedClientId:
        selectedPricingProfile.profileType === 'custom'
          ? selectedPricingProfile.entityId
          : undefined,
    })
    if (
      Object.entries(selectedPricingProfile).length > 0 &&
      selectedPricingProfile.products.includes('trades')
    ) {
      Promise.resolve(
        this.setState({
          buyCurrency: selectedPricingProfile.trades.buyCurrency,
          sellCurrency: selectedPricingProfile.trades.sellCurrency,
          tradeTieredPricingList: selectedPricingProfile.trades.tiering || [],
          selcetdTradeTier: selectedPricingProfile.trades.tiering[0].tradesTier,
          selectedTradeTieringMethod: selectedPricingProfile.trades.tiering[0].tradesTier
            ? selectedPricingProfile.trades.tiering[0].tradesTieringMethod
            : undefined,
        }),
      ).then(() => {
        const { selcetdTradeTier, selectedTradeTieringMethod } = this.state
        dispatch(updateTradeListView(true))
        dispatch(updateIsPaymentTieredPricing(selcetdTradeTier))
        dispatch(updatePaymentTieringMethodSelected(selectedTradeTieringMethod))
      })
    }
    if (
      Object.entries(selectedPricingProfile).length > 0 &&
      selectedPricingProfile.products.includes('payments')
    ) {
      Promise.resolve(
        this.setState({
          selectedPriority: selectedPricingProfile.payments.priority,
          selectedDirection: selectedPricingProfile.payments.direction,
          selectedTransactionCurrency: selectedPricingProfile.payments.transactionCurrency,
          selectedPaymentType: selectedPricingProfile.payments.type,
          paymentsTieredPricingList: selectedPricingProfile.payments.tiering || [],
          selcetdpaymentsTier: selectedPricingProfile.payments.tiering[0].paymentsTier,
          selectedPaymentTieringMethod: selectedPricingProfile.payments.tiering[0].paymentsTier
            ? selectedPricingProfile.payments.tiering[0].paymentsTieringMethod
            : undefined,
        }),
      ).then(() => {
        const { selcetdpaymentsTier, selectedPaymentTieringMethod } = this.state
        dispatch(updateIsPaymentTieredPricing(selcetdpaymentsTier))
        dispatch(updatePaymentTieringMethodSelected(selectedPaymentTieringMethod))
        dispatch(updatePaymentListView(true))
      })
    }
  }

  updatePaymentsListToState = () => {
    const { paymentTiering } = this.props
    this.setState({ paymentsTieredPricingList: paymentTiering })
  }

  updateTradeListToState = () => {
    const { tradeTiering } = this.props
    this.setState({ tradeTieredPricingList: tradeTiering })
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, selectedPricingProfile } = this.props
    let isPaymentData = true
    let isTradeData = true
    const { paymentsTieredPricingList, tradeTieredPricingList, selectedProductType } = this.state
    const { payment, trades } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        if (selectedProductType.includes('payments')) {
          if (paymentsTieredPricingList.length <= 0) {
            Modal.error({
              title: <p style={{ color: 'red' }}>Please Enter required inputs....</p>,
              content: 'Please fill atleast Payment Details below or unselect the product...!',
            })
            isPaymentData = false
          } else {
            isPaymentData = true
          }
        }
        if (selectedProductType.includes('trades')) {
          if (tradeTieredPricingList.length <= 0) {
            Modal.error({
              title: <p style={{ color: 'red' }}>Please Enter all required inputs...</p>,
              content: 'Please fill atleast Trade Details below or unselect the product...!',
            })
            isTradeData = false
          } else {
            isTradeData = true
          }
        }
        if (isPaymentData && isTradeData) {
          const value = {
            ...values,
            payments: payment,
            trades,
          }
          const helperVariable = 'onRecordSubmit'
          dispatch(
            editSelectedPricingProfile(selectedPricingProfile.id, value, token, helperVariable),
          )
        }
      }
    })
  }

  onCancelHandler = () => {
    const { history } = this.props
    history.push('/pricing-profiles')
  }

  handleProfileType = e => {
    this.setState({ selectedProfileType: e })
  }

  handleProductType = e => {
    const { dispatch } = this.props
    this.setState({ selectedProductType: e })
    if (!e.includes('trades')) {
      const empty = []
      dispatch(updateTradeRecord(empty))
      dispatch(updateTradeListView(false))
      Promise.resolve(this.setState({ sellCurrency: undefined, buyCurrency: undefined })).then(
        () => {
          this.updateTradeObject()
        },
      )
      // dispatch(updateTradeAddView(true))
    }
    if (!e.includes('payments')) {
      const empty = {
        trades: [],
      }
      Promise.resolve(
        this.setState({
          selectedDirection: undefined,
          selectedPriority: undefined,
          selectedTransactionCurrency: undefined,
          selectedPaymentType: undefined,
        }),
      ).then(() => {
        this.updatePaymentObject()
      })
      dispatch(updatePaymentRecord(empty))
      dispatch(updatePaymentListView(false))
      // dispatch(updatePaymentAddView(true))
    }
  }

  paymentRecordView = payments => {
    // const headerBlockStyle = {
    //   marginBottom: '10px',
    //   background: '#fafafa',
    //   borderTopRightRadius: '8px',
    //   borderTopLeftRadius: '8px',
    // }
    // const id = 1
    const { showPaymentAddTiering, paymentsEditView, isPaymentTier } = this.props
    const { selcetdpaymentsTier } = this.state
    const popConfirmtext = 'Are you sure to delete this record?'
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
          <>
            <Tooltip title="Edit">
              <Button
                onClick={() => this.handleEditPaymentRecord(record)}
                type="link"
                disabled={selcetdpaymentsTier && !record.paymentsTieringActive}
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeletePaymentRecord(record)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="delete">
                <Button type="link" disabled={selcetdpaymentsTier && !record.paymentsTieringActive}>
                  <Icon type="delete" />
                </Button>
              </Tooltip>
            </Popconfirm>
            {record.isFinalTier ? <Button type="link">Final Tier</Button> : ''}
          </>
        ),
      },
    ]
    const filteredColumns = this.setColumnsHandler(payments, columns)
    const columnsList = this.getColumns(filteredColumns, columns)
    return (
      <div>
        <Table
          columns={columnsList}
          rowKey={record => record.index}
          dataSource={payments}
          scroll={{ x: 'max-content' }}
          // pagination={pagination}
          // onChange={this.handleTableChange}
        />
        {!showPaymentAddTiering && !paymentsEditView && selcetdpaymentsTier ? (
          <div className={styles.addNewPaymentData}>
            <Button type="dashed" onClick={this.addMorePaymentRecord} style={{ width: '60%' }}>
              <Icon type="plus" /> Add More Tiering Records
            </Button>
          </div>
        ) : (
          ''
        )}
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

  handleEditPaymentRecord = item => {
    const { dispatch } = this.props
    this.setState({
      selectedPricingRecordToEdit: item,
    })
    dispatch(updatePaymentEditView(true))
    this.handleDeletePaymentRecordFromList(item, item.index)
  }

  handleDeletePaymentRecordFromList = item => {
    const { dispatch, paymentsEditView } = this.props
    const { paymentsTieredPricingList } = this.state
    paymentsTieredPricingList.splice(item.index, 1)
    if (paymentsTieredPricingList.length <= 0 && paymentsEditView) {
      dispatch(updatePaymentAddView(true))
    }
    if (paymentsTieredPricingList <= 0) {
      this.setState({ addMoreTiering: false })
    }
    if (paymentsEditView) {
      dispatch(updatePaymentAddView(false))
    }
    this.setState({ paymentsTieredPricingList })
    dispatch(updatePaymentRecord(paymentsTieredPricingList))
  }

  handleDeletePaymentRecord = item => {
    const { dispatch, token, selectedPricingProfile } = this.props
    dispatch(deleteSelectedPaymentTiering(selectedPricingProfile.id, item._id, token))
  }

  handleEditTradeRecord = item => {
    const { dispatch } = this.props
    this.setState({ selectedTradeRecordToEdit: item })
    dispatch(updateTradeEditView(true))
    this.handleDeleteTradeRecordFromList(item, item.index)
  }

  handleDeleteTradeRecordFromList = item => {
    const { dispatch, tradeEditView } = this.props
    const { tradeTieredPricingList } = this.state
    tradeTieredPricingList.splice(item.index, 1)
    if (tradeTieredPricingList.length <= 0 && tradeEditView) {
      dispatch(updateTradeAddView(true))
    }

    if (tradeTieredPricingList <= 0) {
      this.setState({ addMoreTradeTiering: false })
    }
    if (tradeEditView) {
      dispatch(updateTradeAddView(false))
    }
    this.setState({ tradeTieredPricingList })
    dispatch(updateTradeRecord(tradeTieredPricingList))
  }

  handleDeleteTradeRecord = item => {
    const { dispatch, token, selectedPricingProfile } = this.props
    dispatch(deleteSelectedTradeTiering(selectedPricingProfile.id, item._id, token))
  }

  tradeRecordView = tradesPricingList => {
    const { showtradeAddTiering, tradeEditView } = this.props
    const { selcetdTradeTier } = this.state
    const popConfirmtext = 'Are you sure to delete this record?'
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
          <>
            <Tooltip title="Edit">
              <Button
                onClick={() => this.handleEditTradeRecord(record)}
                type="link"
                disabled={selcetdTradeTier && !record.tradesTieringActive}
              >
                <Icon type="edit" />
              </Button>
            </Tooltip>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={() => this.handleDeleteTradeRecord(record)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="delete">
                <Button type="link" disabled={selcetdTradeTier && !record.tradesTieringActive}>
                  <Icon type="delete" />
                </Button>
              </Tooltip>
            </Popconfirm>
            {record.isFinalTier ? <Button type="link">Final Tier</Button> : ''}
          </>
        ),
      },
    ]
    const filteredColumns = this.setTradesColumnsHandler(tradesPricingList, columns)
    const columnsList = this.getColumns(filteredColumns, columns)
    return (
      <div>
        <Table
          columns={columnsList}
          rowKey={record => record.index}
          dataSource={tradesPricingList}
          scroll={{ x: 'max-content' }}
          // pagination={pagination}
          // onChange={this.handleTableChange}
        />

        {!showtradeAddTiering && !tradeEditView && selcetdTradeTier ? (
          <div className={styles.addNewPaymentData}>
            <Button type="dashed" onClick={this.addMoreTradeRecord} style={{ width: '60%' }}>
              <Icon type="plus" /> Add More Tiering Records
            </Button>
          </div>
        ) : (
          ''
        )}
      </div>
    )
  }

  addMorePaymentRecord = () => {
    const { dispatch } = this.props
    this.setState({ addMoreTiering: true })
    dispatch(updatePaymentAddView(true))
    // return <AddMoreTieringRecords />
  }

  addMoreTradeRecord = () => {
    const { dispatch } = this.props
    this.setState({ addMoreTradeTiering: true })
    dispatch(updateTradeAddView(true))
  }

  handleShowPaymentTiering = () => {
    const { dispatch } = this.props
    dispatch(updatePaymentAddView(true))
  }

  handleShowTradeTiering = () => {
    const { dispatch } = this.props
    dispatch(updateTradeAddView(true))
  }

  handleSelectedDirection = direction => {
    Promise.resolve(this.setState({ selectedDirection: direction })).then(() => {
      this.updatePaymentObject()
    })
  }

  handleSelectedPriority = priority => {
    Promise.resolve(this.setState({ selectedPriority: priority })).then(() => {
      this.updatePaymentObject()
    })
  }

  handleSelectedTransactionCurrency = transactionCurrency => {
    Promise.resolve(this.setState({ selectedTransactionCurrency: transactionCurrency })).then(
      () => {
        this.updatePaymentObject()
      },
    )
  }

  handleSelectedPaymentType = type => {
    Promise.resolve(this.setState({ selectedPaymentType: type })).then(() => {
      this.updatePaymentObject()
    })
  }

  updatePaymentObject = () => {
    const {
      selectedDirection,
      selectedPriority,
      selectedTransactionCurrency,
      selectedPaymentType,
    } = this.state
    const { dispatch } = this.props
    const value = {
      direction: selectedDirection,
      priority: selectedPriority,
      type: selectedPaymentType,
      transactionCurrency: selectedTransactionCurrency,
    }
    dispatch(updatePaymentPricingData(value))
  }

  handleSelectedBuyCurrency = buyCurrency => {
    Promise.resolve(this.setState({ buyCurrency })).then(() => {
      this.updateTradeObject()
    })
  }

  handleSelectedSellCurrency = sellCurrency => {
    Promise.resolve(this.setState({ sellCurrency })).then(() => {
      this.updateTradeObject()
    })
  }

  updateTradeObject = () => {
    const { buyCurrency, sellCurrency } = this.state
    const { dispatch } = this.props
    const value = {
      buyCurrency,
      sellCurrency,
    }
    dispatch(updateTradePricingData(value))
  }

  render() {
    const {
      form,
      errorList,
      clients,
      // payments,
      paymentsListView,
      paymentsEditView,
      tradesListView,
      showtradeAddTiering,
      tradeEditView,
      loading,
      currencies,
      showPaymentAddTiering,
    } = this.props
    const {
      selectedProductType,
      // paymentsPricingList,
      tradeTieredPricingList,
      selectedPricingRecordToEdit,
      selectedTradeRecordToEdit,

      paymentsTieredPricingList,
      addMoreTiering,
      addMoreTradeTiering,
      selectedProfileType,
      selectedDirection,
      selectedPriority,
      selectedTransactionCurrency,
      selectedPaymentType,
      buyCurrency,
      sellCurrency,
      selectedClientId,
      selcetdTradeTier,
    } = this.state
    const profileTypeList = data.profileType.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const clientOption = clients.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        <h5>{option.genericInformation.tradingName}</h5>
        <small>{option.genericInformation.registeredCompanyName}</small>
      </Option>
    ))
    const productTypeList = data.productType.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const directionList = data.direction.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const priorityList = data.priority.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const currenciesList = currencies.map(option => (
      <Option key={option.value} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))

    const paymentTypeList = data.paymentType.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    return (
      <React.Fragment>
        <Spin spinning={loading}>
          <Form layout="vertical" onSubmit={this.onSubmit}>
            <Card
              title={
                <div>
                  <span className="font-size-16">Edit Pricing Profile</span>
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
                <div className={styles.btnStyles}>
                  <Button className={styles.btnCANCEL} onClick={this.onCancelHandler}>
                    Cancel
                  </Button>
                  <Button className={styles.btnSAVE} loading={loading} htmlType="submit">
                    Submit
                  </Button>
                </div>
              }
            >
              <Helmet title="Country" />

              {errorList.length > 0 ? (
                <div>
                  <div className={styles.errorBlock}>
                    <Alert
                      // showIcon
                      type="error"
                      message={
                        <div className="desc">
                          <Paragraph>
                            <Text
                              strong
                              style={{
                                fontSize: 14,
                              }}
                            >
                              The content you submitted has the following errors:
                            </Text>
                          </Paragraph>
                          {errorList.map(item => {
                            return (
                              <Paragraph>
                                <Icon style={{ color: 'red' }} type="close-circle" /> {item}
                              </Paragraph>
                            )
                          })}
                        </div>
                      }
                    />
                  </div>
                  <Spacer height="25px" />
                </div>
              ) : (
                ''
              )}

              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <Form.Item label="Profile Type:" hasFeedback>
                    {form.getFieldDecorator('profileType', {
                      initialValue: selectedProfileType,
                      rules: [{ required: true, message: 'Please select profile type' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        placeholder="Select Profile Type"
                        showSearch
                        onChange={e => this.handleProfileType(e)}
                        filterOption={(input, option) =>
                          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {profileTypeList}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
                {selectedProfileType === 'custom' ? (
                  <div className="col-md-6 col-lg-3">
                    <Form.Item label="Client :" hasFeedback>
                      {form.getFieldDecorator('entityId', {
                        initialValue: selectedClientId,
                        rules: [{ required: true, message: 'Please select profile type' }],
                      })(
                        <Select
                          showSearch
                          optionLabelProp="label"
                          placeholder="Search by Client Name"
                          // onChange={this.onChangeSelectClient}
                          filterOption={(input, option) =>
                            option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {clientOption}
                        </Select>,
                      )}
                    </Form.Item>
                  </div>
                ) : (
                  ''
                )}
                <div className="col-md-6 col-lg-3">
                  <Form.Item label="Product" hasFeedback>
                    {form.getFieldDecorator('products', {
                      initialValue: selectedProductType,
                      rules: [{ required: true, message: 'Please select product' }],
                    })(
                      <Select
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        className={styles.cstmSelectInput}
                        placeholder="Select Profile Type"
                        showSearch
                        mode="multiple"
                        onChange={e => this.handleProductType(e)}
                        filterOption={(input, option) =>
                          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {productTypeList}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
              </div>
            </Card>
          </Form>
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
                  <Panel header="Payment Pricing Details" key="1" style={customPanelStyle}>
                    <div>
                      <div className="row">
                        <div className="col-lg-4">
                          <span>Direction :</span>
                          <div className="pb-3 mt-3">
                            <Select
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              className={styles.cstmSelectInput}
                              placeholder="Select Profile Type"
                              showSearch
                              value={selectedDirection}
                              onChange={this.handleSelectedDirection}
                              filterOption={(input, option) =>
                                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {directionList}
                            </Select>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <span>Priority :</span>
                          <div className="pb-3 mt-3">
                            <Select
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              className={styles.cstmSelectInput}
                              placeholder="Select Profile Type"
                              showSearch
                              value={selectedPriority}
                              onChange={this.handleSelectedPriority}
                              filterOption={(input, option) =>
                                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {priorityList}
                            </Select>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <span>Transaction Currency :</span>
                          <div className="pb-3 mt-3">
                            <Select
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              className={styles.cstmSelectInput}
                              placeholder="Select transaction Currency"
                              showSearch
                              value={selectedTransactionCurrency}
                              onChange={this.handleSelectedTransactionCurrency}
                              filterOption={(input, option) =>
                                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {currenciesList}
                            </Select>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <span className="font-size-15">Payment Type :</span>
                          <div className="pb-3 mt-3">
                            <Select
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              className={styles.cstmSelectInput}
                              placeholder="Select payemnt type"
                              value={selectedPaymentType}
                              onChange={this.handleSelectedPaymentType}
                              showSearch
                              filterOption={(input, option) =>
                                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {paymentTypeList}
                            </Select>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="pb-3 mt-3">
                            <Button
                              className={styles.btnNEXT}
                              onClick={this.handleShowPaymentTiering}
                              disabled={
                                paymentsTieredPricingList.length > 0 &&
                                !showPaymentAddTiering &&
                                !paymentsEditView
                              }
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div>
                        {paymentsEditView ? (
                          <EditPaymentPricing recordData={selectedPricingRecordToEdit} />
                        ) : (
                          ''
                        )}
                        {paymentsTieredPricingList.length > 0 && paymentsListView
                          ? this.paymentRecordView(paymentsTieredPricingList)
                          : ''}
                        {showPaymentAddTiering ? (
                          <AddPaymentPricing addMoreTiering={addMoreTiering} />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </Panel>
                ) : (
                  ''
                )}

                {selectedProductType.includes('trades') ? (
                  <Panel header="Trade Pricing Details" key="2" style={customPanelStyle}>
                    <div>
                      <div className="row">
                        <div className="col-lg-4">
                          <span>Buy Currency</span>
                          <div className="pb-3 mt-3">
                            <Select
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              className={styles.cstmSelectInput}
                              placeholder="Select buy currency"
                              showSearch
                              value={buyCurrency}
                              onChange={this.handleSelectedBuyCurrency}
                              filterOption={(input, option) =>
                                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {currenciesList}
                            </Select>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <span>Sell Currency</span>
                          <div className="pb-3 mt-3">
                            <Select
                              style={{ width: '100%' }}
                              optionLabelProp="label"
                              className={styles.cstmSelectInput}
                              placeholder="Select sell currency"
                              showSearch
                              onChange={this.handleSelectedSellCurrency}
                              value={sellCurrency}
                              filterOption={(input, option) =>
                                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {currenciesList}
                            </Select>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="pb-3 mt-3">
                            <Button
                              className={styles.btnNEXT}
                              onClick={this.handleShowTradeTiering}
                              disabled={
                                tradeTieredPricingList.length > 0 &&
                                !showPaymentAddTiering &&
                                !tradeEditView
                              }
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div>
                        {tradeEditView ? (
                          <EditTradePricing recordData={selectedTradeRecordToEdit} />
                        ) : (
                          ''
                        )}
                        {tradeTieredPricingList.length > 0 && tradesListView
                          ? this.tradeRecordView(tradeTieredPricingList)
                          : ''}
                        {showtradeAddTiering ? (
                          <AddTradePricing addMoreTradeTiering={addMoreTradeTiering} />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
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
export default NewPricingProfile
