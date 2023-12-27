import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Menu, Dropdown, Icon, Spin } from 'antd'

import ETable from 'components/LayoutComponents/EditableTable'
import {
  formatToZoneDateOnly,
  amountFormatter,
  getFormattedVendorOptions,
  getFormattedCurrencyOptions,
} from 'utilities/transformer'

import {
  createManualFees,
  updateCryptoFees,
  deleteCryptoFees,
} from 'redux/cryptoTransactions/actions'

const mapStateToProps = ({ user, cryptoTransaction, settings, general, trade }) => ({
  timeZone: settings.timeZone.value,
  currencies: general.currencies,
  deleteCryptoFeesLoading: cryptoTransaction.deleteCryptoFeesLoading,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  createCryptoManualFeesLoading: cryptoTransaction.createCryptoManualFeesLoading,
  fees: cryptoTransaction.fees,
  rate: cryptoTransaction.rates,
  token: user.token,
  tradeId: trade.tradeId,
  clientId: trade.clientId,
  tradeStatus: trade.tradeStatus,
  currentRouteType: cryptoTransaction.currentRouteType,
  vendors: general.newVendors,
})

@connect(mapStateToProps)
class TxnFeesTable extends Component {
  componentDidUpdate(prevProps) {
    const { fees } = this.props
    if (JSON.stringify(prevProps.fees) !== JSON.stringify(fees)) {
      this.render()
    }
  }

  onRowSave = (values, index) => {
    const { dispatch, token } = this.props
    if (index > -1) {
      dispatch(updateCryptoFees(values[index], values[0].id, token))
    }
  }

  addRow = () => {
    const {
      fees,
      tradeId,
      baseCurrency,
      clientId,
      dispatch,
      token,
      selectedTransaction,
    } = this.props
    const lastRateIndex = fees.length - 1
    const newRow = {
      tradeId,
      clientId,
      cryptoTransactionId: selectedTransaction.id,
      feeCurrency: lastRateIndex === -1 ? baseCurrency : fees[lastRateIndex].feeCurrency,
      feeStatus: 'active',
    }
    dispatch(createManualFees(newRow, token))
  }

  deleteSwapRate = id => {
    const { dispatch, token, selectedTransaction } = this.props
    const values = {
      feesId: id,
      cryptoTransactionId: selectedTransaction.id,
    }
    dispatch(deleteCryptoFees(values, token))
  }

  getFeeTypeOptions = () => {
    const { currentRouteType } = this.props
    switch (currentRouteType) {
      case 'otc':
        return [{ id: '11', value: 'conversion', title: 'CONVERSION FEE' }]
      case 'liquidate':
        return [
          { id: '11', value: 'conversion', title: 'CONVERSION FEE' },
          { id: '12', value: 'incoming', title: 'INCOMING FEE' },
          { id: '13', value: 'outgoing', title: 'OUTGOING FEE' },
          { id: '14', value: 'intermediary', title: 'INTERMEDIARY BANK FEE' },
          { id: '15', value: 'bank', title: 'BANK FEE' },
        ]
      default:
        return false
    }
  }

  render() {
    const {
      vendors,
      currencies,
      timeZone,
      fees,
      deleteCryptoFeesLoading,
      createCryptoManualFeesLoading,
    } = this.props

    const feesMenu = (
      <Menu>
        <Menu.Item onClick={this.addRow}>
          <Icon type="plus" />
          Add Fees
        </Menu.Item>
      </Menu>
    )

    const nullSymbol = '---'
    const swapFeesColumns = [
      {
        title: 'Date Initiated',
        dataIndex: 'createdAt',
        editable: false,
        align: 'center',
        inputType: 'text',
        render: date => formatToZoneDateOnly(date, timeZone),
      },
      {
        title: 'Fee ID',
        dataIndex: 'feeReference',
        editable: false,
        align: 'center',
        inputType: 'text',
      },
      {
        title: 'Fee Type',
        dataIndex: 'feeType',
        editable: true,
        align: 'center',
        inputType: 'select',
        options: this.getFeeTypeOptions(),
      },
      {
        title: 'Account Type',
        dataIndex: 'accountType',
        editable: true,
        align: 'center',
        inputType: 'select',
        options: [
          { id: '11', value: 'payconstruct', title: 'PAYCONSTRUCT' },
          { id: '12', value: 'merchant', title: 'MERCHANT' },
          { id: '13', value: 'swap', title: 'SWAP PROVIDER' },
          { id: '14', value: 'fx', title: 'FX PROVIDER' },
          { id: '21', value: 'introducer', title: 'INTRODUCER' },
        ],
      },
      {
        title: 'Account',
        dataIndex: 'vendorId',
        editable: true,
        align: 'center',
        inputType: 'select',
        options: getFormattedVendorOptions(vendors),
        render: vendorId => {
          const vendor = vendors.find(el => el.id === vendorId)
          return vendor ? vendor.genericInformation?.tradingName : nullSymbol
        },
      },
      {
        title: '% Expected Spread',
        dataIndex: 'agreedSpread',
        editable: true,
        align: 'center',
        inputType: 'text',
      },
      {
        title: '% Actual Spread',
        dataIndex: 'actualSpread',
        editable: true,
        align: 'center',
        inputType: 'text',
      },
      {
        title: 'Fee Currency',
        dataIndex: 'feeCurrency',
        editable: true,
        align: 'center',
        inputType: 'select',
        options: getFormattedCurrencyOptions(currencies),
      },
      {
        title: 'Expected Fees',
        dataIndex: 'expectedFees',
        editable: true,
        align: 'center',
        inputType: 'text',
        render: amount => (amount ? amountFormatter(amount) : nullSymbol),
      },
      {
        title: 'Actual Fees',
        dataIndex: 'actualFees',
        editable: true,
        align: 'center',
        inputType: 'text',
        render: amount => (amount ? amountFormatter(amount) : nullSymbol),
      },
      {
        title: '% Difference',
        dataIndex: 'spreadDifference',
        editable: true,
        align: 'center',
        inputType: 'text',
        render: diff => (diff ? `${diff} %` : nullSymbol),
      },
      {
        title: 'Difference',
        dataIndex: 'feesDifference',
        editable: true,
        align: 'center',
        inputType: 'text',
      },
      {
        title: 'Status',
        dataIndex: 'feeStatus',
        editable: true,
        align: 'center',
        inputType: 'select',
        options: [
          { id: '000', value: 'active', title: 'ACTIVE' },
          { id: '001', value: 'inactive', title: 'IN ACTIVE' },
        ],
      },
    ]

    return (
      <Card
        className="mt-3"
        title="Fees"
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
          <Dropdown overlay={feesMenu} trigger={['click']}>
            <Icon type="setting" />
          </Dropdown>
        }
      >
        <Spin spinning={createCryptoManualFeesLoading}>
          <ETable
            columns={swapFeesColumns}
            originData={fees}
            onsave={(values, index) => this.onRowSave(values, index)}
            deletable
            ondelete={id => this.deleteSwapRate(id)}
            loading={deleteCryptoFeesLoading}
          />
        </Spin>
      </Card>
    )
  }
}
export default TxnFeesTable
