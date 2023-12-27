import React, { Component } from 'react'
import { Form, Select, Input, Card, DatePicker, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  updateComplianceEditMode,
  updateVendorComplianceInfo,
} from 'redux/vendorConfiguration/action'
import moment from 'moment'
import styles from '../style.module.scss'

import data from '../data.json'

const { Option } = Select

const mapStateToProps = ({ user, general, vendorConfiguration }) => ({
  token: user.token,
  clients: general.clients,
  countries: general.countries,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  addressEditMode: vendorConfiguration.addressEditMode,
  editComplianceLoading: vendorConfiguration.editComplianceLoading,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class editVendorCompliance extends Component {
  state = {
    isLisenced: undefined,
  }

  componentDidMount() {
    const { record } = this.props
    this.setState({ isLisenced: record.lisenced })
  }

  onChangeIsLisenced = value => {
    this.setState({ isLisenced: value === 'yes' || false })
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, selectedVendorConfig } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          complianceInformation: {
            kycStatus: values.kycStatus,
            kycPassedDate: values.kycPassedDate,
            licensed: values.licensed === 'yes' || false,
            licenseDetails: values.licenseDetails,
            disallowedIndustries: values.disallowedIndustries,
          },
        }

        dispatch(updateVendorComplianceInfo(selectedVendorConfig.id, value, token))
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateComplianceEditMode(false))
  }

  render() {
    const { form, record, editComplianceLoading } = this.props
    const { isLisenced } = this.state
    const kycStatus = data.kycStatus.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    const lisencedList = data.boolenValues.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    const disallowedIndustries = data.disallowedIndustries.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))
    // const dateFormat = 'DD-MM-YYYY'

    return (
      <Form layout="vertical" onSubmit={this.onSubmit}>
        <Card
          title={
            <div>
              <span className="font-size-16">Compliance Details</span>
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
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Kyc Status" hasFeedback>
                {form.getFieldDecorator('kycStatus', {
                  initialValue: record.kycStatus,
                  rules: [{ required: true, message: 'Please select kyc status' }],
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    optionLabelProp="label"
                    placeholder="please select KYC status"
                    filterOption={(input, option) =>
                      option.props.label
                        ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        : ''
                    }
                  >
                    {kycStatus}
                  </Select>,
                )}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="KYC Passed Date" hasFeedback>
                {form.getFieldDecorator('kycPassedDate', {
                  initialValue: moment(record.kycPassedDate),
                  // rules: [{ required: true, message: 'Please select kyc passed date' }],
                })(<DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Licensed" hasFeedback>
                {form.getFieldDecorator('licensed', {
                  initialValue: record.lisenced ? 'yes' : 'no',
                  //   rules: [{ required: true, message: 'Please select client' }],
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    placeholder="Please select is Licensed"
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      option.props.label
                        ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        : ''
                    }
                    onSelect={(value, id) => this.onChangeIsLisenced(value, id)}
                  >
                    {lisencedList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            {isLisenced ? (
              <div className="col-md-6 col-lg-3">
                <Form.Item label="License Details" hasFeedback>
                  {form.getFieldDecorator('licenseDetails', {
                    initialValue: record.licenseDetails,
                    rules: [{ required: true, message: 'Please select license details' }],
                  })(<Input />)}
                </Form.Item>
              </div>
            ) : (
              ''
            )}
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Disallowed Industries" hasFeedback>
                {form.getFieldDecorator('disallowedIndustries', {
                  initialValue:
                    record.disallowedIndustries.length > 0
                      ? record.disallowedIndustries
                      : undefined,
                  //   rules: [{ required: true, message: 'Please select client' }],
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    mode="multiple"
                    placeholder="Please select disallowed industries "
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      option.props.label
                        ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        : ''
                    }
                  >
                    {disallowedIndustries}
                  </Select>,
                )}
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
              <Button className={styles.btnSAVE} htmlType="submit" loading={editComplianceLoading}>
                Update
              </Button>
            </div>
          </div>
        </Card>
      </Form>
    )
  }
}

export default editVendorCompliance
