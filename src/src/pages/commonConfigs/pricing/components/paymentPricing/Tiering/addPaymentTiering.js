import React, { Component } from 'react'
import { Button, Form, Select, InputNumber, Card, Checkbox } from 'antd'
import lodash from 'lodash'
import { addPaymentTiering, updatePaymentTieringAddView } from 'redux/pricingProfile/action'
import { connect } from 'react-redux'
import data from '../data.json'
import styles from './style.module.scss'

const { Option } = Select

const TRUE_VALUE = true
const FALSE_VALUE = false

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  currencies: general.currencies,

  isPaymentTier: pricing.isPaymentTier,
  selectedPaymentTieringMethod: pricing.selectedPaymentTieringMethod,

  selectedPricingProfile: pricing.selectedPricingProfile,
  paymentTieringLoading: pricing.paymentTieringLoading,
})

@Form.create()
@connect(mapStateToProps)
class NewPaymentTiering extends Component {
  state = {
    selectedLifitingFeeMethod: undefined,
    selectedInvoiceFeeMethod: undefined,
    selectedFinalTier: false,
  }

  handlePaymentRecordSubmit = event => {
    event.preventDefault()
    const {
      form,
      selectedPaymentTieringMethod,
      isPaymentTier,
      selectedPricingProfile,
      dispatch,
      token,
    } = this.props
    form.validateFields((error, values) => {
      let tierPricing = {}
      const maxValue = 999999999999999
      if (!error) {
        if (!isPaymentTier) {
          values.paymentsTier = isPaymentTier
          tierPricing = values
        }

        if (selectedPaymentTieringMethod === 'monthly_value') {
          tierPricing = {
            invoiceAmount: values.invoiceAmount,
            index: values.index,
            invoiceCurrency: values.invoiceCurrency,
            invoiceFeeMethod: values.invoiceFeeMethod,
            liftingFeeAmount: values.liftingFeeAmount,
            liftingFeeMethod: values.liftingFeeMethod,
            paymentsTier: isPaymentTier,
            paymentsTieringMethod: selectedPaymentTieringMethod,
            paymentsTieringActive: TRUE_VALUE,
            isFinalTier: values.isFinalTier ? values.isFinalTier : false,
            monthly: {
              fromValueOfMonthlyPayments: values.fromValueOfMonthlyPayments,
              maxValueOfMonthlyPayments: values.isFinalTier
                ? maxValue
                : values.maxValueOfMonthlyPayments,
            },
          }
        }
        if (selectedPaymentTieringMethod === 'monthly_volume') {
          tierPricing = {
            invoiceAmount: values.invoiceAmount,
            index: values.index,
            invoiceCurrency: values.invoiceCurrency,
            invoiceFeeMethod: values.invoiceFeeMethod,
            liftingFeeAmount: values.liftingFeeAmount,
            liftingFeeMethod: values.liftingFeeMethod,
            paymentsTier: isPaymentTier,
            paymentsTieringMethod: selectedPaymentTieringMethod,
            paymentsTieringActive: TRUE_VALUE,
            isFinalTier: values.isFinalTier ? values.isFinalTier : false,
            tradesTieringActive: values.tradesTieringActive === 'true' || false,
            monthly: {
              fromNumberOfMonthlyPayments: values.fromNumberOfMonthlyPayments,
              maxNumberOfMonthlyPayments: values.isFinalTier
                ? maxValue
                : values.maxNumberOfMonthlyPayments,
            },
          }
        }
        if (selectedPaymentTieringMethod === 'single_value') {
          tierPricing = {
            invoiceAmount: values.invoiceAmount,
            index: values.index,
            invoiceCurrency: values.invoiceCurrency,
            invoiceFeeMethod: values.invoiceFeeMethod,
            liftingFeeAmount: values.liftingFeeAmount,
            liftingFeeMethod: values.liftingFeeMethod,
            paymentsTieringActive: TRUE_VALUE,
            paymentsTier: isPaymentTier,
            tradesTieringActive: values.tradesTieringActive === 'true' || false,
            paymentsTieringMethod: selectedPaymentTieringMethod,
            isFinalTier: values.isFinalTier ? values.isFinalTier : false,
            single: {
              fromValueOfSinglePayment: values.fromValueOfSinglePayment,
              maxValueOfSinglePayment: values.isFinalTier
                ? maxValue
                : values.maxValueOfSinglePayment,
            },
          }
        }
        const value = {
          pricingId: selectedPricingProfile.id,
          // eslint-disable-next-line no-param-reassign, no-underscore-dangle
          pricingPaymentsId: selectedPricingProfile.payments._id,
          tiering: [tierPricing],
        }
        dispatch(addPaymentTiering(value, token))
      }
    })
  }

