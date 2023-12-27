import React, { Component } from 'react'
import { Card, Form, Button, Spin, Divider, Table } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import lodash from 'lodash'
import Spacer from 'components/CleanUIComponents/Spacer'
import {
  getPaymentTransactionDetailsById,
  getPaymentTransactionSummary,
} from 'redux/caTransactions/actions'
import { amountFormatter, formatToZoneDate, formatChatLongTime } from 'utilities/transformer'

import styles from './style.module.scss'

const mapStateToProps = ({ user, settings, caTransactions, general }) => ({
  token: user.token,
  timeZone: settings.timeZone.value,
  loading: caTransactions.loading,
  selectedTransactionDetail: caTransactions.selectedTransactionDetail,
  selectedTransactionRecordId: caTransactions.selectedTransactionRecordId,
  countries: general.countries,
  txnSummary: caTransactions.selectedTransactionSummaries,
  txnSummaryLoading: caTransactions.txnSummaryLoading,
})

@Form.create()
@connect(mapStateToProps)
class Currency extends Component {
  // eslint-disable-next-line no-useless-constructor
  // eslint-disable-next-line react/sort-comp
  constructor(props) {
    super(props)
    this.state = {
      noData: '--',
    }
  }

  tableColumns = [
    {
      title: '#',
      key: 'id',
      render: (value, item, index) => {
        return index + 1
      },
    },
    {
      title: 'Activity State',
      key: 'state',
      dataIndex: 'state',
      render: record => {
        return lodash.upperFirst(lodash.startCase(record))
      },
    },
    {
      title: 'Description',
      key: 'txnDesp',
      dataIndex: 'bms',
    },
    {
      title: 'Start Time',
      key: 'startTime',
      dataIndex: 'startTime',
      render: record => {
        const { timeZone } = this.props
        return formatChatLongTime(record, timeZone)
      },
    },
    {
      title: 'End Time',
      key: 'endTime',
      dataIndex: 'endTime',
      render: record => {
        const { timeZone } = this.props
        return formatChatLongTime(record, timeZone)
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'isSuccess',
      render: record => {
        if (record) {
          return (
            <>
              <CheckCircleOutlined style={{ color: 'green' }} />
              {' Success'}
            </>
          )
        }
        return (
          <>
            <CloseCircleOutlined style={{ color: 'red' }} />
            {' Failure'}
          </>
        )
      },
    },
  ]

  componentDidMount() {
    this.getParamId()
  }

  getParamId = () => {
    const { dispatch, token, match } = this.props
    const ID = match.params.id
    dispatch(getPaymentTransactionDetailsById(ID, token))
    dispatch(getPaymentTransactionSummary(ID, token))
  }

  getSenderUI = data => {
    return (
      <React.Fragment>
        <span className="font-size-18">Sender Details:</span>
        <Divider className={styles.dividerBlock} />
        <div className="row">
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Name</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtor ? lodash.startCase(data.debtor.debtorName) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Address</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorAddress ? this.getAddress(data.debtorAddress) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Country</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorCountry ? this.getCountryName(data.debtorCountry) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Number / IBAN</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorAccount ? lodash.startCase(data.debtorAccount) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Bank Name</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorAgent ? lodash.startCase(data.debtorAgent.debtorAgentName) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Bank code</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorAgent ? lodash.startCase(data.debtorAgent.debtorAgentId) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Bank Country</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorAgent?.debtorAgentCountry
                  ? this.getCountryName(data.debtorCountry)
                  : ''}
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  getLayout = isOutbound => {
    const { selectedTransactionDetail } = this.props
    return isOutbound
      ? this.getBeneficiaryUI(selectedTransactionDetail)
      : this.getSenderUI(selectedTransactionDetail)
  }

  getCountryName = countryISO => {
    const { countries } = this.props
    const selectedCountry = countries.filter(country => country.alpha2Code === countryISO)
    return selectedCountry.length > 0 ? selectedCountry[0].name : ''
  }

  getAddress = data => {
    const { buildingNumber, street, city, state, postalCode } = data
    const flatNumber = buildingNumber || ''
    const streetName = street || ''
    const cityName = city || ''
    const stateName = state || ''
    const postCode = postalCode || ''
    const value = `${flatNumber}  ${streetName} ${cityName}  ${stateName} ${postCode}`
    return value
  }

  getBeneficiaryUI = data => {
    const { noData } = this.state

    return (
      <React.Fragment>
        <span className="font-size-18">Beneficiary Details:</span>
        <Divider className={styles.dividerBlock} />
        <div className="row">
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Name</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditor ? lodash.startCase(data.creditor.creditorName) : ''}
              </span>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Address</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditor && data.creditor.creditorAddress
                  ? this.getAddress(data.creditor.creditorAddress)
                  : noData}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Country</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditor && data.creditor.creditorCountry
                  ? this.getCountryName(data.creditor.creditorCountry)
                  : noData}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Account Number/ IBAN</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13" style={{ wordBreak: 'break-all' }}>
                {data.creditorAccount ? data.creditorAccount : noData}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Bank Name</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditorAgentName
                  ? lodash.startCase(data.creditorAgent.creditorAgentName)
                  : noData}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15"> Bank Code</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditorAgent ? lodash.startCase(data.creditorAgent.creditorAgentId) : noData}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Bank Country</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditorAgent?.creditorAgentCountry
                  ? this.getCountryName(data.creditorAgent.creditorAgentCountry)
                  : ''}
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  handlerBack = () => {
    const { history, selectedTransactionDetail, selectedTransactionRecordId } = this.props

    let id = ''

    if (selectedTransactionRecordId?.type?.split('_')[0] === 'vendor') {
      id = selectedTransactionRecordId?.id
    } else {
      id = selectedTransactionDetail.accountId
    }

    history.push(`/account-balance/transactions-account-details/${id}`)
  }

  render() {
    const {
      selectedTransactionDetail,
      loading,
      timeZone,
      txnSummary,
      txnSummaryLoading,
    } = this.props

    console.log(txnSummary, '#R@$#@$#@$')

    const { noData } = this.state
    return (
      <React.Fragment>
        <Spin spinning={loading || txnSummaryLoading}>
          <Card
            title={
              <div>
                {/* <span className="font-size-16">Approval Summary Details :</span> */}
                <Button
                  type="link"
                  icon="arrow-left"
                  className={styles.backArrowIcon}
                  onClick={this.handlerBack}
                />
                {`${' '} ${'Transaction Details :'}`}
              </div>
            }
            bordered
            headStyle={{
              border: '1px solid #a8c6fa',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
            }}
            bodyStyle={{
              padding: '29px',
              paddingBottom: '3px',
              border: '1px solid #a8c6fa',
              borderBottomRightRadius: '10px',
              borderBottomLeftRadius: '10px',
            }}
            className={styles.mainCard}
          >
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Date Executed/Received</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedTransactionDetail.createdAt
                      ? formatToZoneDate(selectedTransactionDetail.createdAt, timeZone)
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Value Date</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedTransactionDetail.valueDate
                      ? formatToZoneDate(selectedTransactionDetail.valueDate, timeZone)
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">End To End Reference</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedTransactionDetail.endToEndReference
                      ? selectedTransactionDetail.endToEndReference
                      : noData}
                  </span>
                </div>
              </div>

              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Transaction Type</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedTransactionDetail.isOutbound ? 'Debit' : 'Credit'}
                  </span>
                </div>
              </div>

              <React.Fragment>
                {selectedTransactionDetail.processFlow !== 'manual_credit_adjustment' ? (
                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-15">Amount instructed</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {`${amountFormatter(selectedTransactionDetail.debitAmount)} ${
                          selectedTransactionDetail.debitCurrency
                        }`}
                      </span>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Fees</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedTransactionDetail.fees
                        ? `${selectedTransactionDetail.fees?.liftingFeeAmount} ${selectedTransactionDetail.fees?.liftingFeeCurrency}`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                {selectedTransactionDetail.processFlow !== 'manual_debit_adjustment' ? (
                  <div className="col-md-6 col-lg-3">
                    <strong className="font-size-15">Amount Received</strong>
                    <div className="pb-4 mt-1">
                      <span className="font-size-13">
                        {`${amountFormatter(selectedTransactionDetail.creditAmount)} ${
                          selectedTransactionDetail.creditCurrency
                        }`}
                      </span>
                    </div>
                  </div>
                ) : (
                  ''
                )}
              </React.Fragment>

              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Remittance Information</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13" style={{ wordBreak: 'break-all' }}>
                    {selectedTransactionDetail.remittanceInformation
                      ? selectedTransactionDetail.remittanceInformation
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Payment Routing Channel</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedTransactionDetail.paymentRoutingChannel
                      ? selectedTransactionDetail.paymentRoutingChannel
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Payment Settlement Channel</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedTransactionDetail.settlementChannel
                      ? selectedTransactionDetail.settlementChannel
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Exchange Rate</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedTransactionDetail?.foreignExchange?.allInRate
                      ? selectedTransactionDetail?.foreignExchange?.allInRate
                      : noData}
                  </span>
                </div>
              </div>
            </div>
            <Spacer height="10px" />
            {Object.entries(selectedTransactionDetail).length > 0 &&
            selectedTransactionDetail.processFlow !== 'manual_debit_adjustment' &&
            selectedTransactionDetail.processFlow !== 'manual_credit_adjustment'
              ? this.getLayout(selectedTransactionDetail.isOutbound)
              : ''}
            {txnSummary?.length ? (
              <Table dataSource={txnSummary} columns={this.tableColumns} />
            ) : (
              <></>
            )}
          </Card>
          <Spacer height="5px" />
        </Spin>
      </React.Fragment>
    )
  }
}

export default Currency
