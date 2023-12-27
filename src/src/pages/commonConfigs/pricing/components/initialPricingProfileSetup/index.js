import React, { Component } from 'react'
import { Form, Select, Button } from 'antd'
import { addNewPricingProfile, updatePricingProfile } from 'redux/pricingProfile/action'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import data from './data.json'

const { Option } = Select

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  clients: general.clients,
  companies: general.companies,
  selectedPricingProfile: pricing.selectedPricingProfile,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class initialPricingData extends Component {
  state = {
    selectedProfileType: undefined,
  }

  componentDidMount() {
    const { fromEditView, selectedPricingProfile } = this.props
    if (fromEditView) {
      this.setState({ selectedProfileType: selectedPricingProfile.profileType })
    }
  }

  handleProfileType = e => {
    this.setState({ selectedProfileType: e })
  }

  onSubmit = event => {
    event.preventDefault()
    const {
      form,
      history,
      fromEditView,
      checkEditMode,
      dispatch,
      token,
      selectedPricingProfile,
    } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        if (fromEditView) {
          const pricingId = selectedPricingProfile.id
          values.profileActive = selectedPricingProfile.profileActive
          dispatch(updatePricingProfile(pricingId, values, token))
          checkEditMode(false)
        } else {
          values.profileActive = true
          dispatch(addNewPricingProfile(values, token))
          history.push('/edit-pricing-profile')
        }
      }
    })
  }

  render() {
    const { form, clients, fromEditView, selectedPricingProfile, companies } = this.props
    const { selectedProfileType } = this.state
    const profileTypeList = data.profileType.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    const clientOption = clients.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))

    const companyOption = companies.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))

    const productTypeList = data.productType.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))

    return (
      <Form layout="vertical" onSubmit={this.onSubmit}>
        <div className="row">
          <div className="col-md-6 col-lg-3">
            <Form.Item label="Profile Type:" hasFeedback>
              {form.getFieldDecorator('profileType', {
                initialValue: fromEditView ? selectedPricingProfile.profileType : undefined,
                rules: [{ required: true, message: 'Please select profile type' }],
              })(
                <Select
                  style={{ width: '100%' }}
                  optionLabelProp="label"
                  className={styles.cstmSelectInput}
                  placeholder="Select profile type"
                  showSearch
                  onChange={e => this.handleProfileType(e)}
                  filterOption={(input, option) =>
                    option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {profileTypeList}
                </Select>,
              )}
            </Form.Item>
          </div>
          {selectedProfileType === 'custom' ? (
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Client / Company :" hasFeedback>
                {form.getFieldDecorator('entityId', {
                  initialValue: fromEditView ? selectedPricingProfile.entityId : undefined,
                  rules: [{ required: true, message: 'Please select client' }],
                })(
                  <Select
                    showSearch
                    optionLabelProp="label"
                    placeholder="Search by Client Name"
                    // onChange={this.onChangeSelectClient}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {[...clientOption, ...companyOption]}
                  </Select>,
                )}
              </Form.Item>
            </div>
          ) : (
            ''
          )}
          <div className="col-md-6 col-lg-3">
            <Form.Item label="Product" hasFeedback>
              {form.getFieldDecorator('products', {
                initialValue: fromEditView ? selectedPricingProfile.products : undefined,
                rules: [{ required: true, message: 'Please select product' }],
              })(
                <Select
                  style={{ width: '100%' }}
                  optionLabelProp="label"
                  className={styles.cstmSelectInput}
                  placeholder="Select product"
                  showSearch
                  mode="multiple"
                  filterOption={(input, option) =>
                    option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {productTypeList}
                </Select>,
              )}
            </Form.Item>
          </div>
          <div className="col-md-6 col-lg-3">
            <Button className={styles.btnSAVE} htmlType="submit">
              {fromEditView ? 'Save' : 'Next'}
            </Button>
          </div>
        </div>
      </Form>
    )
  }
}

export default initialPricingData
