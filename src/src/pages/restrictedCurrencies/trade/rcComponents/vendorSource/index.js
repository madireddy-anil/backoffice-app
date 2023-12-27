import React, { Component } from 'react'
import { Row, Col, Popover, Button, Select, Input, Form, Popconfirm } from 'antd'
import { connect } from 'react-redux'

import { amountFormatter } from 'utilities/transformer'
import {
  updateTxnSourceAmount,
  updateTxnSourceCurrency,
} from 'redux/restrictedCurrencies/trade/tradeProcess/transactions/actions'

import Beneficiary from '../vendorBeneficiary'

import styles from './style.module.scss'

const mapStateToProps = ({ settings, npTransactions }) => ({
  timeZone: settings.timeZone.value,
  sourceAmount: npTransactions.selectedTransaction.sourceAmount,
  sourceCurrency: npTransactions.selectedTransaction.sourceCurrency,
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

  handleSourceCurrencyChange = value => {
    const { dispatch } = this.props
    dispatch(updateTxnSourceCurrency(value))
  }

  handleSourceAmountChange = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(updateTxnSourceAmount(value ? parseFloat(value) : null))
    // this.setState({ sourceAmount: value ? parseFloat(value) : null })
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
    const { srcCurrencies, form, totalDepositAmount, sourceAmount, sourceCurrency } = this.props
    const srcOption = srcCurrencies.map(option => (
      <Option key={option.id} value={option.value}>
        {option.value}
      </Option>
    ))
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('sourceCurrency', {
            initialValue: sourceCurrency,
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

  render() {
    const {
      id,
      isEditMode,
      depositCurrency,
      totalDepositAmount,
      beneficiary,
      clientBeneficiaries,
      onBeneUpdate,
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
        </Col>
        <Beneficiary
          id={id}
          beneficiary={beneficiary}
          clientBeneficiaries={clientBeneficiaries}
          isEditMode={isEditMode}
          onBeneUpdate={onBeneUpdate}
        />
      </Row>
    )
  }
}
export default Source
