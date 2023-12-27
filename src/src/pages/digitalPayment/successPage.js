import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Result, Button } from 'antd'

const mapStateToProps = ({ digitalPayment }) => ({
  paymentDetails: digitalPayment.paymentDetails,
})

@withRouter
@connect(mapStateToProps)
class paymentSuccess extends Component {
  handleNewPayment = () => {
    const { history } = this.props
    history.push(`/new-payment`)
  }

  backToHome = () => {
    const { history } = this.props
    history.push(`/payments-accounts-list`)
  }

  render() {
    const { paymentDetails } = this.props
    return (
      <Result
        status="success"
        title="Payment Submitted Successfully !"
        subTitle={`Your Payment with reference: ${
          paymentDetails.payment !== undefined ? paymentDetails.payment.transactionReference : ' '
        } has been successfully submitted`}
        extra={[
          <Button type="primary" key="console" onClick={this.backToHome}>
            Back to home
          </Button>,
          <Button key="buy" onClick={this.handleNewPayment}>
            Create another Payment
          </Button>,
        ]}
      />
    )
  }
}

export default paymentSuccess
