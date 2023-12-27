import React, { Component } from 'react'
import { Form, Icon, Button, Input, Popconfirm } from 'antd'
import { connect } from 'react-redux'
import Spacer from 'components/CleanUIComponents/Spacer'
import {
  updateVendorNameBlockEdit,
  updateVendorData,
  deleteVendorConfiguration,
} from 'redux/vendorConfiguration/action'
import TimezoneSelect from 'react-timezone-select'
import EditVendorAddress from './vendorAddress/editVendorAddress'
import ViewVendorAddress from './vendorAddress/viewVendorAddress'

import EditComplianceInfo from './vendorCompliance/editComplianceInfo'
import ViewComplianceInfo from './vendorCompliance/viewComplianceInfo'

import { capitalize } from '../../../../../utilities/transformer'

import styles from './style.module.scss'

const TRUE_VALUE = true

const mapStateToProps = ({ user, general, vendorConfiguration }) => ({
  token: user.token,
  clients: general.clients,
  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  users: general.users,
  vendorBlockLoading: vendorConfiguration.vendorBlockLoading,

  showVendorDataEditMode: vendorConfiguration.showVendorDataEditMode,
  showAddressDataEditMode: vendorConfiguration.showAddressDataEditMode,
  showComplianceInfoEditMode: vendorConfiguration.showComplianceInfoEditMode,
})

@Form.create()
@connect(mapStateToProps)
class viewVendorData extends Component {
  state = {
    noData: '--',
    selectedTimezone: {
      value: '',
    },
  }

  componentDidMount() {
    const { selectedVendorConfig } = this.props
    const { timeZone } = selectedVendorConfig
    this.setState({
      selectedTimezone: timeZone,
    })
  }

  formateData = dataElement => {
    return dataElement.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(',')
  }

  handleVendorBlockEdit = () => {
    const { dispatch } = this.props
    dispatch(updateVendorNameBlockEdit(TRUE_VALUE))
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, token, selectedVendorConfig } = this.props
    const { selectedTimezone } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        const value = {
          timeZone: selectedTimezone,
          tradingName: values.tradingName,
          registeredCompanyName: values.legalName,
        }
        dispatch(updateVendorData(selectedVendorConfig.id, value, token))
      }
    })
  }

  handleDeleteVendorConfig = () => {
    const { selectedVendorConfig, token, dispatch } = this.props
    dispatch(deleteVendorConfiguration(selectedVendorConfig.id, token))
  }

  setSelectedTimezone = time => {
    this.setState({ selectedTimezone: time })
  }

  // onChangeOfferedService = value => {
  //   this.setState({ servicesOffering: value })
  // }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateVendorNameBlockEdit(false))
  }

  getUserName = userId => {
    const { users } = this.props
    const userData = users !== undefined && users?.filter(user => user?.id === userId)
    return users !== undefined && userData?.length > 0
      ? `${userData[0]?.firstName} ${` `} ${userData[0]?.lastName}`
      : ''
  }

  render() {
    const {
      selectedVendorConfig,
      showAddressDataEditMode,
      showComplianceInfoEditMode,
      form,
      showVendorDataEditMode,
      vendorBlockLoading,
    } = this.props
    const { complianceInformation, genericInformation, timeZone } = selectedVendorConfig
    const { selectedTimezone } = this.state
    const popConfirmtext = 'Are you sure to delete this record?'

    const { noData } = this.state
    return (
      <React.Fragment>
        {showVendorDataEditMode ? (
          <Form layout="vertical" onSubmit={this.onSubmit}>
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Vendor's Trading Name" hasFeedback>
                  {form.getFieldDecorator('tradingName', {
                    initialValue: genericInformation.tradingName,
                    rules: [{ required: true, message: 'Please select vendor trading name' }],
                  })(<Input />)}
                </Form.Item>
              </div>
              <div className="col-md-6 col-lg-3">
                <Form.Item label="Vendor's Legal Name" hasFeedback>
                  {form.getFieldDecorator('legalName', {
                    initialValue: genericInformation.registeredCompanyName,
                    rules: [{ required: true, message: 'Please select vendor legal name' }],
                  })(<Input />)}
                </Form.Item>
              </div>
              {/* <div className="col-md-6 col-lg-3">
                <Form.Item label="Offered Services:" hasFeedback>
                  {form.getFieldDecorator('offeredServices', {
                    initialValue: profile.servicesOffering,
                    rules: [{ required: true, message: 'Please select offered services' }],
                  })(
                    <Select
                      showSearch
                      optionLabelProp="label"
                      mode="multiple"
                      placeholder="Search by offered services"
                      onChange={this.onChangeOfferedService}
                      filterOption={(input, option) =>
                        option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
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
                <div className="pb-4 mt-1">
                  <TimezoneSelect
                    value={selectedTimezone.value}
                    onChange={this.setSelectedTimezone}
                    className={styles.box}
                  />
                </div>
              </div>
              {/* ) : (
                ''
              )} */}
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
                <Button className={styles.btnSAVE} htmlType="submit" loading={vendorBlockLoading}>
                  Update
                </Button>
              </div>
              <Spacer height="15px" />
            </div>
          </Form>
        ) : (
          <div className="row">
            {selectedVendorConfig.status ? (
              <div className="col-md-12 col-lg-12">
                <div className={`${styles.actionBtns}`}>
                  <Button type="link" onClick={this.handleVendorBlockEdit}>
                    <Icon type="edit" size="large" className={styles.editIcon} />
                  </Button>
                  <Popconfirm
                    placement="topLeft"
                    title={popConfirmtext}
                    onConfirm={() => this.handleDeleteVendorConfig()}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link">
                      <Icon type="delete" size="large" className={styles.deleteIcon} />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            ) : (
              ''
            )}

            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Vendor Trading Name</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {genericInformation.tradingName
                    ? capitalize(genericInformation.tradingName)
                    : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Vendor Legal Name</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {genericInformation.registeredCompanyName
                    ? capitalize(genericInformation.registeredCompanyName)
                    : noData}
                </span>
              </div>
            </div>

            {/* <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Offered Services</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {profile.servicesOffering ? this.formateData(profile.servicesOffering) : noData}
                </span>
              </div>
            </div> */}

            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Time Zone</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">{timeZone ? timeZone.label : noData}</span>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Created By</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedVendorConfig.createdBy
                    ? this.getUserName(selectedVendorConfig?.createdBy)
                    : noData}
                </span>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Updated By</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedVendorConfig.updatedBy
                    ? this.getUserName(selectedVendorConfig?.updatedBy)
                    : noData}
                </span>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Status</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedVendorConfig.status ? (
                    <p style={{ color: 'green' }}>Active</p>
                  ) : (
                    <p style={{ color: 'red' }}>Inactive</p>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {showAddressDataEditMode ? (
          <EditVendorAddress record={genericInformation.addresses[0]} />
        ) : (
          <ViewVendorAddress />
        )}
        <Spacer height="15px" />
        {showComplianceInfoEditMode ? (
          <EditComplianceInfo record={complianceInformation} />
        ) : (
          <ViewComplianceInfo />
        )}
      </React.Fragment>
    )
  }
}

export default viewVendorData
