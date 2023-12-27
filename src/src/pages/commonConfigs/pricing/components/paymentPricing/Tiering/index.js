import React, { Component } from 'react'
import { Form, Radio, Select, Card } from 'antd'
import { connect } from 'react-redux'
import {
  updatePaymentTieringMethodSelected,
  updateIsPaymentTieredPricing,
} from 'redux/pricingProfile/action'
import Spacer from 'components/CleanUIComponents/Spacer'
import AddPaymentTiering from './addPaymentTiering'
import styles from './style.module.scss'
import data from '../data.json'

const { Option } = Select

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  currencies: general.currencies,
  isPaymentTier: pricing.isPaymentTier,
  selectedPricingProfile: pricing.selectedPricingProfile,

  paymentsTieringAddView: pricing.paymentsTieringAddView,
})

@Form.create()
@connect(mapStateToProps)
class TieringOptions extends Component {
  state = {
    showFields: false,
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(updateIsPaymentTieredPricing(undefined))
  }

  onRadioChange = e => {
    const { dispatch } = this.props
    this.setState({ showFields: false })

    if (e.target.value === 'false') {
      this.setState({ showFields: true })
    }

    dispatch(updatePaymentTieringMethodSelected(undefined))
    const selectedValue = e.target.value === 'true' || false
    dispatch(updateIsPaymentTieredPricing(selectedValue))
  }

  handleTieringMethod = e => {
    const { dispatch } = this.props
    this.setState({ showFields: true })
    dispatch(updatePaymentTieringMethodSelected(e))
  }

  render() {
    const { isPaymentTier } = this.props
    const { showFields } = this.state
    const tieringMethods = data.tieringMethods.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    return (
      <React.Fragment>
        <Card
          title="Tiering Details"
          bordered
          headStyle={{
            //   border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '30px',
            //   border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          className={styles.mainCard}
        >
          <div className="row">
            <div className="col-md-6 col-lg-12">
              <Radio.Group onChange={this.onRadioChange}>
                <Radio value="true">Tiered Pricing</Radio>
                <Radio value="false">Non-Tiered Pricing</Radio>
              </Radio.Group>
            </div>
          </div>
          {isPaymentTier ? (
            <div className="row">
              <div className="col-md-6 col-lg-4">
                <Select
                  style={{ width: '100%' }}
                  optionLabelProp="label"
                  className={styles.tieringSelectInput}
                  placeholder="Please select tiering method"
                  showSearch
                  // value={selectedTiering}
                  onChange={this.handleTieringMethod}
                  filterOption={(input, option) =>
                    option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {tieringMethods}
                </Select>
              </div>
            </div>
          ) : (
            ''
          )}
        </Card>
        <Spacer height="15px" />
        {showFields ? <AddPaymentTiering /> : ''}
      </React.Fragment>
    )
  }
}

export default TieringOptions
