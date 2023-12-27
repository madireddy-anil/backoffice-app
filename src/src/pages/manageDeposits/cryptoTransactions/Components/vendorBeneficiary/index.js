import React, { Component } from 'react'
import { Col, Popover, Select, Form, message } from 'antd'
import { connect } from 'react-redux'

import { updateSelectedBeneficiary } from 'redux/transactions/actions'
import { updateRouteSequence } from 'redux/trade/actions'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, cryptoTransaction, trade }) => {
  return {
    token: user.token,
    isBeneficiarySelected: cryptoTransaction.isBeneficiarySelected,
    selectedTransaction: cryptoTransaction.selectedTransaction,
    tradeBeneficiaryId: trade.beneficiary.id,
    tradeId: trade.id,
  }
}

@Form.create()
@connect(mapStateToProps)
class VendorBeneficiary extends Component {
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

  getEdit = () => {
    const { clientBeneficiaries } = this.props
    const beneOption = clientBeneficiaries.map(option => (
      <Option key={option.id} label={option.bankAccountDetails.nameOnAccount}>
        <h6>{option.bankAccountDetails.nameOnAccount}</h6>
        <small>{option.bankAccountDetails.bankAccountCurrency}</small>
      </Option>
    ))
    return (
      <div>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select a Beneficiary"
          optionFilterProp="children"
          optionLabelProp="label"
          onChange={this.onBeneChange}
          onSearch={this.onBeneSearch}
          filterOption={(input, option) =>
            option.props.children[0].props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {beneOption}
        </Select>
      </div>
    )
  }

  getBeneName = (beneficiary, nullSymbol) => {
    if (Object.entries(beneficiary).length !== 0) {
      if (beneficiary.bankAccountDetails) {
        return beneficiary.bankAccountDetails.nameOnAccount
      }
    }
    return nullSymbol
  }

  onBeneChange = value => {
    const {
      clientBeneficiaries,
      selectedTransaction,
      tradeId,
      tradeBeneficiaryId,
      dispatch,
      token,
    } = this.props
    const beneficiary = clientBeneficiaries.find(el => el.id === value)
    const values = {
      id: selectedTransaction.id,
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

    this.hidePopOver()
  }

  render() {
    const { isEditMode, beneficiary, isBeneficiarySelected, clientBeneficiaries, form } = this.props
    const { visible } = this.state
    const nullSymbol = '---'
    const getBeneficiaryDetails = bene => {
      if (bene.bankAccountDetails) {
        if (bene.bankAccountDetails.nameOnAccount) {
          return bene.bankAccountDetails.nameOnAccount
        }
      }
      return nullSymbol
    }
    const vendorBeneOption = clientBeneficiaries.map(option => (
      <Option key={option.id} label={option.bankAccountDetails.nameOnAccount}>
        <h6>{option.bankAccountDetails.nameOnAccount}</h6>
        <small>{option.bankAccountDetails.bankAccountCurrency}</small>
      </Option>
    ))
    return (
      <Col xs={{ span: 24 }} lg={{ span: 12 }}>
        <div>
          <h6>
            <strong>Beneficiary:</strong>
          </h6>
          {isBeneficiarySelected ? (
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
                    {Object.entries(beneficiary).length !== 0
                      ? getBeneficiaryDetails(beneficiary)
                      : nullSymbol}
                  </span>
                </Popover>
              ) : (
                <div className={styles.inputBox}>
                  <span>
                    {Object.entries(beneficiary).length !== 0
                      ? getBeneficiaryDetails(beneficiary)
                      : nullSymbol}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Form.Item label="">
                {form.getFieldDecorator('vendorBeneficiary', {
                  initialValue: this.getBeneName(beneficiary, nullSymbol),
                  rules: [{ message: 'Please Select a Beneficiary' }],
                })(
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Select a Beneficiary"
                    optionFilterProp="children"
                    optionLabelProp="label"
                    onChange={this.onBeneChange}
                    onSearch={this.onBeneSearch}
                    filterOption={(input, option) =>
                      option.props.children[0].props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {vendorBeneOption}
                  </Select>,
                )}
              </Form.Item>
            </div>
          )}
        </div>
      </Col>
    )
  }
}
export default VendorBeneficiary
