import React, { Component } from 'react'
import { Card, Form, Table, Button, Spin, Modal, Input, Divider, Alert } from 'antd'
import { connect } from 'react-redux'
// import moment from 'moment'
import lodash from 'lodash'
import Spacer from 'components/CleanUIComponents/Spacer'
import InfoCard from 'components/customComponents/InfoCard'
import { approvePaymentRequest, rejectPaymentRequest } from 'redux/paymentErrorQueue/action'
// import {
//   getAllErrorQueueList,
//   getPaymentsListByFilters,
//   updateSelectedErrorRecord,
// } from 'redux/paymentErrorQueue/action'
import {
  getName,
  amountFormatter,
  formatToZoneDate,
  getExceptionMessage,
} from '../../../utilities/transformer'

import styles from './style.module.scss'

const { TextArea } = Input

const mapStateToProps = ({ user, paymentErrorQueue, general, settings }) => ({
  token: user.token,
  countries: general.countries,
  selectedPaymentsList: paymentErrorQueue.selectedPaymentsList,
  selectedApprovalRequest: paymentErrorQueue.selectedApprovalRequest,
  loading: paymentErrorQueue.loading,
  selectedQueueStatus: paymentErrorQueue.selectedFilters.selectedQueueStatus,
  timeZone: settings.timeZone.value,
  entities: general.entities,
})

// const UNDEFINED_VALUE = undefined
// const TRUE_VALUE = true
// const FALSE_VALUE = false

@Form.create()
@connect(mapStateToProps)
class Currency extends Component {
  state = {
    noData: '--',
    modalvisible: false,
    selectedAction: undefined,
    comment: '',
    okClicked: false,
  }

  handleButtonClick = e => {
    this.setState({ modalvisible: true, selectedAction: e.target.value })
  }

  handleCancel = () => {
    this.setState({ modalvisible: false, selectedAction: undefined, comment: '', okClicked: false })
  }

  commentHandler = e => {
    this.setState({ comment: e.target.value })
  }

  handleSubmit = () => {
    const { selectedAction, comment } = this.state
    const { selectedApprovalRequest, dispatch, token } = this.props
    this.setState({ okClicked: true })
    const value = {
      approveStatus: selectedAction,
      processFlow: selectedApprovalRequest.processFlow,
      remarks: comment,
    }
    if (selectedAction === 'approve' && comment) {
      dispatch(approvePaymentRequest(selectedApprovalRequest.id, value, token))
    }
    if (selectedAction === 'reject' && comment) {
      dispatch(rejectPaymentRequest(selectedApprovalRequest.id, value, token))
    }
  }

  handlerBack = () => {
    const { history } = this.props

    const redirectionUrl = {
      pathname: `/error-queue-list`,
      state: 'approval-Summary',
    }
    history.push(redirectionUrl)
    // history.push('/error-queue-list')
  }

