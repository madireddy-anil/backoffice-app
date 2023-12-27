import React, { Component } from 'react'
import { Popover, Button, Select, Input, Form, Popconfirm, Radio, Spin } from 'antd'
import { connect } from 'react-redux'

import { amountFormatter } from 'utilities/transformer'

import {
  updateSourceAmount,
  updateSourceCurrency,
  updateBeneficiaryTemp,
} from 'redux/trade/actions'

import { getBeneficiaryByClientId, getCryptoBeneficiaryByClientId } from 'redux/newTrade/actions'

import Beneficiary from '../beneficiary'

import styles from './style.module.scss'

const mapStateToProps = ({ settings, trade, general, newTrade, user }) => ({
  timeZone: settings.timeZone.value,
  sourceAmount: trade.sourceAmount,
  sourceCurrency: trade.sourceCurrency,
  client: general.currentTradeClient,
  loading: newTrade.isBeneficiaryFetching,
  token: user.token,
})

const { Option } = Select

@Form.create()
@connect(mapStateToProps)
class Source extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  hideSourcePopOver = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleSourceChange = visible => {
    this.setState({ visible })
  }

  // onSourceChange = value => {
  //   // console.log(`selected ${value}`);
  //   this.setState({
  //     sourceCurrency: value,
  //   })
  // }

  handleSourceAmountChange = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(updateSourceAmount(value ? parseFloat(value) : null))
    // this.setState({ sourceAmount: value ? parseFloat(value) : null })
  }

  handleSourceCurrencyChange = value => {
    const { dispatch } = this.props
    dispatch(updateSourceCurrency(value))
  }

  onBlurHandler = value => {
    const { form } = this.props
    const formatedAmount = amountFormatter(value)
    form.setFieldsValue({
      sourceAmount: formatedAmount,
    })
  }

  onFocusHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      sourceAmount: value,
    })
  }

  getEditSource = () => {
    const { srcCurrencies, form, depositCurrency, totalDepositAmount, sourceAmount } = this.props
    // const { sourceAmount } = this.state
    const srcOption = srcCurrencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('sourceCurrency', {
            initialValue: depositCurrency,
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a Source Currency"
              optionFilterProp="children"
              // onChange={this.onSourceChange}
              onChange={this.handleSourceCurrencyChange}
              onSearch={this.onSearch}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {srcOption}
            </Select>,
          )}
        </Form.Item>
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('sourceAmount', {
            initialValue: amountFormatter(totalDepositAmount),
          })(
            <Input
              onChange={this.handleSourceAmountChange}
              onBlur={() => this.onBlurHandler(sourceAmount)}
              onFocus={() => this.onFocusHandler(sourceAmount)}
            />,
          )}
        </Form.Item>
        {/* <Button className="mt-2" type="primary" onClick={this.updateSource}>
          Update
        </Button> */}
        <Popconfirm
          title="Sure to update?"
          onConfirm={() => {
            this.updateSource()
          }}
        >
          <Button className="mt-2" type="primary">
            Update
          </Button>
        </Popconfirm>
      </Form>
    )
  }

  updateSource = () => {
    const { id, onSourceUpdate, sourceCurrency, sourceAmount } = this.props
    const values = {
      sourceCurrency,
      sourceAmount,
      id,
    }
    if (onSourceUpdate) onSourceUpdate(values)
    this.hideSourcePopOver()
  }

  handleSettlementPreference = value => {
    const { client, token, dispatch } = this.props
    if (value.target.value === 'fiat') {
      dispatch(getBeneficiaryByClientId(client.id, token))
    } else {
      dispatch(getCryptoBeneficiaryByClientId(client.id, token))
    }
    dispatch(updateBeneficiaryTemp())
  }

  getSettlementPreference = () => {
    const { client, beneficiary } = this.props
    if (client?.profile) {
      if (client.profile.settlementPreferences.length !== 1) {
        return (
          <div className="mt-4">
            <h6>
              <strong>Settlement Preference :</strong>
            </h6>
            <Radio.Group
              defaultValue={beneficiary.cryptoCurrency ? 'crypto' : 'fiat'}
              onChange={this.handleSettlementPreference}
            >
              <Radio value="crypto">Crypto</Radio>
              <Radio value="fiat">Fiat</Radio>
            </Radio.Group>
          </div>
        )
      }
    }
    return null
  }

  render() {
    const {
      id,
      isEditMode,
      depositCurrency,
      totalDepositAmount,
      onBeneUpdate,
      clientBeneficiaries,
      loading,
      beneficiary,
    } = this.props
    const { visible } = this.state
    return (
      <Spin tip="Fetching Beneficiary" spinning={loading}>
        <div className={isEditMode ? `${styles.fullWidth}` : `${styles.halfWidth}`}>
          <div className="mt-4">
            <h6>
              <strong>Deposit Currency and Amount:</strong>
            </h6>
            <div>
              {isEditMode ? (
                <Popover
                  content={this.getEditSource()}
                  title="Deposit Currency and Amount"
                  trigger="click"
                  placement="topLeft"
                  visible={visible}
                  onVisibleChange={this.handleVisibleSourceChange}
                  arrowPointAtCenter
                >
                  <span className="font-size-12 edit-mode">{depositCurrency}</span>
                  <span className="font-size-12 ml-3 edit-mode">
                    {amountFormatter(totalDepositAmount)}
                  </span>
                </Popover>
              ) : (
                <div className={`${styles.inputBox} ${styles.flex}`}>
                  <div className={styles.leftInput}>{depositCurrency}</div>
                  <div className={styles.rightInput}>{amountFormatter(totalDepositAmount)}</div>
                </div>
              )}
            </div>
          </div>
          <div className={isEditMode ? `${styles.onEdit}` : ''}>
            {isEditMode && this.getSettlementPreference()}
            <div>
              <Beneficiary
                id={id}
                beneficiary={beneficiary}
                clientBeneficiaries={clientBeneficiaries}
                isEditMode={isEditMode}
                onBeneUpdate={onBeneUpdate}
              />
            </div>
          </div>
        </div>
      </Spin>
    )
  }
}
export default Source
