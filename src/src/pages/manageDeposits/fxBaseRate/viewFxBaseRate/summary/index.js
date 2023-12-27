import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Timeline, Icon } from 'antd'

import { formatChatLongTime } from 'utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ general, settings, fxBaseRate }) => ({
  clients: general.clients,
  timeZone: settings.timeZone.value,
  timeZoneCode: settings.timeZone.code,
  currentFxBaseRate: fxBaseRate.currentFxBaseRate,
})

@connect(mapStateToProps)
class FxBaseRateSummary extends Component {
  render() {
    const { timeZone, timeZoneCode, currentFxBaseRate } = this.props

    const SuccessIcon = (
      <Icon style={{ fontSize: '16px', color: '#4c7a34' }} type="check-circle" theme="filled" />
    )
    const nullSymbol = '---'

    return (
      <Card bordered={false}>
        <Timeline>
          <Timeline.Item dot={SuccessIcon}>
            <div>
              <strong className="font-size-15">Rate Provider Name:</strong>
              <div className="pb-3 mt-1">
                <span className="font-size-12">Rate provided by</span>
              </div>
              <div className={`${styles.inputBox}`}>
                <div className="p-3">{currentFxBaseRate.baseProviderName}</div>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item dot={SuccessIcon}>
            <div>
              <strong className="font-size-15">Source Currency:</strong>
              <div className="pb-3 mt-1">
                <span className="font-size-12">Selected source currency</span>
              </div>
              <div className={`${styles.inputBox}`}>
                <div className="p-3">{currentFxBaseRate.baseCurrency}</div>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item dot={SuccessIcon}>
            <div>
              <strong className="font-size-15">Destination Currency:</strong>
              <div className="pb-3 mt-1">
                <span className="font-size-12">Selected destination currency</span>
              </div>
              <div className={`${styles.inputBox}`}>
                <div className="p-3">{currentFxBaseRate.targetCurrency}</div>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item dot={SuccessIcon}>
            <div>
              <strong className="font-size-15">Rate:</strong>
              <div className={`${styles.inputBox} mt-2`}>
                <div className="font-size-12 p-3">{currentFxBaseRate.inverseAmount}</div>
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item dot={SuccessIcon}>
            <div>
              <strong className="font-size-15">Rate applied Date</strong>
              <div className={`${styles.inputBox} mt-2`}>
                <div className="font-size-12 p-3">
                  {currentFxBaseRate.rateAppliedAt
                    ? `${formatChatLongTime(
                        currentFxBaseRate.rateAppliedAt,
                        timeZone,
                      )} ${timeZoneCode}`
                    : nullSymbol}
                </div>
              </div>
            </div>
          </Timeline.Item>
        </Timeline>
      </Card>
    )
  }
}
export default FxBaseRateSummary
