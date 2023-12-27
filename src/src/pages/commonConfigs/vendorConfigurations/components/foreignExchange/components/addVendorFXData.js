import React, { Component } from 'react'
import { Form, Button, Select, Modal } from 'antd'
import InfoCard from 'components/customComponents/InfoCard'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  addVendorForiegnExchangeData,
  updateVendorFXDataAddMode,
  updateVendorFXEditMode,
  editVendorForiegnExchangeData,
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

  showFXCurrPairAddMode: vendorConfiguration.showFXCurrPairAddMode,
  showFXCurrPairEditMode: vendorConfiguration.showFXCurrPairEditMode,
  selectedRecordToEdit: vendorConfiguration.selectedRecordToEdit,
  fxLoading: vendorConfiguration.fxLoading,

  showVendorFXAddMode: vendorConfiguration.showVendorFXAddMode,
  showEditFXData: vendorConfiguration.showEditFXData,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class addVendorFXData extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, selectedVendorConfig, showEditFXData } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          enhancedScreeningRequired: values.enhancedScreeningRequired || false,
          remittanceInformationAllowed: values.remittanceInformationAllowed || false,
          disallowedCountries: values.disallowedCountries,
        }

        if (showEditFXData) {
          dispatch(editVendorForiegnExchangeData(selectedVendorConfig.id, value, token))
        } else {
          dispatch(addVendorForiegnExchangeData(selectedVendorConfig.id, value, token))
        }
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch, showEditFXData } = this.props
    if (showEditFXData) {
      dispatch(updateVendorFXEditMode(FALSE_VALUE))
    } else {
      dispatch(updateVendorFXDataAddMode(FALSE_VALUE))
    }
  }

  getValue = isAllowed => {
    return isAllowed ? 'yes' : 'no'
  }

  render() {
    const { form, showVendorFXAddMode, fxLoading, countries, record, showEditFXData } = this.props
    const remintanceInfo = data.boolenValues.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    const enhancedScreeningRequired = data.boolenValues.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    // const quoteMethod = data.quoteMethod.map(option => (
    //   <Option key={option.id} label={option.label} value={option.value}>
    //     {option.label}
    //   </Option>
    // ))

    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.alpha2Code}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    return (
      <Modal
        visible={showVendorFXAddMode || showEditFXData}
        title={
          <div className={styles.modalHeader}>
            <InfoCard
              minHeight="80px"
              imgHeight="100px"
              imgTop="43%"
              header={
                showEditFXData ? 'Edit Foreign Exchange Details' : 'Add Foreign Exchange Details'
              }
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
                <Form.Item label="Enhanced Screening Required" hasFeedback>
                  {form.getFieldDecorator('enhancedScreeningRequired', {
                    initialValue: record
                      ? this.getValue(record.enhancedScreeningRequired)
                      : undefined,
                    rules: [
                      { required: true, message: 'Please select enhanced screening required' },
                    ],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="please select enhanced screening required"
                      filterOption={(input, option) =>
                        option.props.label
                          ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          : ''
                      }
                    >
                      {enhancedScreeningRequired}
                    </Select>,
                  )}
                </Form.Item>
              </div>

              <div className="col-md-12 col-lg-12">
                <Form.Item label="Disallowed Countries" hasFeedback>
                  {form.getFieldDecorator('disallowedCountries', {
                    initialValue:
                      record && record.disallowedCountries !== null
                        ? record.disallowedCountries
                        : undefined,
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
                  <Button className={styles.btnSAVE} htmlType="submit" loading={fxLoading}>
                    {showEditFXData ? 'Update' : 'Submit'}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    )
  }
}

export default addVendorFXData
