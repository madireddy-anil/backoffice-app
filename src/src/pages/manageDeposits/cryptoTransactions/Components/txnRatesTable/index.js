import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Menu, Icon, Dropdown, Spin } from 'antd'
import _ from 'lodash'

import ETable from 'components/LayoutComponents/EditableTable'
import {
  formatToZoneDateOnly,
  amountFormatter,
  getFormattedCurrencyOptions,
} from 'utilities/transformer'

import {
  createManualRate,
  updateCryptoRate,
  deleteCryptoRates,
} from 'redux/cryptoTransactions/actions'

const mapStateToProps = ({ user, cryptoTransaction, settings, general, trade }) => ({
  timeZone: settings.timeZone.value,
  currencies: general.currencies,
  deleteCryptoRateLoading: cryptoTransaction.deleteCryptoRateLoading,
  createCryptoManualRateLoading: cryptoTransaction.createCryptoManualRateLoading,
  vendors: general.newVendors,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  rates: cryptoTransaction.rates,
  baseCurrency: trade.sourceCurrency,
  token: user.token,
  tradeId: trade.tradeId,
  clientId: trade.clientId,
  tradeStatus: trade.tradeStatus,
  cryptoTransactions: trade.cryptoTransactions,
})

@connect(mapStateToProps)
class TxnRatesTable extends Component {
  componentDidUpdate(prevProps) {
    const { rates } = this.props
    if (JSON.stringify(prevProps.rates) !== JSON.stringify(rates)) {
      this.render()
    }
  }

  addRow = () => {
    const {
      rates,
      tradeId,
      sellRateReference,
      baseCurrency,
      clientId,
      dispatch,
      token,
      selectedTransaction,
    } = this.props
    const lastRateIndex = rates.length - 1
    const newRow = {
      tradeId,
      clientId,
      sellRateReference,
      cryptoTransactionId: selectedTransaction.id,
      baseCurrency: lastRateIndex === -1 ? baseCurrency : rates[lastRateIndex].baseCurrency,
      targetCurrency: lastRateIndex === -1 ? baseCurrency : rates[lastRateIndex].targetCurrency,
      quoteStatus: 'new',
      rateCategory: 'buy',
    }
    dispatch(createManualRate(newRow, token))
  }

  onRowSave = (values, index) => {
    const { dispatch, token } = this.props
    if (index > -1) {
      dispatch(updateCryptoRate({ payload: values[index], token }))
    }
  }

  deleteSwapRate = id => {
    const { dispatch, token, selectedTransaction } = this.props
    const values = {
      cryptoTransactionId: selectedTransaction.id,
      sellRateId: id,
    }
    dispatch(deleteCryptoRates(values, token))
  }

  render() {
    const {
      // rates,
      currencies,
      timeZone,
      deleteCryptoRateLoading,
      createCryptoManualRateLoading,
      cryptoTransactions,
      selectedTransaction,
    } = this.props

    let currentTransaction = {
      buyRates: [],
    }
    if (selectedTransaction.id !== '') {
      currentTransaction = cryptoTransactions.find(el => el.id === selectedTransaction.id)
    }

    const sellRatesMenu = (
      <Menu>
        <Menu.Item onClick={this.addRow}>
          <Icon type="plus" />
          Add Buy Rate
        </Menu.Item>
      </Menu>
    )

    const nullSymbol = '---'
    const swapRatesColumns = [
      {
        title: 'Date',
        dataIndex: 'createdAt',
        editable: false,
        align: 'center',
        inputType: 'text',
        render: date => formatToZoneDateOnly(date, timeZone),
      },
      {
        title: 'Base Rate ID',
        dataIndex: 'cryptoRateReference',
        width: '10%',
        editable: false,
        align: 'center',
        inputType: 'text',
      },
      {
        title: 'Rate Type',
        dataIndex: 'rateType',
        editable: true,
        width: '7%',
        align: 'center',
        inputType: 'select',
        options: [
          { id: '11', value: 'fixed', title: 'FIXED' },
          { id: '12', value: 'variable', title: 'VARIABLE' },
        ],
      },
      {
        title: 'Base Currency',
        dataIndex: 'baseCurrency',
        editable: true,
        width: '8%',
        align: 'center',
        inputType: 'select',
        options: getFormattedCurrencyOptions(currencies),
      },
      {
        title: 'Base Amount',
        dataIndex: 'baseAmount',
        editable: true,
        width: '10%',
        align: 'center',
        inputType: 'text',
        render: amount => (amount ? amountFormatter(amount) : nullSymbol),
      },
      {
        title: 'Target Currency',
        dataIndex: 'targetCurrency',
        editable: true,
        width: '10%',
        align: 'center',
        inputType: 'select',
        options: getFormattedCurrencyOptions(currencies),
      },
      {
        title: 'Target Amount',
        dataIndex: 'targetAmount',
        editable: true,
        width: '10%',
        align: 'center',
        inputType: 'text',
        render: amount => (amount ? amountFormatter(amount) : nullSymbol),
      },
      {
        title: 'Sell Rate',
        dataIndex: 'sellRate',
        editable: true,
        width: '10%',
        align: 'center',
        inputType: 'text',
      },
      {
        title: 'Inverse Amount',
        dataIndex: 'inverseAmount',
        editable: true,
        width: '10%',
        align: 'center',
        inputType: 'text',
        render: amount => (amount ? amountFormatter(amount) : nullSymbol),
      },
      {
        title: 'Rate Status',
        dataIndex: 'rateStatus',
        editable: true,
        align: 'center',
        inputType: 'select',
        options: [
          { id: '000', value: 'active', title: 'ACTIVE' },
          { id: '001', value: 'in_active', title: 'IN ACTIVE' },
        ],
        render: status => (status ? _.upperCase(status) : nullSymbol),
      },
      {
        title: 'Status',
        dataIndex: 'quoteStatus',
        editable: true,
        align: 'center',
        width: '15%',
        inputType: 'select',
        options: [
          { id: '000', value: 'new', title: 'NEW' },
          { id: '001', value: 'quote_confirmed', title: 'QUOTE CONFIRMED' },
          { id: '002', value: 'quote_expired', title: 'QUOTE EXPIRED' },
          { id: '003', value: 'quote_review', title: 'QUOTE REVIEW' },
          { id: '004', value: 'quote_cancelled', title: 'QUOTE CANCELLED' },
        ],
        render: status => (status ? _.upperCase(status) : nullSymbol),
      },
    ]

    return (
      <Card
        className="mt-3"
        title="Buy Rates"
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
          <Dropdown overlay={sellRatesMenu} trigger={['click']}>
            <Icon type="setting" />
          </Dropdown>
        }
      >
        <Spin spinning={createCryptoManualRateLoading}>
          <ETable
            columns={swapRatesColumns}
            originData={currentTransaction ? currentTransaction.buyRates : []}
            onsave={(values, index) => this.onRowSave(values, index)}
            deletable
            ondelete={id => this.deleteSwapRate(id)}
            loading={deleteCryptoRateLoading}
          />
        </Spin>
      </Card>
    )
  }
}
export default TxnRatesTable
