import React, { Component } from 'react'
import {
  Col,
  Popover,
  // Button,
  Select,
  message,
} from 'antd'
import { connect } from 'react-redux'

import { updateSelectedBeneficiary } from 'redux/cryptoTransactions/actions'
import { updateRouteSequence } from 'redux/trade/actions'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, cryptoTransaction, general, trade }) => ({
  token: user.token,
  cryptoTransactionId: cryptoTransaction.selectedTransaction.id,
  beneficiary: cryptoTransaction.selectedTransaction.beneficiary,
  selectedTransaction: cryptoTransaction.selectedTransaction,
  cryptoBeneficiaries: general.cryptoBeneficiaries,
  currentRouteType: cryptoTransaction.currentRouteType,
  isBeneficiarySelected: cryptoTransaction.isBeneficiarySelected,
  beneficiaries: general.beneficiaries,
  tradeBeneficiaryId: trade.beneficiary.id,
  tradeId: trade.id,
})

@connect(mapStateToProps)
class Beneficiary extends Component {
  state = {
    visible: false,
    // updatedBeneficiary: {},
  }

  hidePopOver = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleChange = visible => {
    this.setState({ visible })
  }

  onChange = value => {
    const {
      cryptoTransactionId,
      selectedTransaction,
      tradeBeneficiaryId,
      tradeId,
      cryptoBeneficiaries,
      beneficiaries,
      currentRouteType,
      dispatch,
      token,
    } = this.props
    let beneficiary = {}
    // const beneficiary = cryptoBeneficiaries.find(el => el.id === value)
    if (currentRouteType === 'otc' || currentRouteType === 'crypto_wallet') {
      beneficiary = cryptoBeneficiaries.find(el => el.id === value)
    } else {
      beneficiary = beneficiaries.find(el => el.id === value)
    }
    const values = {
      id: cryptoTransactionId,
      tradeRouterId: selectedTransaction.tradeRouterId,
      beneficiary,
    }
    dispatch(updateSelectedBeneficiary(values, token))
    if (tradeBeneficiaryId) {
      if (tradeBeneficiaryId === value) {
        const routeData = {
          allSequenceComplete: true,
          routeId: selectedTransaction.tradeRouterId,
          token,
        }
        dispatch(updateRouteSequence(routeData, tradeId, token))
        message.warning('Selected beneficiary is match with Trade beneficiary')
      } else {
        const routeData = {
          allSequenceComplete: false,
          routeId: selectedTransaction.tradeRouterId,
          token,
        }
        dispatch(updateRouteSequence(routeData, tradeId, token))
        message.warning('Selected beneficiary is not match with Trade beneficiary')
      }
    }
    // this.setState(
    //   {
    //     updatedBeneficiary: beneficiary,
    //   },
    //   this.update,
    // )
  }

