import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu, Icon, Card, Dropdown, Spin } from 'antd'

import {
  createTransaction,
  updateTransactionValues,
  updateCryptoTransactionValues,
  createCryptoTransaction,
} from 'redux/restrictedCurrencies/trade/tradeProcess/transactions/actions'

import ETable from 'components/LayoutComponents/EditableTable'
import {
  formatToZoneDateOnly,
  amountFormatter,
  getFormattedVendorOptions,
  getFormattedCurrencyOptions,
} from 'utilities/transformer'

import {
  updateRouteData,
  createManualRoute,
} from 'redux/restrictedCurrencies/trade/tradeProcess/tradeDetails/actions'
import {
  onDeleteRoutes,
  onRouteChange,
} from 'redux/restrictedCurrencies/trade/tradeProcess/routeEngine/actions'

import { updateVendor } from 'redux/general/actions'

const mapStateToProps = ({
  user,
  npTrade,
  settings,
  general,
  cryptoTransaction,
  npRoutingEngine,
}) => ({
  timeZone: settings.timeZone.value,
  currencies: general.currencies,
  vendors: general.vendorsForRouteEngine,
  routeEngineData: npTrade.routeEngineData,
  tradeId: npTrade.tradeId,
  deleteRouteLoading: npRoutingEngine.deleteRouteLoading,
  createManualRouteLoading: npTrade.createManualRouteLoading,
  clientId: npTrade.clientId,
  token: user.token,
  depositCurrency: npTrade.depositCurrency,
  totalDepositAmount: npTrade.sourceAmount,
  isDepositsInPersonalAccount: npTrade.isDepositsInPersonalAccount,
  isDepositsInCorporateAccount: npTrade.isDepositsInCorporateAccount,
  tradeStatus: npTrade.tradeStatus,
  currentRouteType: cryptoTransaction.currentRouteType,
  selectedRouteType: general.selectedRouteType,
  allVendors: general.allVendors,
  classifiedVendors: general.classifiedVendors,
  holdLoading: npRoutingEngine.loading,
})

@connect(mapStateToProps)
class RouteTable extends Component {
  constructor(props) {
    super(props)
    const nullSymbol = '---'

    const { currencies, vendors, timeZone } = props

    this.state = {
      routeEngineColumns: [
        {
          title: 'Date',
          dataIndex: 'createdAt',
          editable: false,
          align: 'center',
          inputType: 'text',
          render: date => formatToZoneDateOnly(date, timeZone),
        },
        {
          title: 'Route ID',
          dataIndex: 'routeReference',
          editable: false,
          align: 'center',
          inputType: 'text',
        },
        {
          title: 'Sequence',
          dataIndex: 'sequence',
          editable: false,
          align: 'center',
          inputType: 'number',
        },
        {
          title: 'Route Type',
          dataIndex: 'routeType',
          editable: true,
          align: 'center',
          inputType: 'select',
          options: [{ id: 'a011', value: 'fiat_deposit', title: 'Fiat Deposit' }],
          render: type => (type ? this.changeRouteType(type) : ''),
        },
        {
          title: 'Vendor Name',
          dataIndex: 'vendorName',
          editable: true,
          align: 'center',
          inputType: 'select',
          options: getFormattedVendorOptions(vendors),
        },
        {
          title: 'Deposit Currency',
          dataIndex: 'depositCurrency',
          editable: true,
          align: 'center',
          inputType: 'select',
          options: getFormattedCurrencyOptions(currencies),
        },
        {
          title: 'Deposit Amount',
          dataIndex: 'totalDepositAmount',
          editable: true,
          align: 'center',
          inputType: 'number',
          render: amount => (amount ? amountFormatter(amount) : nullSymbol),
        },
        {
          title: 'Currency to Settle',
          dataIndex: 'settlementCurrency',
          editable: true,
          align: 'center',
          inputType: 'select',
          options: getFormattedCurrencyOptions(currencies),
        },
        {
          title: 'Route Status',
          dataIndex: 'routeStatus',
          editable: true,
          align: 'center',
          inputType: 'select',
          options: [
            { id: '0', value: 'new', title: 'NEW' },
            { id: '1', value: 'requested', title: 'REQUESTED' },
            { id: '2', value: 'completed', title: 'COMPLETED' },
            { id: '3', value: 'cancelled', title: 'CANCELLED' },
          ],
          render: status => (status ? status.toUpperCase() : 'new'),
        },
      ],
    }
  }

  componentDidUpdate(prevProps) {
    const { routeEngineData } = this.props
    if (JSON.stringify(prevProps.routeEngineData) !== JSON.stringify(routeEngineData)) {
      this.render()
    }
  }

  addRow = () => {
    const {
      routeEngineData,
      tradeId,
      depositCurrency,
      totalDepositAmount,
      clientId,
      dispatch,
      token,
    } = this.props
    const lastRouteIndex = routeEngineData.length - 1
    const newRow = {
      tradeId,
      clientId,
      depositCurrency:
        lastRouteIndex === -1 ? depositCurrency : routeEngineData[lastRouteIndex].depositCurrency,
      settlementCurrency: '',
      totalDepositAmount: routeEngineData.length === 0 ? totalDepositAmount : null,
      sequence: routeEngineData.length + 1,
      routeStatus: 'new',
    }
    dispatch(createManualRoute(newRow, token))
  }

  handleOnRouteChange = values => {
    const { token, dispatch } = this.props
    dispatch(onRouteChange(values, token))
  }