  getSenderUI = data => {
    return (
      <React.Fragment>
        <span className="font-size-18">Sender Details:</span>
        <Divider className={styles.dividerBlock} />
        <div className="row">
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Sender Name</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtor ? lodash.startCase(data.debtor.debtorName) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Sender Account/ IBAN</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorAccount ? lodash.startCase(data.debtorAccount) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Sender Bank</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorAgent ? lodash.startCase(data.debtorAgent.debtorAgentId) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Sender Account Type</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorAccountType ? lodash.startCase(data.debtorAccountType) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Sent Currency</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">{data.debitCurrency ? data.debitCurrency : ''}</span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Sent Amount</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debitAmount ? amountFormatter(data.debitAmount) : ''}
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  getCurrency = record => {
    let value
    if (
      record.processFlow === 'manual_credit_adjustment' ||
      record.processFlow === 'manual_debit_adjustment'
    ) {
      value = record.isOutbound ? record.debitCurrency : record.creditCurrency
    } else {
      value = record.isOutbound ? record.creditCurrency : record.debitCurrency
    }

    return value
  }

  getBeneficiaryUI = data => {
    return (
      <React.Fragment>
        <span className="font-size-18">Beneficiary Details:</span>
        <Divider className={styles.dividerBlock} />
        <div className="row">
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Beneficiary Name</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditor ? lodash.startCase(data.creditor.creditorName) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Beneficiary Account/ IBAN</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditorAccount ? lodash.startCase(data.creditorAccount) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15"> Beneficiary Bank</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.debtorAgent ? lodash.startCase(data.debtorAgent.debtorAgentId) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Beneficiary Account Type</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditorAccountType ? lodash.startCase(data.creditorAccountType) : ''}
              </span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Beneficiary Currency</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">{data.creditCurrency ? data.creditCurrency : ''}</span>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <strong className="font-size-15">Amount Credited</strong>
            <div className="pb-4 mt-1">
              <span className="font-size-13">
                {data.creditAmount ? amountFormatter(data.creditAmount) : ''}
              </span>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  getAmount = record => {
    let value
    if (
      record.processFlow === 'manual_credit_adjustment' ||
      record.processFlow === 'manual_debit_adjustment'
    ) {
      value = record.isOutbound
        ? amountFormatter(record.debitAmount)
        : amountFormatter(record.creditAmount)
    } else {
      value = record.isOutbound
        ? amountFormatter(record.creditAmount)
        : amountFormatter(record.debitAmount)
    }

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

  getCountryName = countryISO => {
    const { countries } = this.props
    const selectedCountry = countries.filter(country => country.alpha2Code === countryISO)
    return selectedCountry.length > 0 ? selectedCountry[0].name : ''
  }

  getLayout = isOutbound => {
    const { selectedApprovalRequest } = this.props
    return isOutbound
      ? this.getBeneficiaryUI(selectedApprovalRequest)
      : this.getSenderUI(selectedApprovalRequest)
  }

  render() {
    const {
      selectedPaymentsList,
      selectedApprovalRequest,
      loading,
      entities,
      selectedQueueStatus,
      timeZone,
    } = this.props

    const { noData, modalvisible, selectedAction, comment, okClicked } = this.state
    const expandedRowRender = record => {
      return (
        <React.Fragment>
          {selectedApprovalRequest.processFlow === 'manual_credit_adjustment' ||
          selectedApprovalRequest.processFlow === 'manual_debit_adjustment' ? (
            ''
          ) : (
            <div className={styles.innerTable}>{this.getSenderUI(record)}</div>
          )}
          {selectedApprovalRequest.processFlow === 'manual_credit_adjustment' ||
          selectedApprovalRequest.processFlow === 'manual_debit_adjustment' ||
          selectedApprovalRequest.beneficiaryDetails === undefined ? (
            ''
          ) : (
            <div className={styles.innerTable}>{this.getBeneficiaryUI(record)}</div>
          )}
          {record.beneficiaryDetails !== undefined &&
          Object.entries(record.beneficiaryDetails.beneficiaryDetails).length > 0 ? (
            <React.Fragment>
              <span className="font-size-18">Beneficiary Account Details:</span>
              <div className={`row ${styles.innerTable}`}>
                <Divider className={styles.dividerBlock} />
                {Object.entries(record.beneficiaryDetails).map(([key, value]) => {
                  return (
                    <div className="col-md-6 col-lg-3" key={key}>
                      <strong className="font-size-15">{lodash.startCase(key)}</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">{value}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </React.Fragment>
          ) : (
            ''
          )}
        </React.Fragment>
      )
    }
    const columns = [
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        render: date => formatToZoneDate(date, timeZone),
      },
      {
        title: 'Transaction Reference',
        dataIndex: 'transactionReference',
        key: 'transactionReference',
        align: 'center',
      },
      {
        title: 'Process Flow',
        dataIndex: 'processFlow',
        key: 'processFlow',
        align: 'center',
        render: text => lodash.startCase(text),
      },
      {
        title: 'Payment Type',
        dataIndex: 'isOutbound',
        key: 'isOutbound',
        align: 'center',
        render: text => (text ? 'Debit' : 'Credit'),
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        align: 'center',
        render: (text, record) => this.getCurrency(record),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'center',
        render: (text, record) => this.getAmount(record),
      },
      {
        title: 'Remittance Information',
        dataIndex: 'remittanceInformation',
        key: 'remittanceInformation',
        align: 'center',
        // fixed: 'right',
      },

      {
        title: 'Exception Status',
        dataIndex: '',
        key: 'messageValidationResult',
        align: 'center',
        // fixed: 'right',
        render: text => getExceptionMessage(text),
      },
    ]
    return (
      <React.Fragment>
        <Spin spinning={loading}>
          {selectedApprovalRequest?.exitStatusCode === 'P100' ? (
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
              extra={
                <>
                  {selectedQueueStatus === 'awaitingReview' ? (
                    <React.Fragment>
                      <Button
                        type="primary"
                        onClick={e => this.handleButtonClick(e)}
                        className={styles.approveButton}
                        value="approve"
                      >
                        Approve
                      </Button>
                      <Button
                        type="primary"
                        value="reject"
                        className={styles.rejectButton}
                        onClick={e => this.handleButtonClick(e)}
                      >
                        Reject
                      </Button>
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </>
              }
            >
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Date Executed/Received</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.createdAt
                        ? formatToZoneDate(selectedApprovalRequest.createdAt, timeZone)
                        : noData}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Value Date</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.valueDate
                        ? formatToZoneDate(selectedApprovalRequest.valueDate, timeZone)
                        : noData}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">End To End Reference</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.endToEndReference
                        ? selectedApprovalRequest.endToEndReference
                        : noData}
                    </span>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Transaction Type</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.isOutbound ? 'Debit' : 'Credit'}
                    </span>
                  </div>
                </div>

                <React.Fragment>
                  {selectedApprovalRequest.processFlow !== 'manual_credit_adjustment' ? (
                    <div className="col-md-6 col-lg-3">
                      <strong className="font-size-15">Amount instructed</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {`${amountFormatter(selectedApprovalRequest.debitAmount)} ${
                            selectedApprovalRequest.debitCurrency
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
                        {selectedApprovalRequest.fees
                          ? `${selectedApprovalRequest.fees?.liftingFeeAmount} ${selectedApprovalRequest.fees?.liftingFeeCurrency}`
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                  {selectedApprovalRequest.processFlow !== 'manual_debit_adjustment' ? (
                    <div className="col-md-6 col-lg-3">
                      <strong className="font-size-15">Amount Received</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {`${amountFormatter(selectedApprovalRequest.creditAmount)} ${
                            selectedApprovalRequest.creditCurrency
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
                      {selectedApprovalRequest.remittanceInformation
                        ? selectedApprovalRequest.remittanceInformation
                        : noData}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Payment Routing Channel</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.paymentRoutingChannel
                        ? selectedApprovalRequest.paymentRoutingChannel
                        : noData}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Payment Settlement Channel</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.settlementChannel
                        ? selectedApprovalRequest.settlementChannel
                        : noData}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Exchange Rate</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest?.foreignExchange?.allInRate
                        ? selectedApprovalRequest?.foreignExchange?.allInRate
                        : noData}
                    </span>
                  </div>
                </div>
              </div>
              <Spacer height="10px" />
              {Object.entries(selectedApprovalRequest).length > 0 &&
              selectedApprovalRequest.processFlow !== 'manual_debit_adjustment' &&
              selectedApprovalRequest.processFlow !== 'manual_credit_adjustment'
                ? this.getLayout(selectedApprovalRequest.isOutbound)
                : ''}
              {/* {txnSummary?.length ? (
              <Table dataSource={txnSummary} columns={this.tableColumns} />
            ) : (
              <></>
            )} */}
            </Card>
          ) : (
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
                  {`${' '} ${'Approval Summary Details :'}`}
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
              extra={
                <>
                  {selectedQueueStatus === 'awaitingReview' ? (
                    <React.Fragment>
                      <Button
                        type="primary"
                        onClick={e => this.handleButtonClick(e)}
                        className={styles.approveButton}
                        value="approve"
                      >
                        Approve
                      </Button>
                      <Button
                        type="primary"
                        value="reject"
                        className={styles.rejectButton}
                        onClick={e => this.handleButtonClick(e)}
                      >
                        Reject
                      </Button>
                    </React.Fragment>
                  ) : (
                    ''
                  )}
                </>
              }
            >
              <div className="row">
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Created On</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.createdAt
                        ? formatToZoneDate(selectedApprovalRequest.createdAt, timeZone)
                        : noData}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Client</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.ownerEntityId
                        ? getName(entities, selectedApprovalRequest.ownerEntityId)
                        : noData}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Payment Reference</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.transactionReference
                        ? selectedApprovalRequest.transactionReference
                        : noData}
                    </span>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Exception Status</strong>
                  <div className="pb-4 mt-1">
                    <span className={styles.statusMsg}>
                      {getExceptionMessage(selectedApprovalRequest)}
                    </span>
                  </div>
                </div>

                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Process Flow</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.processFlow
                        ? lodash.startCase(selectedApprovalRequest.processFlow)
                        : ''}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Payment Type</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.isOutbound ? 'Debit' : 'Credit'}
                    </span>
                  </div>
                </div>
                {selectedApprovalRequest.processFlow === 'manual_credit_adjustment' ||
                selectedApprovalRequest.processFlow === 'manual_debit_adjustment' ? (
                  <React.Fragment>
                    <div className="col-md-6 col-lg-3">
                      <strong className="font-size-15">Amount</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {selectedApprovalRequest.isOutbound
                            ? amountFormatter(selectedApprovalRequest.debitAmount)
                            : amountFormatter(selectedApprovalRequest.creditAmount)}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <strong className="font-size-15">Currency</strong>
                      <div className="pb-4 mt-1">
                        <span className="font-size-13">
                          {selectedApprovalRequest.isOutbound
                            ? selectedApprovalRequest.debitCurrency
                            : selectedApprovalRequest.creditCurrency}
                        </span>
                      </div>
                    </div>
                  </React.Fragment>
                ) : (
                  ''
                )}
                <div className="col-md-6 col-lg-3">
                  <strong className="font-size-15">Remittance Information</strong>
                  <div className="pb-4 mt-1">
                    <span className="font-size-13">
                      {selectedApprovalRequest.remittanceInformation
                        ? selectedApprovalRequest.remittanceInformation
                        : noData}
                    </span>
                  </div>
                </div>
              </div>
              <Spacer height="10px" />
              {selectedApprovalRequest.processFlow === 'manual_credit_adjustment' ||
              selectedApprovalRequest.processFlow === 'manual_debit_adjustment'
                ? ''
                : this.getSenderUI(selectedApprovalRequest)}

              <Spacer height="10px" />
              {selectedApprovalRequest.processFlow === 'manual_credit_adjustment' ||
              selectedApprovalRequest.processFlow === 'manual_debit_adjustment' ||
              selectedApprovalRequest.beneficiaryDetails === undefined
                ? ''
                : this.getBeneficiaryUI(selectedApprovalRequest)}
              <Spacer height="10px" />
              {selectedApprovalRequest.beneficiaryDetails ? (
                <React.Fragment>
                  <span className="font-size-18">Beneficiary Account Details:</span>
                  <Divider className={styles.dividerBlock} />
                  {/* <Spacer height="15px" /> */}
                  <div className="row">
                    {Object.entries(
                      selectedApprovalRequest.beneficiaryDetails.beneficiaryDetails,
                    ).map(([key, value]) => {
                      return (
                        <div className="col-md-6 col-lg-3" key={key}>
                          <strong className="font-size-15">{lodash.startCase(key)}</strong>
                          <div className="pb-4 mt-1">
                            <span className="font-size-13">{value}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </React.Fragment>
              ) : (
                ''
              )}
            </Card>
          )}

          <Spacer height="5px" />
          {selectedApprovalRequest?.exitStatusCode === 'E1' && (
            <Card
              title={
                <div>
                  <span className="font-size-16">Matched Payment Records</span>
                </div>
              }
              bordered
              headStyle={{
                border: '1px solid #a8c6fa',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
              bodyStyle={{
                padding: '0',
                border: '1px solid #a8c6fa',
                borderBottomRightRadius: '10px',
                borderBottomLeftRadius: '10px',
              }}
              className={styles.mainCard}
            >
              <div className={styles.data}>
                {/* {this.getSearchUI()} */}
                <div className="row">
                  <div className="col-xl-12">
                    <Table
                      columns={columns}
                      rowKey={record => record.id}
                      //   loading={loading}
                      dataSource={selectedPaymentsList}
                      scroll={{ x: 'max-content' }}
                      //   pagination={pagination}
                      onChange={this.handleTableChange}
                      bordered
                      expandedRowRender={
                        selectedApprovalRequest.processFlow === 'manual_credit_adjustment' ||
                        selectedApprovalRequest.processFlow === 'manual_debit_adjustment'
                          ? false
                          : record => expandedRowRender(record)
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
          <Modal
            title={
              <div className={styles.modalHeader}>
                <InfoCard
                  minHeight="70px"
                  imgHeight="100px"
                  imgTop="35%"
                  header={`Reason to ${lodash.capitalize(selectedAction)}`}
                  closeButton={this.handleCancel}
                />
              </div>
            }
            closable={false}
            visible={modalvisible}
            onOk={this.handleSubmit}
            confirmLoading={loading}
            onCancel={this.handleCancel}
          >
            {comment === '' && okClicked ? (
              <Alert message="Please enter comments" type="error" showIcon />
            ) : (
              ''
            )}
            <Spacer height="5px" />
            <TextArea
              onChange={this.commentHandler}
              value={comment}
              placeholder="Type your comments here..."
              rows={4}
            />
          </Modal>
        </Spin>
      </React.Fragment>
    )
  }
}

export default Currency
