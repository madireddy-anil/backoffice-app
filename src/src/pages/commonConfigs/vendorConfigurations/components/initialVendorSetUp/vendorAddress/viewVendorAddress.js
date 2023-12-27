import React, { Component } from 'react'
import { Form, Card, Button, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import lodash from 'lodash'
import { updateAddressEditMode } from 'redux/vendorConfiguration/action'
import styles from '../style.module.scss'

const TRUE_VALUE = true

const mapStateToProps = ({ user, general, vendorConfiguration }) => ({
  token: user.token,
  clients: general.clients,
  countries: general.countries,

  selectedVendorConfig: vendorConfiguration.selectedVendorConfig,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class viewVendorAddress extends Component {
  handleAddressEdit = () => {
    const { dispatch } = this.props
    dispatch(updateAddressEditMode(TRUE_VALUE))
  }

  render() {
    const { selectedVendorConfig } = this.props
    const { genericInformation } = selectedVendorConfig
    return (
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
        extra={
          selectedVendorConfig.status ? (
            <div className={`${styles.actionBtns}`}>
              <Button type="link" onClick={this.handleAddressEdit}>
                <Icon type="edit" size="large" className={styles.editIcon} />
              </Button>
            </div>
          ) : (
            ''
          )
        }
      >
        <div className="row">
          {genericInformation?.addresses && Object.entries(genericInformation.addresses).length > 0
            ? Object.entries(genericInformation.addresses[0]).map(([key, value]) => {
                if (key !== '_id') {
                  return (
                    <div className="col-md-6 col-lg-3" key={key}>
                      <strong className="font-size-15">{lodash.startCase(key)}</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">{value}</span>
                      </div>
                    </div>
                  )
                }
                return ''
              })
            : ''}
        </div>
      </Card>
    )
  }
}

export default viewVendorAddress
