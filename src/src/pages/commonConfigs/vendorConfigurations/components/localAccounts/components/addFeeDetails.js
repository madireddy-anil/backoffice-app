import React, { Component } from 'react'
import { Form, Card, Button, Select, InputNumber, Input } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  editLocalAcountFeeData,
  addNewLocalAcountFeeData,
  updateVendorFeeAddMode,
  updateVendorFeeEditMode,
} from 'redux/vendorConfiguration/action'
// import moment from 'moment'

import styles from '../style.module.scss'

import data from './data.json'

const { Option } = Select
const FALSE_VALUE = false

const mapStateToProps = ({ user, general, vendorConfiguration }) => ({
  token: user.token,
  clients: general.clients,
  countries: general.countries,
  currencies: general.currencies,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  addressEditMode: vendorConfiguration.addressEditMode,

  showVendorFeeAddMode: vendorConfiguration.showVendorFeeAddMode,
  showVendorFeeEditMode: vendorConfiguration.showVendorFeeEditMode,
  selectedRecordToEdit: vendorConfiguration.selectedRecordToEdit,
  localAccountsLoading: vendorConfiguration.localAccountsLoading,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class addFeeDetails extends Component {
  onSubmit = event => {
    event.preventDefault()
    const {
      form,
      dispatch,
      token,
      selectedVendorConfig,
      selectedRecordToEdit,
      showVendorFeeEditMode,
    } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        if (showVendorFeeEditMode) {
          dispatch(
            editLocalAcountFeeData(
              selectedVendorConfig.id,
              // eslint-disable-next-line no-param-reassign, no-underscore-dangle
              selectedRecordToEdit._id,
              values,
              token,
            ),
          )
        } else {
          dispatch(addNewLocalAcountFeeData(selectedVendorConfig.id, values, token))
        }
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch, showVendorFeeEditMode } = this.props
    if (showVendorFeeEditMode) {
      dispatch(updateVendorFeeEditMode(FALSE_VALUE))
    } else {
      dispatch(updateVendorFeeAddMode(FALSE_VALUE))
    }
  }

  render() {
    const {
      form,
      currencies,
      showVendorFeeEditMode,
      selectedRecordToEdit,
      localAccountsLoading,
    } = this.props
    const currencyOption = currencies.map(option => (
      <Option key={option.id} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))

    const feeType = data.feeType.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    return (
      <Form layout="vertical" onSubmit={this.onSubmit}>
        <Card
          title={
            <div>
              <span className="font-size-16">
                {showVendorFeeEditMode
                  ? `Edit Local Accounts Details`
                  : `New Local Accounts Details`}
              </span>
            </div>
          }
          bordered
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '30px',
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          className={styles.mainCard}
        >
          <React.Fragment>
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Fee Currency" hasFeedback>
                  {form.getFieldDecorator('feeCurrency', {
                    initialValue: showVendorFeeEditMode
                      ? selectedRecordToEdit.feeCurrency
                      : undefined,
                    rules: [{ required: true, message: 'Please select fee currency' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="please select sell currency"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {currencyOption}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Fee Type" hasFeedback>
                  {form.getFieldDecorator('feeType', {
                    initialValue: showVendorFeeEditMode ? selectedRecordToEdit.feeType : undefined,
                    rules: [{ required: true, message: 'Please select fee type' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="please select fee type"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {feeType}
                    </Select>,
                  )}
                </Form.Item>
              </div>

              <div className="col-md-6 col-lg-3">
                <Form.Item label="Fee Amount" hasFeedback>
                  {form.getFieldDecorator('feeAmount', {
                    initialValue: showVendorFeeEditMode
                      ? selectedRecordToEdit.feeAmount
                      : undefined,
                    rules: [{ required: true, message: 'Please select fee amount' }],
                  })(
                    <InputNumber style={{ width: '100%' }} placeholder="Please enter fee amount" />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Fee Description" hasFeedback>
                  {form.getFieldDecorator('feeDescription', {
                    initialValue: showVendorFeeEditMode
                      ? selectedRecordToEdit.feeDescription
                      : undefined,
                    rules: [{ required: true, message: 'Please fee description' }],
                  })(<Input placeholder="Please enter fee description" />)}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className={styles.btnStyles}>
                <Button
                  className={styles.btnCANCEL}
                  onClick={this.onCancelHandler}
                  // disabled={payments.length === 0}
                >
                  Cancel
                </Button>
                <Button className={styles.btnSAVE} loading={localAccountsLoading} htmlType="submit">
                  {showVendorFeeEditMode ? 'Update' : 'Save'}
                </Button>
              </div>
            </div>
          </React.Fragment>
        </Card>
      </Form>
    )
  }
}

export default addFeeDetails