  getSelectedTieringUI = method => {
    let returnLayout
    switch (method) {
      case 'monthly_value':
        returnLayout = this.montlyValueLayout()
        return returnLayout
      case 'monthly_volume':
        returnLayout = this.montlyVolumeLayout()
        return returnLayout
      case 'single_value':
        returnLayout = this.singleValueLayout()
        return returnLayout
      default:
        returnLayout = ''
        return returnLayout
    }
  }

  onChangeFinalTier = e => {
    this.setState({ selectedFinalTier: e.target.checked })
  }

  montlyValueLayout = () => {
    const { form } = this.props
    const { selectedFinalTier } = this.state
    return (
      <React.Fragment>
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Minimum Value :" hasFeedback>
            {form.getFieldDecorator('fromValueOfMonthlyPayments', {
              rules: [{ required: true, message: 'Please select profile type' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div>
        {selectedFinalTier ? (
          ''
        ) : (
          <div className="col-md-6 col-lg-4">
            <Form.Item label="Maximum value :" hasFeedback>
              {form.getFieldDecorator('maxValueOfMonthlyPayments', {
                rules: [{ required: true, message: 'Please select profile type' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        <div className="col-md-6 col-lg-4">
          <Form.Item>
            {form.getFieldDecorator('isFinalTier', {
              // rules: [{ required: true, message: 'Please enter maximum value' }],
            })(
              <Checkbox
                className={styles.isFinalCheckbox}
                checked={selectedFinalTier}
                onChange={this.onChangeFinalTier}
              >
                <strong> Is Final Tier?</strong>
              </Checkbox>,
            )}
          </Form.Item>
        </div>
      </React.Fragment>
    )
  }

  montlyVolumeLayout = () => {
    const { form } = this.props
    const { selectedFinalTier } = this.state
    return (
      <React.Fragment>
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Minimum Value :" hasFeedback>
            {form.getFieldDecorator('fromNumberOfMonthlyPayments', {
              rules: [{ required: true, message: 'Please select minimum value' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div>
        {selectedFinalTier ? (
          ''
        ) : (
          <div className="col-md-6 col-lg-4">
            <Form.Item label="Maximum value :" hasFeedback>
              {form.getFieldDecorator('maxNumberOfMonthlyPayments', {
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        <div className="col-md-6 col-lg-4">
          <Form.Item>
            {form.getFieldDecorator('isFinalTier', {
              // rules: [{ required: true, message: 'Please enter maximum value' }],
            })(
              <Checkbox
                className={styles.isFinalCheckbox}
                checked={selectedFinalTier}
                onChange={this.onChangeFinalTier}
              >
                <strong> Is Final Tier?</strong>
              </Checkbox>,
            )}
          </Form.Item>
        </div>
      </React.Fragment>
    )
  }

  singleValueLayout = () => {
    const { form } = this.props
    const { selectedFinalTier } = this.state
    return (
      <React.Fragment>
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Minimum Value :" hasFeedback>
            {form.getFieldDecorator('fromValueOfSinglePayment', {
              rules: [{ required: true, message: 'Please select minimum value' }],
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </div>
        {selectedFinalTier ? (
          ''
        ) : (
          <div className="col-md-6 col-lg-4">
            <Form.Item label="Maximum value :" hasFeedback>
              {form.getFieldDecorator('maxValueOfSinglePayment', {
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        <div className="col-md-6 col-lg-4">
          <Form.Item>
            {form.getFieldDecorator('isFinalTier', {
              // rules: [{ required: true, message: 'Please enter maximum value' }],
            })(
              <Checkbox
                className={styles.isFinalCheckbox}
                checked={selectedFinalTier}
                onChange={this.onChangeFinalTier}
              >
                <strong> Is Final Tier?</strong>
              </Checkbox>,
            )}
          </Form.Item>
        </div>
      </React.Fragment>
    )
  }

  getCommonFormData = () => {
    const { form, currencies } = this.props
    const { selectedLifitingFeeMethod, selectedInvoiceFeeMethod } = this.state
    const currenciesList = currencies.map(option => (
      <Option key={option.value} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))
    const feeMethodList = data.feeTypeMethod.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    return (
      <React.Fragment>
        {/* <div className="row"> */}
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Lifting Fee Method :" hasFeedback>
            {form.getFieldDecorator('liftingFeeMethod', {
              rules: [{ required: true, message: 'Please input invoice amount' }],
            })(
              <Select
                style={{ width: '100%' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select lifting Fee Method"
                showSearch
                onChange={this.handleSelectedLifitingFeeMethod}
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {feeMethodList}
              </Select>,
            )}
          </Form.Item>
        </div>
        {selectedLifitingFeeMethod === 'NA' ? (
          ''
        ) : (
          <div className="col-md-6 col-lg-4">
            <Form.Item label="Lifting fee Amount :" hasFeedback>
              {form.getFieldDecorator('liftingFeeAmount', {
                rules: [{ required: true, message: 'Please input lifting fee amount' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}

        <div className="col-md-6 col-lg-4">
          <Form.Item label="Invoice Fee Method :" hasFeedback>
            {form.getFieldDecorator('invoiceFeeMethod', {
              rules: [{ required: false, message: 'Please input invoice amount' }],
            })(
              <Select
                style={{ width: '100%' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select invoice Fee Method"
                showSearch
                onChange={this.handleSelectedInvoiceFeeMethod}
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {feeMethodList}
              </Select>,
            )}
          </Form.Item>
        </div>
        {selectedInvoiceFeeMethod === 'NA' ? (
          ''
        ) : (
          <React.Fragment>
            <div className="col-md-6 col-lg-4">
              <Form.Item label="Invoice Amount :" hasFeedback>
                {form.getFieldDecorator('invoiceAmount', {
                  rules: [{ required: false, message: 'Please input invoice amount' }],
                })(<InputNumber style={{ width: '100%' }} />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-4">
              <Form.Item label="Invoice Currency :" hasFeedback>
                {form.getFieldDecorator('invoiceCurrency', {
                  rules: [{ required: false, message: 'Please slect invoice currency' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    className={styles.cstmSelectInput}
                    placeholder="Select invoice currency"
                    showSearch
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {currenciesList}
                  </Select>,
                )}
              </Form.Item>
            </div>
          </React.Fragment>
        )}

        {/* </div> */}
      </React.Fragment>
    )
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updatePaymentTieringAddView(FALSE_VALUE))
  }

  getButtonUI = () => {
    const { paymentTieringLoading } = this.props
    return (
      <div className="row">
        <div className={styles.btnStyles}>
          <Button
            className={styles.btnCANCEL}
            onClick={this.onCancelHandler}
            // disabled={payments.length === 0}
          >
            Cancel
          </Button>
          <Button className={styles.btnSAVE} loading={paymentTieringLoading} htmlType="submit">
            Save
          </Button>
        </div>
      </div>
    )
  }

  handleSelectedLifitingFeeMethod = e => {
    this.setState({ selectedLifitingFeeMethod: e })
  }

  handleSelectedInvoiceFeeMethod = e => {
    this.setState({ selectedInvoiceFeeMethod: e })
  }

  getLayout = () => {
    const { isPaymentTier, selectedPaymentTieringMethod } = this.props
    if (isPaymentTier) {
      return (
        <div>
          <div className="row">{this.getSelectedTieringUI(selectedPaymentTieringMethod)}</div>
          {selectedPaymentTieringMethod ? this.getButtonUI() : ''}
        </div>
      )
    }
    return (
      <div>
        <div className="row">{this.getCommonFormData()}</div>
        {this.getButtonUI()}
      </div>
    )
  }

  render() {
    const { isPaymentTier, selectedPaymentTieringMethod } = this.props
    return (
      <Form onSubmit={this.handlePaymentRecordSubmit}>
        <Card
          title={
            isPaymentTier ? (
              <p> Add {lodash.startCase(selectedPaymentTieringMethod)} Payment Tiering Details </p>
            ) : (
              <p>Add Non-Tiering Payment Details</p>
            )
          }
          bordered
          headStyle={{
            //   border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '30px',
            //   border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          className={styles.mainCard}
        >
          {this.getLayout()}
        </Card>
      </Form>
    )
  }
}

export default NewPaymentTiering