  onRowSave = (values, index) => {
    const {
      dispatch,
      tradeId,
      token,
      vendors,
      isDepositsInPersonalAccount,
      isDepositsInCorporateAccount,
      totalDepositAmount: depositAmount,
      routeEngineData,
    } = this.props

    const vendorObj = vendors.find(
      el => el.id === values[index].vendorName || el.tradingName === values[index].vendorName,
    )

    if (index > -1) {
      if (
        values[index].routeType !== routeEngineData[index].routeType &&
        routeEngineData[index].routeType
      ) {
        const newRouteValues = {
          tradeId: values[index].tradeId,
          clientId: values[index].clientId,
          vendorName: vendorObj ? vendorObj.tradingName : '',
          vendorId: vendorObj ? vendorObj.id : '',
          depositCurrency: values[index].depositCurrency,
          totalDepositAmount: values[index].totalDepositAmount,
          settlementCurrency: values[index].settlementCurrency,
          sequence: values[index].sequence,
          routeType: values[index].routeType,
          routeStatus: 'new',
        }
        values[index].isDepositsInPersonalAccount = isDepositsInPersonalAccount
        values[index].isDepositsInCorporateAccount = isDepositsInCorporateAccount
        values[index].depositsInPersonalAccount = isDepositsInPersonalAccount
          ? values[index].totalDepositAmount
          : values[index].depositsInPersonalAccount
        values[index].depositsInCorporateAccount = isDepositsInCorporateAccount
          ? values[index].totalDepositAmount
          : values[index].depositsInCorporateAccount
        values[index].vendorName = vendorObj ? vendorObj.tradingName : ''
        values[index].vendorId = vendorObj ? vendorObj.id : ''
        dispatch(onDeleteRoutes(routeEngineData[index].id, routeEngineData[index].tradeId, token))
        this.handleOnRouteChange({
          forNewRoute: newRouteValues,
          forTrasactionCreation: values[index],
          isCrypto: !(
            values[index].routeType === 'fiat_deposit' ||
            values[index].routeType === 'fx' ||
            values[index].routeType === 'accounts_only'
          ),
        })
      } else {
        values[index].vendorName = vendorObj ? vendorObj.tradingName : ''
        values[index].vendorId = vendorObj ? vendorObj.id : ''
        values[index].depositsInPersonalAccount = isDepositsInPersonalAccount
          ? values[index].totalDepositAmount
          : values[index].depositsInPersonalAccount
        values[index].depositsInCorporateAccount = isDepositsInCorporateAccount
          ? values[index].totalDepositAmount
          : values[index].depositsInCorporateAccount
        values[index].totalDepositAmount = values[index].totalDepositAmount || depositAmount
        dispatch(updateRouteData(values[index], tradeId, token))
        if (values[index].transactionId) {
          const {
            id,
            clientId,
            vendorId,
            vendorName,
            depositCurrency,
            settlementCurrency,
            transactionId,
            totalDepositAmount,
          } = values[index]
          const txnData = {
            clientId,
            vendorId,
            tradeId,
            tradeRouterId: id,
            vendorName,
            depositCurrency,
            settlementCurrency,
            totalDepositAmount,
            isDepositsInCorporateAccount,
            isDepositsInPersonalAccount,
          }
          switch (values[index].routeType) {
            case 'fiat_deposit':
            case 'accounts_only':
            case 'fx':
              dispatch(updateTransactionValues(txnData, transactionId, token))
              break
            case 'otc':
            case 'liquidate':
            case 'crypto_wallet':
              dispatch(updateCryptoTransactionValues(txnData, transactionId, token))
              break
            default:
              break
          }
        } else {
          values[index].isDepositsInPersonalAccount = isDepositsInPersonalAccount
          values[index].isDepositsInCorporateAccount = isDepositsInCorporateAccount
          switch (values[index].routeType) {
            case 'fiat_deposit':
            case 'accounts_only':
            case 'fx':
              dispatch(createTransaction(values[index], token))
              break
            case 'otc':
            case 'liquidate':
            case 'crypto_wallet':
              dispatch(createCryptoTransaction(values[index], token))
              break
            default:
              break
          }
        }
      }
    }
  }

  changeRouteType = route => {
    return route === 'accounts_only' ? 'RENTAL_ACCOUNT' : route.toUpperCase()
  }

  onDeleteRoute = id => {
    const { dispatch, tradeId, token } = this.props
    dispatch(onDeleteRoutes(id, tradeId, token))
  }

  render() {
    const {
      routeEngineData,
      vendors,
      tradeStatus,
      deleteRouteLoading,
      createManualRouteLoading,
      classifiedVendors,
      selectedRouteType,
      dispatch,
    } = this.props

    const { routeEngineColumns } = this.state

    if (routeEngineColumns) {
      if (vendors.length !== routeEngineColumns[4].options.length) {
        const vendorsList = classifiedVendors[selectedRouteType]
        dispatch(updateVendor(vendorsList))
        const data = routeEngineColumns
        data[4].options = getFormattedVendorOptions(vendorsList)
        this.setState({
          routeEngineColumns: data,
        })
      }
    }

    const routeEngineMenu = (
      <Menu>
        <Menu.Item onClick={this.addRow}>
          <Icon type="plus" />
          Add Route
        </Menu.Item>
      </Menu>
    )

    return (
      <Card
        className="mt-3"
        title="Routing Engine"
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
          tradeStatus !== 'completed' && (
            <Dropdown overlay={routeEngineMenu} trigger={['click']}>
              <Icon type="setting" />
            </Dropdown>
          )
        }
      >
        <Spin spinning={createManualRouteLoading}>
          <ETable
            columns={routeEngineColumns}
            originData={routeEngineData}
            onsave={(values, index) => this.onRowSave(values, index)}
            deletable
            ondelete={id => this.onDeleteRoute(id)}
            loading={deleteRouteLoading}
          />
        </Spin>
      </Card>
    )
  }
}

export default RouteTable
