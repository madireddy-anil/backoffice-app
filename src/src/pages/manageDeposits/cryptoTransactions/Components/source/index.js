import React, { Component } from 'react'
import { Row, Col, Popover, Button, Select, Input, Form, Popconfirm } from 'antd'
import { connect } from 'react-redux'

import { amountFormatter } from 'utilities/transformer'

import {
  updateTxnSourceAmount,
  updateTxnSourceCurrency,
  updateTxnSourceDetails,
  updateTransactionValues,
} from 'redux/cryptoTransactions/actions'

import Beneficiary from '../beneficiary'

import styles from './style.module.scss'

const mapStateToProps = ({ settings, trade, cryptoTransaction, general }) => ({
  timeZone: settings.timeZone.value,
  totalDepositAmount: cryptoTransaction.selectedTransaction.totalDepositAmount,
  depositCurrency: cryptoTransaction.selectedTransaction.depositCurrency,
  isEditCryptoTxnMode: cryptoTransaction.isEditCryptoTxnMode,
  currencies: general.currencies,
  clientBeneficiaries: general.clientBeneficiaries,
  tradeId: trade.tradeId,
  selectedTransaction: cryptoTransaction.selectedTransaction,
})

const { Option } = Select

@Form.create()
@connect(mapStateToProps)
class Source extends Component {
  state = {
    visible: false,
  }

  hideSourcePopOver = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleSourceChange = visible => {
    this.setState({ visible })
  }

  handleSourceAmountChange = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(updateTxnSourceAmount(value ? parseFloat(value) : null))
  }

  handleSourceCurrencyChange = value => {
    const { dispatch } = this.props
    dispatch(updateTxnSourceCurrency(value))
  }

  onBlurHandler = value => {
    console.log(value)
    const { form } = this.props
    const formatedAmount = amountFormatter(value)
    form.setFieldsValue({
      totalDepositAmount: formatedAmount,
    })
  }

  onFocusHandler = value => {
    console.log(value)
    const { form } = this.props
    form.setFieldsValue({
      totalDepositAmount: value,
    })
  }

  getEditSource = () => {
    const { currencies, form, depositCurrency, totalDepositAmount } = this.props
    const srcOption = currencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.title}
      </Option>
    ))
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('depositCurrency', {
            initialValue: depositCurrency,
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a Source Currency"
              optionFilterProp="children"
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
          {form.getFieldDecorator('totalDepositAmount', {
            initialValue: amountFormatter(totalDepositAmount),
          })(
            <Input
              onChange={this.handleSourceAmountChange}
              onBlur={() => this.onBlurHandler(totalDepositAmount)}
              onFocus={() => this.onFocusHandler(totalDepositAmount)}
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

  onSourceUpdate = values => {
    const {
      dispatch,
      token,
      selectedTransaction: { id },
    } = this.props
    const payload = {
      depositCurrency: values.depositCurrency,
      totalDepositAmount: values.totalDepositAmount,
    }
    Promise.resolve(dispatch(updateTxnSourceDetails(values))).then(
      dispatch(updateTransactionValues(payload, id, token)),
    )
  }

  updateSource = () => {
    const { depositCurrency, totalDepositAmount } = this.props
    const values = {
      depositCurrency,
      totalDepositAmount,
    }
    this.onSourceUpdate(values)
    this.hideSourcePopOver()
  }

  render() {
    const {
      isEditCryptoTxnMode,
      depositCurrency,
      totalDepositAmount,
      beneficiary,
      clientBeneficiaries,
      tradeId,
    } = this.props
    const { visible } = this.state
    return (
      <Row>
        <Col className="mt-4" xs={{ span: 24 }} lg={{ span: 12 }}>
          <div>
            <h6>
              <strong>Deposit Currency and Amount:</strong>
            </h6>
            <div>
              {isEditCryptoTxnMode ? (
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
        </Col>
        <Beneficiary
          id={tradeId}
          beneficiary={beneficiary}
          clientBeneficiaries={clientBeneficiaries}
          isEditMode={isEditCryptoTxnMode}
        />
      </Row>
    )
  }
}
export default Source
