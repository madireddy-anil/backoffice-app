import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Menu, Icon, Card, Dropdown, Spin } from 'antd'
import _ from 'lodash'

import ETable from 'components/LayoutComponents/EditableTable'
import {
  formatToZoneDateOnly,
  amountFormatter,
  getFormattedCurrencyOptions,
} from 'utilities/transformer'

import { updateSellRate, createManualRate, deleteTradeRate } from 'redux/trade/actions'

const mapStateToProps = ({ user, trade, settings, general }) => ({
  timeZone: settings.timeZone.value,
  currencies: general.currencies,
  deleteTradeRateLoading: trade.deleteTradeRateLoading,
  createManualRateLoading: trade.createManualRateLoading,
  sellRates: trade.sellRates,
  tradeId: trade.tradeId,
  clientId: trade.clientId,
  token: user.token,
  baseCurrency: trade.sourceCurrency,
  totalDepositAmount: trade.totalDepositAmount,
  tradeStatus: trade.tradeStatus,
})

@connect(mapStateToProps)
class RouteTable extends Component {
  componentDidUpdate(prevProps) {
    const { sellRates } = this.props
    if (JSON.stringify(prevProps.sellRates) !== JSON.stringify(sellRates)) {
      this.render()
    }
  }

  onRowSave = (values, index) => {
    const { dispatch, tradeId, token } = this.props
    if (index > -1) {
      dispatch(updateSellRate({ payload: values[index], tradeId, token }))
    }
  }

  addRow = () => {
    const {
      sellRates,
      tradeId,
      sellRateReference,
      baseCurrency,
      clientId,
      dispatch,
      token,
    } = this.props
    const lastRateIndex = sellRates.length - 1
    const newRow = {
      tradeId,
      clientId,
      sellRateReference,
      baseAmount: 1,
      baseCurrency: lastRateIndex === -1 ? baseCurrency : sellRates[lastRateIndex].baseCurrency,
      targetCurrency: lastRateIndex === -1 ? baseCurrency : sellRates[lastRateIndex].targetCurrency,
      quoteStatus: 'new',
    }
    dispatch(createManualRate(newRow, token))
  }

  deleteTradeRate = id => {
    const { dispatch, tradeId, token } = this.props
    const values = {
      tradeId,
      sellRateId: id,
    }
    dispatch(deleteTradeRate(values, token))
  }

  render() {
    const {
      sellRates,
      currencies,
      timeZone,
      tradeStatus,
      deleteTradeRateLoading,
      createManualRateLoading,
    } = this.props

    const sellRatesMenu = (
      <Menu>
        <Menu.Item onClick={this.addRow}>
          <Icon type="plus" />
          Add Sell Rate
        </Menu.Item>
      </Menu>
    )

    const nullSymbol = '---'
    // const checkNumberDecimal = value => {
    //   if(value.$numberDecimal){
    //     return parseFloat(value.$numberDecimal)
    //   }
    //   return value
    // }
    const sellRatesColumns = [
      {
        title: 'Date',
        dataIndex: 'createdAt',
        editable: false,
        align: 'center',
        inputType: 'text',
        render: date => formatToZoneDateOnly(date, timeZone),
      },
      // {
      //   title: 'Base Rate ID',
      //   dataIndex: 'sellRateReference',
      //   width: '10%',
      //   editable: false,
      //   align: 'center',
      //   inputType: 'text',
      // },
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
        title: 'Inverse Amount',
        dataIndex: 'inverseAmount',
        editable: true,
        width: '8%',
        align: 'center',
        inputType: 'text',
        render: amount => (amount ? amountFormatter(amount) : nullSymbol),
      },
      {
        title: 'Rate',
        dataIndex: 'sellRate',
        editable: true,
        width: '8%',
        align: 'center',
        inputType: 'text',
        render: rate => (rate ? amountFormatter(rate) : nullSymbol),
      },
      {
        title: 'Settlement Amount',
        dataIndex: 'settlementAmount',
        editable: true,
        width: '8%',
        align: 'center',
        inputType: 'text',
        render: amount => (amount ? amountFormatter(amount) : nullSymbol),
      },
      {
        title: 'Is Indicative Rate',
        dataIndex: 'isIndicative',
        editable: true,
        align: 'center',
        width: '15%',
        inputType: 'text',
        render: status => (status === true ? 'TRUE' : 'FALSE'),
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
        title: 'Quote Status',
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
        title="Sell Rates"
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
            <Dropdown overlay={sellRatesMenu} trigger={['click']}>
              <Icon type="setting" />
            </Dropdown>
          )
        }
      >
        <Spin spinning={createManualRateLoading}>
          <ETable
            columns={sellRatesColumns}
            originData={sellRates}
            onsave={(values, index) => this.onRowSave(values, index)}
            deletable
            ondelete={id => this.deleteTradeRate(id)}
            loading={deleteTradeRateLoading}
          />
        </Spin>
      </Card>
    )
  }
}
export default RouteTable
