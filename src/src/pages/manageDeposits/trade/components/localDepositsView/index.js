import React, { Component } from 'react'
import { Row, Col, Card, Empty, Tooltip, Icon } from 'antd'
import { connect } from 'react-redux'
import { amountFormatter } from 'utilities/transformer'

import { getTradeById } from 'redux/trade/actions'

import Download from 'components/CleanUIComponents/Download'

import styles from './style.module.scss'

const mapStateToProps = ({ user, trade }) => ({
  token: user.token,
  tradeId: trade.tradeId,
  bankAccounts: trade.localDepositAccounts,
})

@connect(mapStateToProps)
class LocalDepositsView extends Component {
  copyDivToClipboard = () => {
    const range = document.createRange()
    range.selectNode(document.getElementById('bankAccounts'))
    window.getSelection().removeAllRanges() // clear current selection
    window.getSelection().addRange(range) // to select text
    document.execCommand('copy')
    window.getSelection().removeAllRanges() // to deselect
  }

  getDepositBankAccounts = () => {
    const { dispatch, tradeId, token } = this.props
    dispatch(getTradeById(tradeId, token))
  }

  render() {
    const { bankAccounts } = this.props
    const data = []
    let localDepositAccounts
    if (bankAccounts.length > 0) {
      localDepositAccounts = bankAccounts.map(bank => {
        return (
          <div key={bank.id}>
            {bank.nameOnAccount ? <span>Name On Account &nbsp;: {bank.nameOnAccount}</span> : ''}
            {bank.accountNumber ? <span>Account Number &nbsp;: {bank.accountNumber}</span> : ''}
            {bank.accountCurrency ? <span>Account Currency : {bank.accountCurrency}</span> : ''}
            {bank.bankCountry ? <span>Account Currency : {bank.bankCountry}</span> : ''}
            {bank.bankName ? <span>Bank Name &nbsp;: {bank.bankName}</span> : ''}
            {bank.bankCode ? <span>Bank Code &nbsp;: {bank.bankCode}</span> : ''}
            {bank.bankCity ? <span>Bank City : {bank.bankCity}</span> : ''}
            {bank.bankProvince ? <span>Bank Province : {bank.bankProvince}</span> : ''}
            {bank.localAccountType ? <span>Local Account Type : {bank.localAccountType}</span> : ''}
            {bank.accountType ? <span>Account Type : {bank.accountType}</span> : ''}
            {bank.minAmount ? (
              <span>Minimum Deposit Amount : {amountFormatter(bank.minAmount)}</span>
            ) : (
              ''
            )}
            {bank.balanceAmount ? (
              <span>Maximum Deposit Amount : {amountFormatter(bank.balanceAmount)}</span>
            ) : (
              ''
            )}
            <span />
            <span />
          </div>
        )
      })

      bankAccounts.forEach(bank => {
        const accData = []
        accData.push(bank.nameOnAccount ? bank.nameOnAccount : '')
        accData.push(bank.accountNumber ? bank.accountNumber : '')
        accData.push(bank.accountCurrency ? bank.accountCurrency : '')
        accData.push(bank.bankCountry ? bank.bankCountry : '')
        accData.push(bank.bankName ? bank.bankName : '')
        accData.push(bank.bankCode ? bank.bankCode : '')
        accData.push(bank.bankCity ? bank.bankCity : '')
        accData.push(bank.bankProvince ? bank.bankProvince : '')
        accData.push(bank.balanceAmount ? bank.balanceAmount : '')
        accData.push(bank.localAccountType ? bank.localAccountType : '')
        accData.push(bank.accountType ? bank.accountType : '')
        accData.push(bank.minAmount ? bank.minAmount : '')
        accData.push(bank.maxAmount ? bank.maxAmount : '')
        data.push(accData)
      })
    }

    const localAccountsMoreActions = [
      <span key="copy">
        <Tooltip className="mr-2" title="Copy to clipord">
          <Icon type="copy" onClick={this.copyDivToClipboard} />
        </Tooltip>
      </span>,
      <span key="file-text" className="mr-2">
        {console.log('data', data)}
        <Download
          data={data}
          icon="file-text"
          toolTip="Download as Text"
          headers={[
            'Name On Account',
            'Account Number',
            'Account Currency',
            'Bank Country',
            'Bank Name',
            'Bank Code',
            'Bank City',
            'Bank Province',
            'Balance Amount',
            'Local Account Type',
            'Account Type',
            'Min Amount',
            'Max Amount',
          ]}
          onClickOk={this.handleOnClickOk}
          fileName="bankaccounts.txt"
        />
      </span>,
      <span key="file-excel" className="mr-2">
        <Download
          data={data}
          icon="file-excel"
          toolTip="Download as CSV"
          headers={[
            'Name On Account',
            'Account Number',
            'Account Currency',
            'Bank Country',
            'Bank Name',
            'Bank Code',
            'Bank City',
            'Bank Province',
            'Balance Amount',
            'Local Account Type',
            'Account Type',
            'Min Amount',
            'Max Amount',
          ]}
          onClickOk={this.handleOnClickOk}
          fileName="bankaccounts.csv"
        />
      </span>,
      <span key="reload">
        <Tooltip title="Refresh to get Accounts">
          <Icon type="reload" onClick={this.getDepositBankAccounts} />
        </Tooltip>
      </span>,
    ]
    return (
      <Row className="mt-4">
        <Col xs={{ span: 24 }} lg={{ span: 24 }}>
          <Card
            className={styles.card}
            title="Local Deposit Accounts"
            extra={
              bankAccounts.length !== 0 ? (
                localAccountsMoreActions
              ) : (
                <Tooltip title="Refresh to get Accounts">
                  <Icon type="reload" onClick={this.getDepositBankAccounts} />
                </Tooltip>
              )
            }
          >
            {bankAccounts.length !== 0 ? (
              <div id="bankAccounts" className={styles.codeBlockContainer}>
                <pre>{localDepositAccounts}</pre>
              </div>
            ) : (
              <Empty
                className="pt-3 pb-3"
                description={
                  <span>
                    Please await till we arrange the Bank Accounts for making the deposits.
                  </span>
                }
              />
            )}
          </Card>
        </Col>
      </Row>
    )
  }
}
export default LocalDepositsView
