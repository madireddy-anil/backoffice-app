import React, { Component } from 'react'
import { Button, Form, Select } from 'antd'
import { connect } from 'react-redux'
import { editTradePricingData } from 'redux/pricingProfile/action'

import styles from './style.module.scss'
// import data from './data.json'

const { Option } = Select

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  currencies: general.currencies,
  selectedPricingProfile: pricing.selectedPricingProfile,
  tradeLoading: pricing.tradeLoading,
})

@Form.create()
@connect(mapStateToProps)
class addPaymentData extends Component {
  onSubmitTradeData = event => {
    event.preventDefault()
    const { form, dispatch, selectedPricingProfile, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        const pricingtradeId = selectedPricingProfile.trades._id
        values.pricingId = selectedPricingProfile.id
        values.tradesActive = selectedPricingProfile.trades.tradesActive
        dispatch(editTradePricingData(pricingtradeId, values, token))
      }
    })
  }

  render() {
    const { form, currencies, selectedPricingProfile, tradeLoading } = this.props

    const currenciesList = currencies.map(option => (
      <Option key={option.value} value={option.value} label={option.value}>
        {option.value}
      </Option>
    ))
    return (
      <React.Fragment>
        <Form layout="vertical" onSubmit={this.onSubmitTradeData}>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Buy Currency :" hasFeedback>
                {form.getFieldDecorator('buyCurrency', {
                  initialValue: selectedPricingProfile.trades.buyCurrency,
                  rules: [{ required: true, message: 'Please select buy currency' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    className={styles.cstmSelectInput}
                    placeholder="Select buy currency"
                    showSearch
                    onChange={this.handleSelectedBuyCurrency}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {currenciesList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            <div className="col-md-6 col-lg-3">
              <Form.Item label="Sell Currency :" hasFeedback>
                {form.getFieldDecorator('sellCurrency', {
                  initialValue: selectedPricingProfile.trades.sellCurrency,
                  rules: [{ required: true, message: 'Please select sell currency' }],
                })(
                  <Select
                    style={{ width: '100%' }}
                    optionLabelProp="label"
                    className={styles.cstmSelectInput}
                    placeholder="Select sell currency"
                    showSearch
                    onChange={this.handleSelectedSellCurrency}
                    filterOption={(input, option) =>
                      option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {currenciesList}
                  </Select>,
                )}
              </Form.Item>
            </div>
            <div className="col-lg-4">
              <div className="pb-3 mt-3">
                <Button className={styles.btnNEXT} htmlType="submit" loading={tradeLoading}>
                  Update
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </React.Fragment>
    )
  }
}

export default addPaymentData
