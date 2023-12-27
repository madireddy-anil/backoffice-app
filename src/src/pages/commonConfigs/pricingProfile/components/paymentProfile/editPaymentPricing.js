import React, { Component } from 'react'
import { Button, Form, Select, InputNumber, Card, Checkbox } from 'antd'
import { connect } from 'react-redux'
import {
  updatePaymentRecord,
  updatePaymentListView,
  updatePaymentAddView,
  updatePaymentEditView,
  updatePaymentTieringMethodSelected,
  editSelectedPricingProfile,
} from '../../../../../redux/pricing/action'
import data from '../../data.json'
import styles from '../../style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, general, pricingProfiles }) => ({
  token: user.token,
  currencies: general.currencies,
  errorList: pricingProfiles.errorList,
  loading: pricingProfiles.loading,
  clients: general.clients,

  paymentTiering: pricingProfiles.payment.tiering,
  selectedPaymentTieringMethod: pricingProfiles.selectedPaymentTieringMethod,
  isPaymentTier: pricingProfiles.isPaymentTier,
  selectedPricingProfile: pricingProfiles.selectedPricingProfile,
  isNewPricingProfile: pricingProfiles.isNewPricingProfile,
})

const maxValue = 999999999999999

@Form.create()
@connect(mapStateToProps)
class NewPaymentPricing extends Component {
  state = {
    selectedLifitingFeeMethod: undefined,
    selectedInvoiceFeeMethod: undefined,
    selectedFinalTier: undefined,
    paymentsTieringActive: undefined,
    // selectedIsPaymentTier : undefined
  }

  componentDidMount() {
    const { recordData } = this.props
    this.setState({
      selectedFinalTier: recordData.isFinalTier,
      selectedLifitingFeeMethod: recordData.liftingFeeMethod,
      selectedInvoiceFeeMethod: recordData.invoiceFeeMethod,
      paymentsTieringActive: recordData.paymentsTieringMethod
        ? recordData.paymentsTieringActive
        : undefined,
    })
  }

  onChangeFinalTier = e => {
    this.setState({ selectedFinalTier: e.target.checked })
  }

