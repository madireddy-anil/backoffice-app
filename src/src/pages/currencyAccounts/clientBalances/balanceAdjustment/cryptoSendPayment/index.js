import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Form, Input, InputNumber, Steps, Card, Divider, Modal } from 'antd'
import AuthorizationModal from 'components/customComponents/AuthorizationModal'
import { initiateCryptoPayment } from 'redux/caBalanceAdjustments/actions'
import { updateSelectedPaymentType } from 'redux/caTransactions/actions'
import { twoFAauthorizationModal } from 'redux/auth0/actions'
import jsonData from './data.json'

import styles from './style.module.scss'

const { Step } = Steps

const mapStateToProps = ({ user, caTransactions, caBalanceAdjustments, auth0 }) => ({
  token: user.token,
  selectedAccountDetails: caTransactions.selectedAccountDetails,
  loading: caBalanceAdjustments.loading,
  twoFAauthModal: auth0.twoFAauthModal,
  paymentType: caTransactions.paymentType,
})

@withRouter
@Form.create()
@connect(mapStateToProps)
class ManualCredit extends React.Component {
  state = {
    walletAddress: '',
    amount: undefined,
    step: 0,
    parameters: {},
    selectedCurrencyImageData: {},
    authValue: {},
  }

  componentDidMount() {
    const { selectedAccountDetails } = this.props
    const currencyData = jsonData.currencyList.filter(
      list => list.title === selectedAccountDetails.currency,
    )
    this.setState({ selectedCurrencyImageData: currencyData[0] })
  }

  onSubmitHandle = () => {
    const { amount, walletAddress } = this.state
    const { selectedAccountDetails, dispatch } = this.props
    const value = {
      accountId: selectedAccountDetails.accountId,
      amount,
      walletAddress,
    }
    this.setState({ parameters: value })
    dispatch(twoFAauthorizationModal(true))
  }

  handleAuthroizePayment = event => {
    event.preventDefault()
    const { form, token, dispatch, selectedAccountDetails } = this.props
    const { parameters } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        this.setState({ authValue: values })
        dispatch(initiateCryptoPayment(selectedAccountDetails.id, parameters, token))
      }
    })
  }

  handleCancel = () => {
    const { dispatch } = this.props
    dispatch(updateSelectedPaymentType(''))
  }

  handleWalletAddress = e => {
    const { amount } = this.state
    this.setState({ walletAddress: e.target.value, step: 1 })
    if (amount) {
      this.setState({ step: 1 })
    }
  }

  handleAmount = value => {
    const { walletAddress } = this.state
    this.setState({ amount: value })
    if (walletAddress) {
      this.setState({ step: 1 })
    }
  }

  render() {
    const { form, loading, twoFAauthModal } = this.props
    const {
      amount,
      displayAmount,
      walletAddress,
      step,
      unUsedValues,
      selectedCurrencyImageData,
      authValue,
    } = this.state

    if (unUsedValues) {
      console.log(amount, displayAmount, authValue)
    }
    return (
      <div>
        <Modal
          title={false}
          width={550}
          visible={twoFAauthModal}
          footer={null}
          closable={false}
          destroyOnClose
        >
          <AuthorizationModal
            authorizePayment={this.handleAuthroizePayment}
            formProps={form}
            loading={loading}
          />
        </Modal>
        <Card style={{ marginBottom: '3px' }}>
          <div className="font-size-18 font-weight-bold">
            Send {selectedCurrencyImageData.title}
          </div>
          <Divider />
          <Steps current={step} size="small" direction="vertical" className={styles.stepsBlock}>
            <Step
              title={<span className={styles.stepTitle}>Payment Details</span>}
              icon={
                <img
                  src="resources/images/logo_square-mobile.svg"
                  alt=""
                  style={{
                    position: 'relative',
                    // bottom: 8,
                    height: '30px',
                    width: '30px',
                  }}
                />
              }
              description={
                <div className={styles.stepBody}>
                  <div className="row">
                    <div className="col-lg-5">
                      <Form layout="vertical">
                        <Form.Item label="Amount" hasFeedback>
                          {form.getFieldDecorator('amount', {
                            rules: [
                              {
                                required: true,
                                message: 'Please input Amount',
                              },
                              {
                                type: 'number',
                                min: 0,
                                message: 'Invalid Input Top Up Fee Amount',
                              },
                            ],
                          })(
                            <InputNumber
                              // style={{ width: '100%' }}
                              formatter={value =>
                                `${value}`.replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1,')
                              }
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                              onChange={this.handleAmount}
                              style={{ width: '100%', border: '1px solid #a8c6fa' }}
                              size="large"
                            />,
                          )}
                        </Form.Item>
                        <Form.Item
                          label="Wallet Adrress"
                          hasFeedback
                          className={styles.checkoutForm}
                        >
                          {form.getFieldDecorator('walletAddress', {
                            initialValue: '',
                            rules: [
                              {
                                required: true,
                                message: 'Please input wallet Address',
                              },
                            ],
                          })(
                            <Input
                              autoComplete="off"
                              placeholder="walletAddress"
                              onChange={this.handleWalletAddress}
                              className={styles.inputbox}
                              style={{ width: '100%' }}
                              size="default"
                            />,
                          )}
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </div>
              }
            />

            {amount && walletAddress && (
              <Step
                title={<span className={styles.stepTitle}>Confirmation</span>}
                icon={
                  <img
                    src="resources/images/logo_square-mobile.svg"
                    alt=""
                    style={{
                      position: 'relative',
                      top: -3,
                      bottom: 8,
                      height: '30px',
                      width: '30px',
                    }}
                  />
                }
                description={
                  <div className={styles.stepBody}>
                    <Button className={styles.btnCANCEL} onClick={this.handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      loading={loading}
                      className={styles.btnNext}
                      htmlType="submit"
                      onClick={this.onSubmitHandle}
                    >
                      Confirm
                    </Button>
                  </div>
                }
              />
            )}
          </Steps>
        </Card>
      </div>
    )
  }
}

export default ManualCredit
