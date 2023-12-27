import React, { Component } from 'react'
import { Form } from 'antd'
import { connect } from 'react-redux'
import { capitalize } from '../../../../../utilities/transformer'

// const { Option } = Select

const mapStateToProps = ({ user, general, pricing }) => ({
  token: user.token,
  clients: general.clients,
  selectedPricingProfile: pricing.selectedPricingProfile,
})

@Form.create()
@connect(mapStateToProps)
class viewTradeData extends Component {
  state = {
    noData: '--',
  }

  formateData = dataElement => {
    return dataElement.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(',')
  }

  render() {
    const { selectedPricingProfile } = this.props
    const { noData } = this.state
    return (
      <div className="row">
        <div className="col-md-6 col-lg-3">
          <strong className="font-size-15">Buy Currency</strong>
          <div className="pb-4 mt-1">
            <span className="font-size-13">
              {selectedPricingProfile.trades.buyCurrency
                ? capitalize(selectedPricingProfile.trades.buyCurrency)
                : noData}
            </span>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <strong className="font-size-15">Sell Currency</strong>
          <div className="pb-4 mt-1">
            <span className="font-size-13">
              {selectedPricingProfile.trades.sellCurrency
                ? capitalize(selectedPricingProfile.trades.sellCurrency)
                : noData}
            </span>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <strong className="font-size-15">Status :</strong>
          <div className="pb-4 mt-1">
            <span className="font-size-13">
              {selectedPricingProfile.trades.tradesActive ? (
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

export default viewTradeData
