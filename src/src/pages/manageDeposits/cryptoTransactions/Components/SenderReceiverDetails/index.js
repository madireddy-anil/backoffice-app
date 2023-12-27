import React, { Component } from 'react'
import { Row, Col, Form, Popover, Input, Button, Popconfirm } from 'antd'
import { connect } from 'react-redux'

import { updateReceiverAddress, updateReceiverHash } from 'redux/cryptoTransactions/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user, cryptoTransaction, trade }) => ({
  token: user.token,
  isEditCryptoTxnMode: cryptoTransaction.isEditCryptoTxnMode,
  cryptoSenderAddressLoading: cryptoTransaction.cryptoSenderAddressLoading,
  cryptoReceiverHashLoading: cryptoTransaction.cryptoReceiverHashLoading,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  tradeId: trade.tradeId,
  recipientBitAddress: cryptoTransaction.selectedTransaction.recipientBitAddress,
  transactionHash: cryptoTransaction.selectedTransaction.transactionHash,
  isTransactionHashConfirmed: cryptoTransaction.isTransactionHashConfirmed,
  isReceipientBitAddressConfirmed: cryptoTransaction.isReceipientBitAddressConfirmed,
})

@Form.create()
@connect(mapStateToProps)
class DepositAmount extends Component {
  state = {
    visibleSender: false,
  }

  updateReceiverBitAddress = () => {
    const { selectedTransaction, dispatch, token, form, tradeId } = this.props
    const value = {
      receipientBitAddress: form.getFieldValue('receipientBitAddress'),
      tradeId,
      cryptoTransactionId: selectedTransaction.id,
    }
    dispatch(updateReceiverAddress(value, token))
    this.setState({ visibleSender: false })
  }

  updateReceiverHash = () => {
    const { selectedTransaction, dispatch, token, form, tradeId } = this.props
    const value = {
      transactionHash: form.getFieldValue('transactionHash'),
      tradeId,
      cryptoTransactionId: selectedTransaction.id,
    }
    dispatch(updateReceiverHash(value, token))
    this.setState({ visibleHash: false })
  }

  handleVisibleVendorChange = visibleSender => {
    this.setState({ visibleSender })
  }

  handleVisibleChangeHash = visibleHash => {
    this.setState({ visibleHash })
  }

  getReceiverEdit = () => {
    const { form, recipientBitAddress } = this.props
    return (
      <div>
        <Form layout="inline">
          <Form.Item className={`${styles.mt1}`} label="">
            {form.getFieldDecorator('receipientBitAddress', {
              initialValue: recipientBitAddress,
            })(<Input />)}
          </Form.Item>
        </Form>
        <Popconfirm
          placement="right"
          title="Sure to update?"
          onConfirm={() => {
            this.updateReceiverBitAddress()
          }}
        >
          <Button className="ml-2" type="primary">
            Update
          </Button>
        </Popconfirm>
        {/* <Button className="ml-1" type="primary" onClick={this.updateReceiverBitAddress}>
          Update
        </Button> */}
      </div>
    )
  }

  getTransactionHashEdit = () => {
    const { form, transactionHash } = this.props
    return (
      <div>
        <Form layout="inline">
          <Form.Item className={`${styles.mt1}`} label="">
            {form.getFieldDecorator('transactionHash', {
              initialValue: transactionHash,
            })(<Input />)}
          </Form.Item>
        </Form>
        {/* <Button className="ml-1" type="primary" onClick={this.updateReceiverHash}>
          Update
        </Button> */}
        <Popconfirm
          placement="right"
          title="Sure to update?"
          onConfirm={() => {
            this.updateReceiverHash()
          }}
        >
          <Button className="ml-2" type="primary">
            Update
          </Button>
        </Popconfirm>
      </div>
    )
  }

  render() {
    const {
      isEditCryptoTxnMode,
      recipientBitAddress,
      transactionHash,
      form,
      cryptoSenderAddressLoading,
      cryptoReceiverHashLoading,
    } = this.props

    const { visibleSender, visibleHash } = this.state

    return (
      <Row>
        <Col className="mt-4" xs={{ span: 24 }} lg={{ span: 24 }}>
          <div>
            <h6>
              <strong>Receiver Address:</strong>
            </h6>
            <div className={styles.prgressContent}>
              <div className={styles.prgressContent}>
                <div>
                  <div>
                    {isEditCryptoTxnMode ? (
                      <Popover
                        content={this.getReceiverEdit()}
                        title="Recipient Bit Address"
                        trigger="click"
                        placement="topLeft"
                        visible={visibleSender}
                        onVisibleChange={this.handleVisibleVendorChange}
                        arrowPointAtCenter
                      >
                        <span className="font-size-12 edit-mode">
                          {recipientBitAddress || '---'}
                        </span>
                      </Popover>
                    ) : (
                      <React.Fragment>
                        <div hidden={recipientBitAddress}>
                          <Form layout="inline">
                            <Form.Item className={`${styles.mt1}`} label="">
                              {form.getFieldDecorator('receipientBitAddress', {
                                initialValue: recipientBitAddress,
                              })(<Input />)}
                            </Form.Item>
                            <Form.Item className={`${styles.mt1}`} label="">
                              <Button
                                className="ml-1"
                                type="primary"
                                onClick={this.updateReceiverBitAddress}
                                loading={cryptoSenderAddressLoading}
                              >
                                Confirm
                              </Button>
                            </Form.Item>
                          </Form>
                        </div>
                        <div className={styles.inputBox} hidden={!recipientBitAddress}>
                          <span className="font-size-15">{recipientBitAddress || '---'}</span>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col className="mt-4" xs={{ span: 24 }} lg={{ span: 24 }}>
          <div>
            <h6>
              <strong>Transaction Hash:</strong>
            </h6>
            <div className={styles.prgressContent}>
              <div>
                <div className={styles.prgressContent}>
                  <div>
                    <div>
                      {isEditCryptoTxnMode ? (
                        <Popover
                          content={this.getTransactionHashEdit()}
                          title="Transaction Hash"
                          trigger="click"
                          placement="topLeft"
                          visible={visibleHash}
                          onVisibleChange={this.handleVisibleChangeHash}
                          arrowPointAtCenter
                        >
                          <span className="font-size-12 edit-mode">{transactionHash || '---'}</span>
                        </Popover>
                      ) : (
                        <React.Fragment>
                          <div className={styles.inputBox} hidden={!transactionHash}>
                            <span className="font-size-15">{transactionHash || '---'}</span>
                          </div>
                          <div hidden={transactionHash}>
                            <Form layout="inline">
                              <Form.Item className={`${styles.mt1}`} label="">
                                {form.getFieldDecorator('transactionHash', {
                                  initialValue: transactionHash,
                                })(<Input />)}
                              </Form.Item>
                              <Form.Item className={`${styles.mt1}`} label="">
                                <Button
                                  className="ml-1"
                                  type="primary"
                                  onClick={this.updateReceiverHash}
                                  loading={cryptoReceiverHashLoading}
                                >
                                  Confirm
                                </Button>
                              </Form.Item>
                            </Form>
                          </div>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}
export default DepositAmount
