import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'antd'

import { getNextStepNotification } from 'utilities/transformer'

import { showNextNotification, closeNextNotification } from 'redux/trade/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ trade }) => ({
  isLocalAccountsRequested: trade.isLocalAccountsRequested,
  isLocalAccountsFetched: trade.isLocalAccountsFetched,
  isPayslipReceived: trade.isPayslipReceived,
  isDepositAmountConfirmed: trade.isDepositAmountConfirmed,
  isRateConfirmed: trade.isRateConfirmed,
  isCommisionConfirmed: trade.isCommisionConfirmed,
  isFundReceiptConfirmed: trade.isFundReceiptConfirmed,
  showNextStepNotification: trade.showNextStepNotification,
})

@connect(mapStateToProps)
class NextStepNotification extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(showNextNotification())
  }

  onCloseNotification() {
    const { dispatch } = this.props
    dispatch(closeNextNotification())
  }

  getNextStep = () => {
    const { isLocalAccountsRequested } = this.props
    if (isLocalAccountsRequested) {
      return getNextStepNotification('accounts_requested')
    }
    return ''
  }

  render() {
    const { showNextStepNotification } = this.props
    return (
      showNextStepNotification && (
        <div className={`${styles.flexSpaceBetween} ${styles.listCard}`}>
          <div className="pl-4">
            <span>
              <Icon className="font-size-16" type="info-circle" />
            </span>
            <span className="font-size-16 ml-3">
              <strong>Next Step: </strong>
              {this.getNextStep()}
            </span>
          </div>
          <div style={{ alignItems: 'center', cursor: 'pointer' }}>
            <Icon onClick={() => this.onCloseNotification()} type="close" />
          </div>
        </div>
      )
    )
  }
}
export default NextStepNotification
