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

import { updateFees, createManualFees, deleteTradeFees } from 'redux/trade/actions'

const mapStateToProps = ({ user, transactions, settings, general, trade }) => ({
  timeZone: settings.timeZone.value,
  currencies: general.currencies,
  vendors: general.newVendors,
  selectedTransaction: transactions.selectedTransaction,
  deleteTradeFeesLoading: trade.deleteTradeFeesLoading,
  createManualFeesLoading: trade.createManualFeesLoading,
  fees: transactions.fees,
  rate: transactions.rate,
  token: user.token,
  clientId: trade.clientId,
  tradeId: trade.tradeId,
  tradeStatus: trade.tradeStatus,
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
      dispatch(updateFees(values[index], '', token))
    }
  }

  addRow = () => {
    const {
      fees,
      // tradeId,
      baseCurrency,
      clientId,
      dispatch,
      token,
      selectedTransaction,
    } = this.props
    const lastRateIndex = fees.length - 1
    const newRow = {
      // tradeId,
      clientId,
      transactionId:
        lastRateIndex === -1 ? selectedTransaction.id : fees[lastRateIndex].transactionId,
      feeCurrency: lastRateIndex === -1 ? baseCurrency : fees[lastRateIndex].feeCurrency,
      feeStatus: 'active',
    }
    dispatch(createManualFees(newRow, token))
  }

  fxDeleteFees = id => {
    const { dispatch, token, selectedTransaction } = this.props
    const values = {
      feesId: id,
      transactionId: selectedTransaction.id,
    }
    dispatch(deleteTradeFees(values, token))
  }

  render() {
    const {
      fees,
      vendors,
      currencies,
      timeZone,
      deleteTradeFeesLoading,
      createManualFeesLoading,
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
    const sellRatesFeesColumns = [
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
        options: [
          { id: '11', value: 'conversion', title: 'CONVERSION FEE' },
          { id: '12', value: 'incoming', title: 'INCOMING FEE' },
          { id: '13', value: 'outgoing', title: 'OUTGOING FEE' },
          { id: '14', value: 'intermediary', title: 'INTERMEDIARY BANK FEE' },
          { id: '15', value: 'bank', title: 'BANK FEE' },
        ],
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
          { id: '13', value: 'swapprovider', title: 'SWAP PROVIDER' },
          { id: '14', value: 'fxprovider', title: 'FX PROVIDER' },
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
        <Spin spinning={createManualFeesLoading}>
          <ETable
            columns={sellRatesFeesColumns}
            originData={fees}
            onsave={(values, index) => this.onRowSave(values, index)}
            deletable
            ondelete={id => this.fxDeleteFees(id)}
            loading={deleteTradeFeesLoading}
          />
        </Spin>
      </Card>
    )
  }
}
export default TxnFeesTable