  handlePaymentRecordSubmit = event => {
    event.preventDefault()
    const {
      form,
      dispatch,
      paymentTiering,
      selectedPaymentTieringMethod,
      isPaymentTier,
      isNewPricingProfile,
      selectedPricingProfile,
      token,
    } = this.props
    form.validateFields((error, values) => {
      let tierPricing = {}
      if (!error) {
        const { selectedFinalTier, paymentsTieringActive } = this.state

        if (!isPaymentTier) {
          values.paymentsTier = isPaymentTier
          tierPricing = values
        }

        if (isPaymentTier && selectedPaymentTieringMethod === 'monthly_value') {
          tierPricing = {
            invoiceAmount: values.invoiceAmount,
            index: values.index,
            invoiceCurrency: values.invoiceCurrency,
            invoiceFeeMethod: values.invoiceFeeMethod,
            liftingFeeAmount: values.liftingFeeAmount,
            liftingFeeMethod: values.liftingFeeMethod,
            paymentsTier: isPaymentTier,
            isFinalTier: selectedFinalTier,
            paymentsTieringMethod: selectedPaymentTieringMethod,
            paymentsTieringActive,
            monthly: {
              fromValueOfMonthlyPayments: values.fromValueOfMonthlyPayments,
              maxValueOfMonthlyPayments: values.isFinalTier
                ? maxValue
                : values.maxValueOfMonthlyPayments,
            },
          }
        }
        if (isPaymentTier && selectedPaymentTieringMethod === 'monthly_volume') {
          tierPricing = {
            invoiceAmount: values.invoiceAmount,
            index: values.index,
            invoiceCurrency: values.invoiceCurrency,
            invoiceFeeMethod: values.invoiceFeeMethod,
            liftingFeeAmount: values.liftingFeeAmount,
            liftingFeeMethod: values.liftingFeeMethod,
            paymentsTier: isPaymentTier,
            isFinalTier: selectedFinalTier,
            paymentsTieringActive,
            paymentsTieringMethod: selectedPaymentTieringMethod,
            monthly: {
              fromNumberOfMonthlyPayments: values.fromNumberOfMonthlyPayments,
              maxNumberOfMonthlyPayments: values.isFinalTier
                ? maxValue
                : values.maxNumberOfMonthlyPayments,
            },
          }
        }
        if (isPaymentTier && selectedPaymentTieringMethod === 'single_value') {
          tierPricing = {
            invoiceAmount: values.invoiceAmount,
            index: values.index,
            invoiceCurrency: values.invoiceCurrency,
            invoiceFeeMethod: values.invoiceFeeMethod,
            liftingFeeAmount: values.liftingFeeAmount,
            liftingFeeMethod: values.liftingFeeMethod,
            paymentsTier: isPaymentTier,
            isFinalTier: selectedFinalTier,
            paymentsTieringActive,
            paymentsTieringMethod: selectedPaymentTieringMethod,
            single: {
              fromValueOfSinglePayment: values.fromValueOfSinglePayment,
              maxValueOfSinglePayment: values.isFinalTier
                ? maxValue
                : values.maxValueOfSinglePayment,
            },
          }
        }

        if (isNewPricingProfile) {
          const paymentsList = [...paymentTiering, tierPricing]
          dispatch(updatePaymentRecord(paymentsList))
        } else {
          selectedPricingProfile.payments.tiering = [
            ...selectedPricingProfile.payments.tiering,
            tierPricing,
          ]
          dispatch(
            editSelectedPricingProfile(selectedPricingProfile.id, selectedPricingProfile, token),
          )
        }

        dispatch(updatePaymentListView(true))
        dispatch(updatePaymentAddView(false))
        dispatch(updatePaymentEditView(false))
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updatePaymentEditView(false))
  }

  handleTieringMethod = e => {
    const { form, dispatch } = this.props
    form.setFieldsValue({
      paymentsTieringMethod: e,
    })
    dispatch(updatePaymentTieringMethodSelected(e))
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

  montlyValueLayout = () => {
    const { form, recordData } = this.props
    const { selectedFinalTier } = this.state
    // const statusList = data.status.map(option => (
    //   <Option key={option.value} value={option.value} label={option.label}>
    //     {option.label}
    //   </Option>
    // ))
    return (
      <React.Fragment>
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Minimum Value :" hasFeedback>
            {form.getFieldDecorator('fromValueOfMonthlyPayments', {
              initialValue: recordData.monthly.fromValueOfMonthlyPayments,
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
                initialValue:
                  recordData.monthly.maxValueOfMonthlyPayments === maxValue
                    ? ''
                    : recordData.monthly.maxValueOfMonthlyPayments,
                rules: [{ required: true, message: 'Please select profile type' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}

        {this.getCommonFormData()}
        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Tiering Status :" hasFeedback>
            {form.getFieldDecorator('paymentsTieringActive', {
              initialValue: recordData.paymentsTieringActive.toString(),
              rules: [{ required: true, message: 'Please enter status' }],
            })(
              <Select
                style={{ width: '100%' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select iering Status"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusList}
              </Select>,
            )}
          </Form.Item>
        </div> */}
        <div className="col-md-6 col-lg-4">
          <Form.Item>
            {form.getFieldDecorator('isFinalTier', {
              initialValue: recordData.isFinalTier,
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
    const { form, recordData } = this.props
    const { selectedFinalTier } = this.state
    // const statusList = data.status.map(option => (
    //   <Option key={option.value} value={option.value} label={option.label}>
    //     {option.label}
    //   </Option>
    // ))
    return (
      <React.Fragment>
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Minimum Value :" hasFeedback>
            {form.getFieldDecorator('fromNumberOfMonthlyPayments', {
              initialValue: recordData.monthly.fromNumberOfMonthlyPayments,
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
                initialValue:
                  recordData.monthly.maxNumberOfMonthlyPayments === maxValue
                    ? ''
                    : recordData.monthly.maxNumberOfMonthlyPayments,
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Tiering Status :" hasFeedback>
            {form.getFieldDecorator('paymentsTieringActive', {
              initialValue: recordData.paymentsTieringActive.toString(),
              rules: [{ required: true, message: 'Please select status' }],
            })(
              <Select
                style={{ width: '100%' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select iering Status"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusList}
              </Select>,
            )}
          </Form.Item>
        </div> */}
        <div className="col-md-6 col-lg-4">
          <Form.Item>
            {form.getFieldDecorator('isFinalTier', {
              initialValue: recordData.isFinalTier,
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
    const { form, recordData } = this.props
    const { selectedFinalTier } = this.state

    // const statusList = data.status.map(option => (
    //   <Option key={option.value} value={option.value} label={option.label}>
    //     {option.label}
    //   </Option>
    // ))
    return (
      <React.Fragment>
        <div className="col-md-6 col-lg-4">
          <Form.Item label="Minimum Value :" hasFeedback>
            {form.getFieldDecorator('fromValueOfSinglePayment', {
              initialValue: recordData.single.fromValueOfSinglePayment,
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
                initialValue:
                  recordData.single.fromValueOfSinglePayment === maxValue
                    ? ''
                    : recordData.single.fromValueOfSinglePayment === maxValue,
                rules: [{ required: true, message: 'Please enter maximum value' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}
        {this.getCommonFormData()}
        {/* <div className="col-md-6 col-lg-4">
          <Form.Item label="Tiering Status :" hasFeedback>
            {form.getFieldDecorator('paymentsTieringActive', {
              initialValue: recordData.paymentsTieringActive.toString(),
              rules: [{ required: true, message: 'Please select status' }],
            })(
              <Select
                style={{ width: '100%' }}
                optionLabelProp="label"
                className={styles.cstmSelectInput}
                placeholder="Select iering Status"
                showSearch
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusList}
              </Select>,
            )}
          </Form.Item>
        </div> */}
        <div className="col-md-6 col-lg-4">
          <Form.Item>
            {form.getFieldDecorator('isFinalTier', {
              initialValue: recordData.isFinalTier,
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
    const { form, currencies, recordData } = this.props
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
              initialValue: recordData.liftingFeeMethod,
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
                initialValue: recordData.liftingFeeAmount,
                rules: [{ required: true, message: 'Please input lifting fee amount' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}

        <div className="col-md-6 col-lg-4">
          <Form.Item label="Invoice Fee Method :" hasFeedback>
            {form.getFieldDecorator('invoiceFeeMethod', {
              initialValue: recordData.invoiceFeeMethod,
              rules: [{ required: true, message: 'Please input invoice amount' }],
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
          <div className="col-md-6 col-lg-4">
            <Form.Item label="Invoice Amount :" hasFeedback>
              {form.getFieldDecorator('invoiceAmount', {
                initialValue: recordData.invoiceAmount,
                rules: [{ required: true, message: 'Please input invoice amount' }],
              })(<InputNumber style={{ width: '100%' }} />)}
            </Form.Item>
          </div>
        )}

        <div className="col-md-6 col-lg-4">
          <Form.Item label="Invoice Currency :" hasFeedback>
            {form.getFieldDecorator('invoiceCurrency', {
              initialValue: recordData.invoiceCurrency,
              rules: [{ required: true, message: 'Please slect invoice currency' }],
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

        {/* </div> */}
      </React.Fragment>
    )
  }

  getButtonUI = () => {
    const { loading } = this.props
    return (
      <div className="row">
        <div className={styles.btnStyles}>
          {/* <Button
            className={styles.btnCANCEL}
            onClick={this.onCancelHandler}
            disabled={paymentTiering.length === 0}
          >
            Cancel
          </Button> */}
          <Button className={styles.btnSAVE} loading={loading} htmlType="submit">
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
    const headerBlockStyle = {
      marginBottom: '10px',
      background: '#fafafa',
      borderTopRightRadius: '8px',
      borderTopLeftRadius: '8px',
    }

    return (
      <Card
        title="Edit Payment Pricing Details"
        headStyle={headerBlockStyle}
        className={styles.activeSelectedBene}
      >
        <Form onSubmit={this.handlePaymentRecordSubmit}>{this.getLayout()}</Form>
      </Card>
    )
  }
}

export default NewPaymentPricing
