import React, { Component } from 'react'
import { Form, Modal, Button, Select } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import InfoCard from 'components/customComponents/InfoCard'
import {
  addVendorPaymentsData,
  updateVendorPaymentAddMode,
  updateVendorPaymentEditMode,
  editVendorPaymentsData,
} from 'redux/vendorConfiguration/action'
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
  addPaymentLoading: vendorConfiguration.paymentLoading,

  showPaymentData: vendorConfiguration.showPaymentData,
  showEditPaymentData: vendorConfiguration.showEditPaymentData,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class addVendorPayment extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, selectedVendorConfig, showPaymentData } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          remittanceInformationAllowed: values.remittanceInformationAllowed === 'yes' || false,
          disallowedCountries: values.disallowedCountries,
        }
        if (showPaymentData) {
          dispatch(addVendorPaymentsData(selectedVendorConfig.id, value, token))
        } else {
          dispatch(editVendorPaymentsData(selectedVendorConfig.id, value, token))
        }
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch, showPaymentData } = this.props
    if (showPaymentData) {
      dispatch(updateVendorPaymentAddMode(FALSE_VALUE))
    } else {
      dispatch(updateVendorPaymentEditMode(FALSE_VALUE))
    }
  }

  getValue = isAllowed => {
    return isAllowed ? 'yes' : 'no'
  }

  render() {
    const {
      form,
      addPaymentLoading,
      showPaymentData,
      countries,
      record,
      showEditPaymentData,
    } = this.props
    const remintanceInfo = data.boolenValues.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.alpha2Code}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    return (
      <React.Fragment>
        <Modal
          visible={showPaymentData || showEditPaymentData}
          title={
            <div className={styles.modalHeader}>
              <InfoCard
                minHeight="80px"
                imgHeight="100px"
                imgTop="43%"
                header={showPaymentData ? 'Add Payment Details' : 'Edit Payment Details'}
                closeButton={this.onCancelHandler}
              />
            </div>
          }
          footer={null}
          className={styles.modalBlock}
          closable={false}
          destroyOnClose
        >
          <div>
            <Form layout="vertical" onSubmit={this.onSubmit}>
              <div className="row">
                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Remittance Information Allowed" hasFeedback>
                    {form.getFieldDecorator('remittanceInformationAllowed', {
                      initialValue: record
                        ? this.getValue(record.remittanceInformationAllowed)
                        : undefined,
                      rules: [{ required: true, message: 'Please select remittance information' }],
                    })(
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                        optionLabelProp="label"
                        placeholder="please select remittance information"
                        filterOption={(input, option) =>
                          option.props.label
                            ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            : ''
                        }
                      >
                        {remintanceInfo}
                      </Select>,
                    )}
                  </Form.Item>
                </div>
                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Disallowed Countries" hasFeedback>
                    {form.getFieldDecorator('disallowedCountries', {
                      initialValue: record ? record.disallowedCountries : undefined,
                      // rules: [
                      //   {
                      //     required: true,
                      //     message: 'Select disallowed countries',
                      //   },
                      // ],
                    })(
                      <Select
                        showSearch
                        mode="multiple"
                        optionFilterProp="children"
                        style={{ width: '100%' }}
                        optionLabelProp="label"
                        placeholder="search country"
                        filterOption={(input, option) =>
                          option.props.label
                            ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            : ''
                        }
                      >
                        {countriesOptions}
                      </Select>,
                    )}
                  </Form.Item>
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
                    <Button
                      className={styles.btnSAVE}
                      htmlType="submit"
                      loading={addPaymentLoading}
                    >
                      {showPaymentData ? 'Submit' : 'Update'}
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

export default addVendorPayment
