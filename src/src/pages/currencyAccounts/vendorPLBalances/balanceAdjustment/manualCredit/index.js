import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Steps,
  Card,
  Divider,
  Modal,
  Popconfirm,
  DatePicker,
} from 'antd'
import AuthorizationModal from 'components/customComponents/AuthorizationModal'
import { initiateVendorPLManualCredit } from 'redux/caBalanceAdjustments/actions'
import { updateSelectedPaymentType } from 'redux/caTransactions/actions'
// import { twoFAauthorizationModal } from 'redux/auth0/actions'

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
    valueDate: '',
    step: 0,
    parameters: {},
    authValue: {},
  }

  // componentDidMount() {
  //   const { dispatch } = this.props
  //   dispatch(twoFAauthorizationModal(false))
  // }

  onSubmitHandle = () => {
    const { amount, reference, valueDate } = this.state
    const { selectedAccountDetails, dispatch, token } = this.props
    const value = {
      // ownerEntityId: selectedAccountDetails.ownerEntityId,
      // accountId: selectedAccountDetails.id,
      amount,
      remarks: reference,
      debitCredit: 'credit',
      valueDate,
    }
    this.setState({ parameters: value })
    dispatch(initiateVendorPLManualCredit(selectedAccountDetails.id, value, token))
    // const availableAmount = -1 * selectedAccountDetails.balance.balance
    // if (amount > availableAmount) {
    //   Modal.error({
    //     title: <p style={{ color: 'red' }}>Insufficient Funds...!</p>,
    //     content: 'Please enter amount less than available balance',
    //   })
    // } else {

    //   // dispatch(twoFAauthorizationModal(true))
    // }
  }

  handleAuthroizePayment = event => {
    event.preventDefault()
    const { form, token, dispatch } = this.props
    const { parameters } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        this.setState({ authValue: values })
        dispatch(initiateVendorPLManualCredit(parameters, token))
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

  handleValueDate = (date, dateString) => {
    const { valueDate } = this.state
    this.setState({ valueDate: dateString })
    if (valueDate) {
      this.setState({ step: 0 })
    }
  }

  render() {
    const { form, loading, twoFAauthModal } = this.props
    const {
      amount,
      displayAmount,
      reference,
      step,
      unUsedValues,
      authValue,
      valueDate,
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
                        <Form.Item label="Value Date" hasFeedback>
                          {form.getFieldDecorator('valueDate', {
                            rules: [
                              {
                                required: true,
                                message: 'Please select value date',
                              },
                            ],
                          })(
                            <DatePicker
                              onChange={this.handleValueDate}
                              style={{ width: '100%' }}
                              placeholder="Select value date"
                            />,
                          )}
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </div>
              }
            />

            {amount && reference && valueDate && (
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
                    <Popconfirm
                      title="Are you sure to submit ?"
                      onConfirm={this.onSubmitHandle}
                      placement="right"
                    >
                      <Button
                        loading={loading}
                        className={styles.btnNext}
                        htmlType="submit"
                        // onClick={this.onSubmitHandle}
                      >
                        Confirm
                      </Button>
                    </Popconfirm>
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
