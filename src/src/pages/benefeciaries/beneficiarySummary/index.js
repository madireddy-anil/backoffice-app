import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Timeline, Icon } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
import { ClockCircleOutlined } from '@ant-design/icons'

import styles from './style.module.scss'

const mapStateToProps = ({ general, trade, settings }) => ({
  clients: general.clients,
  routeEngineData: trade.routeEngineData,
  client: trade.clientId,
  sourceAmount: trade.totalDepositAmount,
  sourceCurrency: trade.depositCurrency,
  beneficiary: trade.beneficiary,
  tradeConfirmed: trade.progressLogs.tradeRequestedAt,
  depositConfirmedByClient: trade.progressLogs.depositConfirmedByClientAt,
  fundsRecceiptConfirmationByClient: trade.progressLogs.fundsRecceiptConfirmationByClientAt,
  timeZone: settings.timeZone.value,
})

@connect(mapStateToProps)
class BeneficiarySummary extends Component {
  render() {
    const {
      clientOrVendor,

      // Title
      BankDetails,
      beneDetails,
      interMDetails,

      // bene Details
      beneType,
      Country,
      Currency,
      AccountName,
      BankName,
      AccountNumber,
      BranchCode,
      Iban,
      Bicswift,
      city,
      Street,
      Province,
      Postalcode,
      IAccountnumber,
      IBiccode,
      IIBan,
      IBranchcode,
      IReference,
      status,
    } = this.props
    const SuccessIcon = (
      <Icon style={{ fontSize: '16px', color: '#4c7a34' }} type="check-circle" theme="filled" />
    )
    return (
      <Card bordered={false}>
        <Timeline>
          <Timeline.Item hidden={!clientOrVendor} dot={SuccessIcon}>
            <div>
              <strong className="font-size-15">{clientOrVendor}</strong>
            </div>
          </Timeline.Item>
          <Timeline.Item hidden={!beneType} dot={SuccessIcon}>
            <strong className="font-size-15">Beneficiary Type</strong>
            <div className={styles.subText}>
              <strong className="font-size-12 mt-1">{beneType}</strong>
              <br />
            </div>
            <Spacer height="10px" />
          </Timeline.Item>
          <Timeline.Item hidden={!Country && !Currency} dot={SuccessIcon}>
            <strong className="font-size-15">Country and Currency</strong>
            <div className={styles.subText}>
              <p>Country: </p>
              <strong className="font-size-12 ml-3 mt-1">{Country}</strong>
              <br />
            </div>
            <div className={styles.subText}>
              <p>Currency: </p>
              <strong className="font-size-12 pb=4 ml-3 mt-1">{Currency}</strong>
            </div>
            <Spacer height="10px" />
          </Timeline.Item>
          <Timeline.Item hidden={!BankDetails} dot={SuccessIcon}>
            <strong className="font-size-15">Bank Account Details</strong>
            <div className={styles.subText}>
              <strong className="font-size-12 mt-1">{AccountName}</strong>
              <br />
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{BankName}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{AccountNumber}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{BranchCode}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{Iban}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{Bicswift}</strong>
            </div>
            <Spacer height="10px" />
          </Timeline.Item>
          <Timeline.Item hidden={!beneDetails} dot={SuccessIcon}>
            <strong className="font-size-15">Beneficiary Details</strong>
            <div className={styles.subText}>
              <strong className="font-size-12 mt-1">{city}</strong>
              <br />
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{Street}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{Province}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{Postalcode}</strong>
            </div>
            <Spacer height="10px" />
          </Timeline.Item>
          <Timeline.Item hidden={!interMDetails} dot={SuccessIcon}>
            <strong className="font-size-15">Inetermediary Bank Details</strong>
            <div className={styles.subText}>
              <strong className="font-size-12 mt-1">{IAccountnumber}</strong>
              <br />
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{IBiccode}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{IBiccode}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{IIBan}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{IBranchcode}</strong>
            </div>
            <div className={styles.subText}>
              <strong className={styles.subSubText}>{IReference}</strong>
            </div>
            <Spacer height="10px" />
          </Timeline.Item>
          <Timeline.Item
            hidden={!beneType}
            dot={
              status === 'Active' ? (
                SuccessIcon
              ) : (
                <ClockCircleOutlined className="timeline-clock-icon" style={{ color: '#F89532' }} />
              )
            }
          >
            <strong className="font-size-15 mt-1 mt-10">{status}</strong>
          </Timeline.Item>
        </Timeline>
      </Card>
    )
  }
}
export default BeneficiarySummary
