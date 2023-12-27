import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Form, Input, InputNumber, Steps, Card, Divider, Modal } from 'antd'
import AuthorizationModal from 'components/customComponents/AuthorizationModal'
import { initiateVendorManualCredit } from 'redux/caBalanceAdjustments/actions'
import { updateSelectedPaymentType } from 'redux/caTransactions/actions'
import { twoFAauthorizationModal } from 'redux/auth0/actions'

import styles from './style.module.scss'

const { Step } = Steps

const mapStateToProps = ({ user, caTransactions, caBalanceAdjustments, auth0 }) => ({
  token: user.token,
  selectedAccountDetails: caTransactions.selectedAccountDetails,
  loading: caBalanceAdjustments.loading,
  twoFAauthModal: auth0.twoFAauthModal,
})

@withRouter
@Form.create()
@connect(mapStateToProps)
class ManualCredit extends React.Component {
  state = {
    reference: '',
    amount: undefined,
    step: 0,
    parameters: {},
  }

  // componentDidMount() {
  //   const { dispatch } = this.props
  //   dispatch(twoFAauthorizationModal(false))
  // }

  onSubmitHandle = () => {
    const { amount, reference } = this.state
    const { selectedAccountDetails, dispatch } = this.props
    const value = {
      accountId: selectedAccountDetails.accountId,
      currencyAccountId: selectedAccountDetails.id,
      amount,
      remarks: reference,
      debitCredit: 'credit',
    }
    this.setState({ parameters: value })
    dispatch(twoFAauthorizationModal(true))
  }

  handleAuthroizePayment = event => {
    event.preventDefault()
    const { form, token, dispatch } = this.props
    const { parameters } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        console.log(values)
        dispatch(initiateVendorManualCredit(parameters, token))
      }
    })
  }

  handleCancel = () => {
    const { dispatch } = this.props
    dispatch(updateSelectedPaymentType(''))
  }

  handleRefernce = e => {
    const { amount } = this.state
    this.setState({ reference: e.target.value, step: 1 })
    if (amount) {
      this.setState({ step: 1 })
    }
  }

  handleAmount = value => {
    const { reference } = this.state
    this.setState({ amount: value })
    if (reference) {
      this.setState({ step: 0 })
    }
  }

  render() {
    const { form, loading, twoFAauthModal } = this.props
    const { amount, displayAmount, reference, step, unUsedValues } = this.state

    if (unUsedValues) {
      console.log(amount, displayAmount)
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
          <div className="font-size-18 font-weight-bold">Manual Credit</div>
          <Divider />
          <Steps current={step} size="small" direction="vertical" className={styles.stepsBlock}>
            <Step
              title={<span className={styles.stepTitle}>Credit</span>}
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
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                              onChange={this.handleAmount}
                              style={{ width: '100%', border: '1px solid #a8c6fa' }}
                              size="large"
                            />,
                          )}
                        </Form.Item>
                        <Form.Item label="Reference" hasFeedback className={styles.checkoutForm}>
                          {form.getFieldDecorator('reference', {
                            initialValue: '',
                            rules: [
                              {
                                required: true,
                                message: 'Please input reference',
                              },
                            ],
                          })(
                            <Input
                              autoComplete="off"
                              placeholder="Reference"
                              onChange={this.handleRefernce}
                              className={styles.inputbox}
                            />,
                          )}
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </div>
              }
            />

            {amount && reference && (
              <Step
                title={<span className={styles.stepTitle}>Confirmation</span>}
                icon={
                  <img
                    src="resources/images/logo_square-mobile.svg"
                    alt=""
                    style={{
                      position: 'relative',
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
