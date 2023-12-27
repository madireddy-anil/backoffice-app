import React, { Component } from 'react'
import { Card, Form, Icon, Timeline } from 'antd'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import styles from '../style.module.scss'

const mapStateToProps = ({ general, user }) => ({
  vendors: general.newVendors,
  token: user.token,
})
@Form.create()
@connect(mapStateToProps)
class AccountsSummary extends Component {
  errMessage = errMessage => {
    return <span className={styles.errMsg}>{errMessage}</span>
  }

  render() {
    const { summaryViewDetails, handleDelete, vendor } = this.props
    const SuccessIcon = (
      <Icon style={{ fontSize: '16px', color: '#4c7a34' }} type="check-circle" theme="filled" />
    )
    return (
      <div className={styles.summaryTimeline}>
        <Timeline>
          {Object.entries(vendor).length > 0 && (
            <Timeline.Item dot={SuccessIcon}>
              <div>
                <strong className="font-size-15">Vendor:</strong>
                <div className="pb-3 mt-1">
                  <span className="font-size-12">Selected Vendor</span>
                </div>
                <div className={`${styles.listCard}`}>
                  <h6>
                    {Object.entries(vendor).length > 0
                      ? vendor.genericInformation?.tradingName
                      : ''}
                  </h6>
                  <div>
                    <small>
                      {Object.entries(vendor).length > 0
                        ? vendor.genericInformation?.registeredCompanyName
                        : ''}
                    </small>
                  </div>
                  <div>
                    <small>
                      {Object.entries(vendor).length > 0
                        ? vendor.genericInformation?.vendorType
                        : ''}
                    </small>
                  </div>
                </div>
              </div>
            </Timeline.Item>
          )}
          {summaryViewDetails.length > 0 && (
            <Timeline.Item dot={SuccessIcon}>
              <div>
                <strong className="font-size-15">Accounts Summary</strong>
              </div>
              <div>
                Selected Accounts
                {summaryViewDetails.map((item, index) => {
                  return (
                    <div key={uuidv4()} className="pb-3 mt-3">
                      <Card
                        className={styles.localAccountSummaryCard}
                        bodyStyle={{
                          marginBottom: '-14px',
                        }}
                      >
                        <div className={styles.iconClose}>
                          <Icon type="delete" onClick={e => handleDelete(e, item, index)} />
                        </div>
                        <div className="row">
                          {item.map(obj => {
                            return (
                              <div key={uuidv4()} className="col-lg-4">
                                <div>
                                  <p className="font-size-11 mb-1">{obj.labelName}</p>
                                  <p className="font-weight-bold font-size-11 mb-3">
                                    {obj.isError ? this.errMessage(obj.errorMessage) : obj.value}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>
            </Timeline.Item>
          )}
        </Timeline>
      </div>
    )
  }
}

export default AccountsSummary
