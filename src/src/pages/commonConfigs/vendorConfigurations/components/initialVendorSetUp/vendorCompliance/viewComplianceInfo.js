import React, { Component } from 'react'
import { Form, Card, Button, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import lodash from 'lodash'
import { updateComplianceEditMode } from 'redux/vendorConfiguration/action'
import { formatToZoneDate } from '../../../../../../utilities/transformer'

import styles from '../style.module.scss'

const mapStateToProps = ({ user, general, vendorConfiguration, settings }) => ({
  token: user.token,
  clients: general.clients,
  countries: general.countries,

  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
  timeZone: settings.timeZone.value,
})

const TRUE_VALUE = true

@Form.create()
@withRouter
@connect(mapStateToProps)
class viewVendorCompliance extends Component {
  state = {
    noData: '--',
  }

  handleComplianceInfoEdit = () => {
    const { dispatch } = this.props
    dispatch(updateComplianceEditMode(TRUE_VALUE))
  }

  formateData = data => {
    return data.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(',')
  }

  render() {
    const { selectedVendorConfig, timeZone } = this.props
    const { noData } = this.state
    const { complianceInformation } = selectedVendorConfig
    return (
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
        extra={
          selectedVendorConfig.status ? (
            <div className={`${styles.actionBtns}`}>
              <Button type="link" onClick={this.handleComplianceInfoEdit}>
                <Icon type="edit" size="large" className={styles.editIcon} />
              </Button>
            </div>
          ) : (
            ''
          )
        }
      >
        {Object.entries(complianceInformation).length > 0 ? (
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">KYC Status</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {complianceInformation.kycStatus
                    ? lodash.startCase(complianceInformation.kycStatus)
                    : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">KYC Passed Date</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {complianceInformation.kycPassedDate
                    ? formatToZoneDate(complianceInformation.kycPassedDate, timeZone)
                    : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Licensed</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {complianceInformation.licensed ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            {complianceInformation.licensed ? (
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">License Details</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {complianceInformation.licenseDetails
                      ? complianceInformation.licenseDetails
                      : noData}
                  </span>
                </div>
              </div>
            ) : (
              ''
            )}
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Disallowed Industries</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {complianceInformation.disallowedIndustries
                    ? this.formateData(complianceInformation.disallowedIndustries)
                    : noData}
                </span>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </Card>
    )
  }
}

export default viewVendorCompliance
