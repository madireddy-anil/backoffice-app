import React, { Component } from 'react'
import { Button, Form, Icon, Popconfirm } from 'antd'
import { deleteSelectedPricingProfile } from 'redux/pricingProfile/action'
import { connect } from 'react-redux'
import { capitalize, getName } from '../../../../../utilities/transformer'
import styles from './style.module.scss'
// import data from './data.json'

// const { Option } = Select

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  clients: general.clients,
  companies: general.companies,
  selectedPricingProfile: pricing.selectedPricingProfile,
})

@Form.create()
@connect(mapStateToProps)
class initialPricingDataView extends Component {
  state = {
    noData: '--',
  }

  formateData = dataElement => {
    return dataElement
      .map(word => {
        if (word === 'trades') {
          return 'Foreign Exchange'
        }
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join(',')
  }

  handleDeletedPricingProfile = () => {
    const { selectedPricingProfile, dispatch, token } = this.props
    dispatch(deleteSelectedPricingProfile(selectedPricingProfile.id, token))
  }

  render() {
    const { selectedPricingProfile, checkEditMode, clients, companies } = this.props
    const { noData } = this.state
    const popConfirmtext = 'Are you sure to delete this pricing profile?'
    return (
      <div className="row">
        {selectedPricingProfile.profileActive ? (
          <div className={`col-md-6 col-lg-12 ${styles.actionBtns}`}>
            <Button type="link" onClick={() => checkEditMode(true)}>
              <Icon type="edit" size="large" className={styles.editIcon} />
            </Button>
            <Popconfirm
              placement="topLeft"
              title={popConfirmtext}
              onConfirm={this.handleDeletedPricingProfile}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link">
                <Icon type="delete" size="large" className={styles.deleteIcon} />
              </Button>
            </Popconfirm>
          </div>
        ) : (
          ''
        )}
        <div className="col-md-6 col-lg-3">
          <strong className="font-size-15">Profile Type</strong>
          <div className="pb-4 mt-1">
            <span className="font-size-13">
              {selectedPricingProfile.profileType
                ? capitalize(selectedPricingProfile.profileType)
                : noData}
            </span>
          </div>
        </div>
        {selectedPricingProfile.profileType === 'custom' ? (
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Client / Company : </strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedPricingProfile.entityId
                  ? getName([...clients, ...companies], selectedPricingProfile.entityId)
                  : noData}
              </span>
            </div>
          </div>
        ) : (
          ''
        )}
        <div className="col-md-6 col-lg-3">
          <div className="col-md-6 col-lg-6">
            <strong className="font-size-15">Product Type</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {selectedPricingProfile.products.length > 0
                  ? this.formateData(selectedPricingProfile.products)
                  : noData}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <strong className="font-size-15">Status</strong>
          <div className="pb-4 mt-1">
            <span className="font-size-13">
              {selectedPricingProfile.profileActive ? (
                <p style={{ color: 'green' }}>Active</p>
              ) : (
                <p style={{ color: 'red' }}>Inactive</p>
              )}
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default initialPricingDataView
