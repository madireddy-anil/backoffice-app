import React, { Component } from 'react'
import { Form, Select, Input, Card, Button } from 'antd'
import { updateVendorAddress, updateAddressEditMode } from 'redux/vendorConfiguration/action'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from '../style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, general, vendorConfiguration }) => ({
  token: user.token,
  clients: general.clients,
  countries: general.countries,
  addressEditMode: vendorConfiguration.addressEditMode,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  editAddressLoading: vendorConfiguration.editAddressLoading,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class editVendorAddress extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, selectedVendorConfig } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          addresses: [values],
        }
        dispatch(updateVendorAddress(selectedVendorConfig.id, value, token))
      }
    })
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateAddressEditMode(false))
  }

  render() {
    const { countries, form, record, editAddressLoading } = this.props

    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.name}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))
    return (
      <Form layout="vertical" onSubmit={this.onSubmit}>
        <Card
          title={
            <div>
              <span className="font-size-16">Address Details</span>
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
              <Form.Item label="Street Name" hasFeedback>
                {form.getFieldDecorator('street', {
                  initialValue: record?.street,
                  // rules: [{ required: true, message: 'Please select client' }],
                })(<Input />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Building Name" hasFeedback>
                {form.getFieldDecorator('buildingName', {
                  initialValue: record?.buildingName,
                  // rules: [{ required: true, message: 'Please select client' }],
                })(<Input />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Building Number" hasFeedback>
                {form.getFieldDecorator('buildingNumber', {
                  initialValue: record?.buildingNumber,
                  // rules: [{ required: true, message: 'Please select client' }],
                })(<Input />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Floor" hasFeedback>
                {form.getFieldDecorator('floor', {
                  initialValue: record?.floor,
                  // rules: [{ required: true, message: 'Please select client' }],
                })(<Input />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Post Box" hasFeedback>
                {form.getFieldDecorator('postBox', {
                  initialValue: record?.postBox,
                  // rules: [{ required: true, message: 'Please select client' }],
                })(<Input />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Post Code" hasFeedback>
                {form.getFieldDecorator('postCode', {
                  initialValue: record?.postCode,
                  // rules: [{ required: true, message: 'Please select client' }],
                })(<Input />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="City" hasFeedback>
                {form.getFieldDecorator('city', {
                  initialValue: record?.city,
                  // rules: [{ required: true, message: 'Please select client' }],
                })(<Input />)}
              </Form.Item>
            </div>

            <div className="col-md-6 col-lg-3">
              <Form.Item label="Country :" hasFeedback>
                {form.getFieldDecorator('country', {
                  initialValue: record?.country,
                  rules: [{ required: true, message: 'Please select client' }],
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    optionLabelProp="label"
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
              <Button className={styles.btnSAVE} loading={editAddressLoading} htmlType="submit">
                Update
              </Button>
            </div>
          </div>
        </Card>
      </Form>
    )
  }
}

export default editVendorAddress
