import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Popover, Popconfirm } from 'antd'
import { connect } from 'react-redux'

import { amountFormatter } from 'utilities/transformer'
import {
  enteredAmountSoldInCrypto,
  updateCryptoTransactionValues,
} from 'redux/cryptoTransactions/actions'
import styles from './style.module.scss'

const mapStateToProps = ({ user, cryptoTransaction }) => ({
  token: user.token,
  isEditTxnMode: cryptoTransaction.isEditCryptoTxnMode,
  amountSold: cryptoTransaction.selectedTransaction.amountSold,
  isAmountSoldConfirmed: cryptoTransaction.isAmountSoldConfirmed,
  transactionId: cryptoTransaction.selectedTransaction.id,
  confirmAmountSoldLoader: cryptoTransaction.confirmAmountSoldLoader,
  depositCurrency: cryptoTransaction.selectedTransaction.depositCurrency,
})

@Form.create()
@connect(mapStateToProps)
class AmountSold extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      enteredAmount: props.amountSold,
    }
  }

  componentDidUpdate(prevProps) {
    const { amountSold } = this.props
    if (prevProps.amountSold !== amountSold) {
      this.setEnteredAmount()
    }
  }

  setEnteredAmount = () => {
    const { amountSold } = this.props
    this.setState({ enteredAmount: amountSold })
  }

  hideAmountSoldPopOver = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleAmountSoldChange = visible => {
    this.setState({ visible })
  }

  handleAmountSoldChange = e => {
    const { dispatch } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    dispatch(enteredAmountSoldInCrypto(value ? parseFloat(value) : null))
  }

  handleEditAmountSoldChange = e => {
    const { form } = this.props
    let { value } = e.target
    value = value.replace(/,/g, '')
    form.setFieldsValue({
      amountSold: value ? parseFloat(value) : null,
    })
    this.setState({ enteredAmount: value ? parseFloat(value) : null })
  }

  onAmountSoldBlurHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      amountSold: amountFormatter(value),
    })
  }

  onAmountSoldFocusHandler = value => {
    const { form } = this.props
    form.setFieldsValue({
      amountSold: value,
    })
  }

  handleEditAmountSoldConfirm = () => {
    const { dispatch, form, token, transactionId } = this.props

    form.validateFields((err, value) => {
      if (!err) {
        value.amountSold = value.amountSold.replace(/,/g, '')
        console.log(value)
        const txnValues = {
          amountSold: value.amountSold ? parseFloat(value.amountSold) : null,
        }
        dispatch(updateCryptoTransactionValues(txnValues, transactionId, token))
      }
    })
  }

  handleAmountSoldConfirm = () => {
    const { dispatch, amountSold, token, transactionId } = this.props
    const txnValues = {
      amountSold,
    }
    dispatch(updateCryptoTransactionValues(txnValues, transactionId, token))
  }

  getEditAmountSold = () => {
    const { form, amountSold } = this.props
    const { enteredAmount } = this.state
    return (
      <Form layout="inline">
        <Form.Item className={`${styles.mt1}`} label="">
          {form.getFieldDecorator('amountSold', {
            initialValue: amountFormatter(amountSold),
          })(
            <Input
              onChange={this.handleEditAmountSoldChange}
              onBlur={() => this.onAmountSoldBlurHandler(enteredAmount)}
              onFocus={() => this.onAmountSoldFocusHandler(enteredAmount)}
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Popconfirm
            placement="right"
            title="Sure to update?"
            onConfirm={() => {
              this.updateAmountSold()
            }}
          >
            <Button className="ml-2" type="primary">
              Update
            </Button>
          </Popconfirm>
          {/* <Button className="mt-2" type="primary" onClick={this.updateAmountSold}>
            Update
          </Button> */}
        </Form.Item>
      </Form>
    )
  }

  updateAmountSold = () => {
    this.handleEditAmountSoldConfirm()
    this.hideAmountSoldPopOver()
  }

  render() {
    const {
      isAmountSoldConfirmed,
      amountSold,
      form,
      isEditTxnMode,
      confirmAmountSoldLoader,
      depositCurrency,
    } = this.props
    const { visible } = this.state
    return (
      <Row className="mt-4">
        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
          <div>
            <h6>
              <strong>Amount Sold Confirmation:</strong>
            </h6>
            <div className={styles.prgressContent}>
              {isAmountSoldConfirmed ? (
                <div className="rates-card">
                  <span className="font-size-12">Amount Sold:</span>
                  <div className={styles.prgressContent}>
                    <div>
                      <div className="pt-3">
                        {isEditTxnMode ? (
                          <Popover
                            content={this.getEditAmountSold()}
                            title="Amount Sold"
                            trigger="click"
                            placement="topLeft"
                            visible={visible}
                            onVisibleChange={this.handleVisibleAmountSoldChange}
                            arrowPointAtCenter
                          >
                            <span className="font-size-15">
                              <span>Amount Sold is </span>
                              <strong className="px-2">{depositCurrency}</strong>
                              <strong className="edit-mode">
                                {amountSold ? amountFormatter(amountSold) : ''}
                              </strong>{' '}
                            </span>
                          </Popover>
                        ) : (
                          <span className="font-size-15">
                            <strong>
                              Amount Sold is {`${depositCurrency}  ${amountFormatter(amountSold)}`}
                            </strong>{' '}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div>
                    <div className="pb-3">
                      <span className="font-size-12">Please confirm total amount sold</span>
                    </div>
                    <Form.Item label="">
                      {form.getFieldDecorator('amountSold', {
                        initialValue: amountFormatter(amountSold),
                        rules: [{ message: 'Please Enter Amount Sold!' }],
                      })(
                        <Input
                          addonBefore={depositCurrency}
                          style={{ width: '50%' }}
                          onChange={this.handleAmountSoldChange}
                          onBlur={() => this.onAmountSoldBlurHandler(amountSold)}
                          onFocus={() => this.onAmountSoldFocusHandler(amountSold)}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        className="mr-3"
                        loading={confirmAmountSoldLoader}
                        onClick={this.handleAmountSoldConfirm}
                        disabled={amountSold === 0 || amountSold === null}
                      >
                        Confirm Amount
                      </Button>
                    </Form.Item>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
export default AmountSold
