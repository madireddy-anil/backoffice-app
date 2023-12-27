import React, { Component } from 'react'
import { Form, Select, Input, Button, Card, DatePicker, Tooltip } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  addNewVendorConfiguration,
  // updateAddressAddMode,
} from 'redux/vendorConfiguration/action'
import Spacer from 'components/CleanUIComponents/Spacer'
// import AddVendorAddress from './vendorAddress/addVendorAddress'
// import ViewVendorAddress from './vendorAddress/viewVendorAddress'
// import AddComplianceInfo from './vendorCompliance/addComplianceInfo'
// import timeZoneList from '../../../../../utilities/mappers/timeZoneMapper'
import TimezoneSelect from 'react-timezone-select'
import styles from './style.module.scss'

import data from './data.json'

const { Option } = Select

const mapStateToProps = ({ user, general, vendorConfiguration }) => ({
  token: user.token,
  clients: general.clients,

  countries: general.countries,

  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  addvendorLoading: vendorConfiguration.addvendorLoading,

  showVendorAddMode: vendorConfiguration.showVendorAddMode,
  showVendorDataEditMode: vendorConfiguration.showVendorDataEditMode,
  showVendorDataViewMode: vendorConfiguration.showVendorDataViewMode,

  showAddAddress: vendorConfiguration.showAddAddress,
  showAddressDataEditMode: vendorConfiguration.showAddressDataEditMode,
  showAddressDataViewMode: vendorConfiguration.showAddressDataViewMode,

  showComplianceInfo: vendorConfiguration.showComplianceInfo,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class initialVendorData extends Component {
  state = {
    isLisenced: undefined,
    selectedTimezone: {
      value: '',
    },
    // servicesOffering: [],
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token } = this.props
    const { selectedTimezone } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          type: 'vendor',
          genericInformation: {
            tradingName: values.tradingName,
            registeredCompanyName: values.legalName,
            addresses: [
              {
                street: values.street,
                buildingName: values.buildingName,
                buildingNumber: values.buildingNumber,
                floor: values.floor,
                postCode: values.postCode,
                postBox: values.postCode,
                city: values.city,
                country: values.country,
              },
            ],
          },

          complianceInformation: {
            kycStatus: values.kycStatus,
            kycPassedDate: values.kycPassedDate,
            licensed: values.licensed === 'yes' || false,
            licenseDetails: values.licenseDetails,
            disallowedIndustries: values.disallowedIndustries,
          },
          // servicesOffering: values.offeredServices,
          timeZone: selectedTimezone,
        }
        dispatch(addNewVendorConfiguration(value, token))
      }
    })
  }

  onChangeIsLisenced = value => {
    this.setState({ isLisenced: value })
  }

  setSelectedTimezone = time => {
    this.setState({ selectedTimezone: time })
  }

  // onChangeOfferedService = value => {
  //   this.setState({ servicesOffering: value })
  // }

  render() {
    const { form, addvendorLoading, countries } = this.props
    const { selectedTimezone } = this.state
    // const offeredServices = data.offeredServices.map(option => (
    //   <Option key={option.id} label={option.label} value={option.value}>
    //     {option.label}
    //   </Option>
    // ))
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
    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.name}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))

    const disallowedIndustries = data.disallowedIndustries.map(option => (
      <Option key={option.id} label={option.label} value={option.value}>
        {option.label}
      </Option>
    ))

    // const timeZoneListMap = timeZoneList.map(option => (
    //   <Option key={option.id} label={option.name} value={option.name}>
    //     <div className="list-card">
    //       <div className={styles.timeZoneBlock}>
    //         <h5>({option.value})</h5>
    //         {` `}
    //         <h5>{option.name}</h5>
    //       </div>
    //       <div>{option.utcOffset}</div>
    //     </div>
    //   </Option>
    // ))
    const { isLisenced } = this.state
    return (
      <React.Fragment>
        <Form layout="vertical" onSubmit={this.onSubmit}>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Vendor's Trading Name" hasFeedback>
                {form.getFieldDecorator('tradingName', {
                  rules: [{ required: true, message: 'Please select vendor trading name' }],
                })(<Input placeholder="Enter vendor name" />)}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Vendor's Legal Name" hasFeedback>
                {form.getFieldDecorator('legalName', {
                  rules: [{ required: true, message: 'Please select vendor legal name' }],
                })(<Input placeholder="Enter vendor name" />)}
              </Form.Item>
            </div>
            {/* <div className="col-md-6 col-lg-3">
              <Form.Item label="Offered Services:" hasFeedback>
                {form.getFieldDecorator('offeredServices', {
                  rules: [{ required: true, message: 'Please select offered services' }],
                })(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    mode="multiple"
                    placeholder="Search by offered services"
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={this.onChangeOfferedService}
                  >
                    {offeredServices}
                  </Select>,
                )}
              </Form.Item>
            </div> */}
            {/* {servicesOffering.includes('payments') ||
            servicesOffering.includes('foreignExchange') ? ( */}
            <div className="col-md-6 col-lg-3">
              <span className={styles.timeZoneTitle}>Time Zone:</span>
              <Tooltip title="Time zone selected applies to all time fields in the Services Offered section.">
                <div className={styles.wrapperSelect}>
                  <TimezoneSelect
                    value={selectedTimezone.value}
                    onChange={this.setSelectedTimezone}
                    className={styles.cstmSelectInput}
                  />
                </div>
              </Tooltip>
            </div>
            {/* ) : (
              ''
            )} */}
          </div>
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
                    // initialValues:addressEditMode ? record.streetName : ""
                    // rules: [{ required: true, message: 'Please select client' }],
                  })(<Input placeholder="Enter street" />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Building Name" hasFeedback>
                  {form.getFieldDecorator('buildingName', {
                    // rules: [{ required: true, message: 'Please select client' }],
                  })(<Input placeholder="Enter building name" />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Building Number" hasFeedback>
                  {form.getFieldDecorator('buildingNumber', {
                    // rules: [{ required: true, message: 'Please select client' }],
                  })(<Input placeholder="Enter building number" />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Floor" hasFeedback>
                  {form.getFieldDecorator('floor', {
                    // rules: [{ required: true, message: 'Please select client' }],
                  })(<Input placeholder="Enter floor " />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Post Box" hasFeedback>
                  {form.getFieldDecorator('postBox', {
                    // rules: [{ required: true, message: 'Please select client' }],
                  })(<Input placeholder="Enter post box " />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Post Code" hasFeedback>
                  {form.getFieldDecorator('postCode', {
                    // rules: [{ required: true, message: 'Please select client' }],
                  })(<Input placeholder="Enter post code" />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="City" hasFeedback>
                  {form.getFieldDecorator('city', {
                    // rules: [{ required: true, message: 'Please select client' }],
                  })(<Input placeholder="Enter city" />)}
                </Form.Item>
              </div>

              <div className="col-md-6 col-lg-3">
                <Form.Item label="Country :" hasFeedback>
                  {form.getFieldDecorator('country', {
                    rules: [{ required: true, message: 'Please select country' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
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
            </div>
          </Card>
          <Spacer height="15px" />
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
                <Form.Item label="KYC Status" hasFeedback>
                  {form.getFieldDecorator('kycStatus', {
                    rules: [{ required: true, message: 'Please select kyc status' }],
                  })(
                    <Select
                      showSearch
                      optionFilterProp="children"
                      optionLabelProp="label"
                      placeholder="Please select kyc status"
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
                    // rules: [{ required: true, message: 'Please select kyc passed date' }],
                  })(<DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Licensed" hasFeedback>
                  {form.getFieldDecorator('lisenced', {
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
                      onChange={(value, id) => this.onChangeIsLisenced(value, id)}
                    >
                      {lisencedList}
                    </Select>,
                  )}
                </Form.Item>
              </div>
              {isLisenced === 'yes' ? (
                <div className="col-md-6 col-lg-3">
                  <Form.Item label="License Details" hasFeedback>
                    {form.getFieldDecorator('licenseDetails', {
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
                    // rules: [{ required: true, message: 'Please select client' }],
                  })(
                    <Select
                      showSearch
                      mode="multiple"
                      optionFilterProp="children"
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
          </Card>
          <div className="col-md-6 col-lg-3">
            <Button className={styles.btnSAVE} htmlType="submit" loading={addvendorLoading}>
              {'Submit'}
            </Button>
          </div>
        </Form>
      </React.Fragment>
    )
  }
}

export default initialVendorData
