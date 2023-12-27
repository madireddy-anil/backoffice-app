import React, { Component } from 'react'
import { Button, Form, Select } from 'antd'
import { connect } from 'react-redux'
import { editPaymentPricingData } from 'redux/pricingProfile/action'

import styles from './style.module.scss'
import data from './data.json'

const { Option } = Select

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  currencies: general.currencies,
  selectedPricingProfile: pricing.selectedPricingProfile,
  updatePaymentloading: pricing.paymentloading,
})

@Form.create()
@connect(mapStateToProps)
class addPaymentData extends Component {
  onSubmitPayemntData = event => {
    event.preventDefault()
    const { form, dispatch, selectedPricingProfile, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const pricingPaymentId = selectedPricingProfile.payments.id
        values.pricingId = selectedPricingProfile.id
        values.paymentsActive = selectedPricingProfile.payments.paymentsActive
        dispatch(editPaymentPricingData(pricingPaymentId, values, token))
      }
    })
  }

  render() {
    const { form, currencies, selectedPricingProfile, updatePaymentloading } = this.props

    const directionList = data.direction.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const priorityList = data.priority.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const currenciesList = currencies.map(option => (
      <Option key={option.value} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))
    const paymentTypeList = data.paymentType.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    return (
      <React.Fragment>
        <Form layout="vertical" onSubmit={this.onSubmitPayemntData}>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Direction :" hasFeedback>
                {form.getFieldDecorator('direction', {
                  initialValue: selectedPricingProfile.payments.direction,
                  rules: [{ required: true, message: 'Please select direction' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    className={styles.cstmSelectInput}
                    placeholder="Select direction"
                    showSearch
                    onChange={this.handleSelectedDirection}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {directionList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Priority :" hasFeedback>
                {form.getFieldDecorator('priority', {
                  initialValue: selectedPricingProfile.payments.priority,
                  rules: [{ required: true, message: 'Please select direction' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    className={styles.cstmSelectInput}
                    placeholder="Select Profile Type"
                    showSearch
                    onChange={this.handleSelectedPriority}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {priorityList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Transaction Currency :" hasFeedback>
                {form.getFieldDecorator('transactionCurrency', {
                  initialValue: selectedPricingProfile.payments.transactionCurrency,
                  rules: [{ required: true, message: 'Please select direction' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    className={styles.cstmSelectInput}
                    placeholder="Select transaction Currency"
                    showSearch
                    onChange={this.handleSelectedTransactionCurrency}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {currenciesList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Payment Type :" hasFeedback>
                {form.getFieldDecorator('type', {
                  initialValue: selectedPricingProfile.payments.type,
                  rules: [{ required: true, message: 'Please select type' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    className={styles.cstmSelectInput}
                    placeholder="Select type"
                    onChange={this.handleSelectedPaymentType}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {paymentTypeList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <div className="pb-3 mt-3">
                <Button className={styles.btnNEXT} htmlType="submit" loading={updatePaymentloading}>
                  Update
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </React.Fragment>
    )
  }
}

export default addPaymentData