  getEdit = () => {
    const { beneficiaries, cryptoBeneficiaries, currentRouteType } = this.props
    let beneOption
    if (currentRouteType === 'otc' || currentRouteType === 'crypto_wallet') {
      beneOption = cryptoBeneficiaries.map(option => (
        <Option key={option.id} label={option.aliasName ? option.aliasName : ''}>
          <h6>{option.aliasName ? option.aliasName : ''}</h6>
          <small>{option.cryptoCurrency ? option.cryptoCurrency : ''}</small>
          <br />
          <small>
            {option.cryptoWalletAddress ? `Wallet Address: ${option.cryptoWalletAddress}` : ''}
          </small>
        </Option>
      ))
    } else {
      beneOption = beneficiaries.map(option => (
        <Option
          key={option.id}
          label={option.bankAccountDetails && option.bankAccountDetails.nameOnAccount}
        >
          <h6>{option.bankAccountDetails && option.bankAccountDetails.nameOnAccount}</h6>
          <small>
            {option.bankAccountDetails && option.bankAccountDetails.bankAccountCurrency}
          </small>
          <br />
          <small>
            {option.bankAccountDetails &&
              `Account Number: ${option.bankAccountDetails.accountNumber}`}
          </small>
        </Option>
      ))
    }
    return (
      <div>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a Beneficiary"
          optionFilterProp="children"
          optionLabelProp="label"
          onChange={this.onChange}
          onSearch={this.onSearch}
          filterOption={(input, option) =>
            option.props.children[0].props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {beneOption}
        </Select>
        {/* <Button className="ml-1" type="primary" onClick={this.update}>
          Update
        </Button> */}
      </div>
    )
  }

  // update = () => {
  //   const { updatedBeneficiary } = this.state
  //   const { cryptoTransactionId, dispatch, token } = this.props
  //   const values = {
  //     beneficiary: updatedBeneficiary,
  //     id: cryptoTransactionId,
  //   }
  //   dispatch(updateBeneficiary(values, token))
  //   this.hidePopOver()
  // }

  render() {
    const {
      isEditMode,
      beneficiary,
      cryptoBeneficiaries,
      beneficiaries,
      currentRouteType,
      isBeneficiarySelected,
    } = this.props
    const { visible } = this.state
    const nullSymbol = '---'
    const getBeneficiaryDetails = bene => {
      if (currentRouteType === 'otc' || currentRouteType === 'crypto_wallet') {
        return bene.aliasName
      }
      if (bene.bankAccountDetails) {
        if (bene.bankAccountDetails.nameOnAccount) {
          return bene.bankAccountDetails.nameOnAccount
        }
      }
      return nullSymbol
    }
    let beneOption
    if (currentRouteType === 'otc' || currentRouteType === 'crypto_wallet') {
      beneOption = cryptoBeneficiaries.map(option => (
        <Option key={option.id} label={option.aliasName ? option.aliasName : ''}>
          <h6>{option.aliasName ? option.aliasName : ''}</h6>
          <small>{option.cryptoCurrency ? option.cryptoCurrency : ''}</small>
          <br />
          <small>
            {option.cryptoWalletAddress ? `Wallet Address: ${option.cryptoWalletAddress}` : ''}
          </small>
        </Option>
      ))
    } else {
      beneOption = beneficiaries.map(option => (
        <Option
          key={option.id}
          label={option.bankAccountDetails && option.bankAccountDetails.nameOnAccount}
        >
          <h6>{option.bankAccountDetails && option.bankAccountDetails.nameOnAccount}</h6>
          <small>
            {option.bankAccountDetails && option.bankAccountDetails.bankAccountCurrency}
          </small>
          <br />
          <small>
            {option.bankAccountDetails &&
              `Account Number : ${option.bankAccountDetails.accountNumber}`}
          </small>
        </Option>
      ))
    }
    return (
      <Col className="mt-4" xs={{ span: 24 }} lg={{ span: 12 }}>
        <div>
          <h6>
            <strong>Beneficiary:</strong>
          </h6>
          <div>
            {isEditMode ? (
              <Popover
                content={this.getEdit()}
                title="Select a Beneficiary"
                trigger="click"
                placement="topLeft"
                visible={visible}
                onVisibleChange={this.handleVisibleChange}
              >
                <span className="edit-mode">
                  {beneficiary ? getBeneficiaryDetails(beneficiary) : nullSymbol}
                </span>
              </Popover>
            ) : (
              <React.Fragment>
                <div className={styles.inputBox} hidden={!isBeneficiarySelected}>
                  <span>{beneficiary ? getBeneficiaryDetails(beneficiary) : '---'}</span>
                </div>
                <div hidden={isBeneficiarySelected}>
                  <Select
                    showSearch
                    style={{ width: 200, maxHeight: '4rem' }}
                    placeholder="Select a Beneficiary"
                    optionFilterProp="children"
                    optionLabelProp="label"
                    onChange={this.onChange}
                    value={beneficiary ? getBeneficiaryDetails(beneficiary) : nullSymbol}
                    onSearch={this.onSearch}
                    filterOption={(input, option) =>
                      option.props.children[0].props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {beneOption}
                  </Select>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </Col>
    )
  }
}
export default Beneficiary
