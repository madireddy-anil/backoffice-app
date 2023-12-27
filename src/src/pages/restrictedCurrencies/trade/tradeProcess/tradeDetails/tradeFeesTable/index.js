import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Menu, Icon, Dropdown, Spin } from 'antd'

import ETable from 'components/LayoutComponents/EditableTable'
import {
  formatToZoneDateOnly,
  amountFormatter,
  getFormattedClientOptions,
  getFormattedCurrencyOptions,
} from 'utilities/transformer'

import {
  updateFees,
  createManualFees,
  deleteTradeFees,
} from 'redux/restrictedCurrencies/trade/tradeProcess/tradeDetails/actions'

const mapStateToProps = ({ user, npTrade, settings, general }) => ({
  timeZone: settings.timeZone.value,
  currencies: general.currencies,
  deleteTradeFeesLoading: npTrade.deleteTradeFeesLoading,
  createManualFeesLoading: npTrade.createManualFeesLoading,
  clients: general.clients,
  tradeFees: npTrade.tradeFees,
  tradeId: npTrade.tradeId,
  clientId: npTrade.clientId,
  token: user.token,
  tradeStatus: npTrade.tradeStatus,
})

@connect(mapStateToProps)
class TradeFeesTable extends Component {
  componentDidUpdate(prevProps) {
    const { tradeFees } = this.props
    if (JSON.stringify(prevProps.tradeFees) !== JSON.stringify(tradeFees)) {
      this.render()
    }
  }

  onRowSave = (values, index) => {
    const { dispatch, tradeId, token } = this.props
    if (index > -1) {
      dispatch(updateFees(values[index], tradeId, token))
    }
  }

  addRow = () => {
    const { tradeFees, tradeId, baseCurrency, clientId, dispatch, token } = this.props
    const lastRateIndex = tradeFees.length - 1
    const newRow = {
      tradeId,
      clientId,
      feeCurrency: lastRateIndex === -1 ? baseCurrency : tradeFees[lastRateIndex].feeCurrency,
      feeStatus: 'active',
    }
    dispatch(createManualFees(newRow, token))
  }

  deleteTradeFees = id => {
    const { dispatch, token, tradeId } = this.props
    const values = {
      tradeId,
      feesId: id,
    }
    dispatch(deleteTradeFees(values, token))
  }

  render() {
    const {
      tradeFees,
      clients,
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
    const feesColumns = [
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
          { id: '11', value: 'pc_revenue', title: 'PC REVENUE' },
          { id: '12', value: 'introducercommission', title: 'INTRODUCER COMMISSION' },
        ],
        render: type => (type ? type.toUpperCase() : nullSymbol),
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
        render: accType => (accType ? accType.toUpperCase() : nullSymbol),
      },
      {
        title: 'Account',
        dataIndex: 'clientId',
        editable: true,
        align: 'center',
        inputType: 'select',
        options: getFormattedClientOptions(clients),
        render: clientId => {
          const clientObj = clients.find(el => el.id === clientId)
          return clientObj ? clientObj.genericInformation.tradingName : nullSymbol
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
        render: status => (status ? status.toUpperCase() : nullSymbol),
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
            columns={feesColumns}
            originData={tradeFees}
            onsave={(values, index) => this.onRowSave(values, index)}
            deletable
            ondelete={id => this.deleteTradeFees(id)}
            loading={deleteTradeFeesLoading}
          />
        </Spin>
      </Card>
    )
  }
}
export default TradeFeesTable
