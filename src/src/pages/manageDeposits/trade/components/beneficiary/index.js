import React, { Component } from 'react'
import { Col, Popover, Button, Select, Popconfirm } from 'antd'
import { connect } from 'react-redux'

import styles from './style.module.scss'

const { Option } = Select

@connect()
class Beneficiary extends Component {
  state = {
    visible: false,
    updatedBeneficiary: {},
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
    const { clientBeneficiaries } = this.props
    const beneficiary = clientBeneficiaries.find(el => el.id === value)
    this.setState({
      updatedBeneficiary: beneficiary,
    })
  }

  getCryptoBene = clientBeneficiaries => {
    return clientBeneficiaries.map(bene => (
      <Option key={bene.id} label={bene.aliasName}>
        <h6>{bene.aliasName}</h6>
        <small>{bene.cryptoCurrency}</small>
      </Option>
    ))
  }

  getFiatBene = clientBeneficiaries => {
    return clientBeneficiaries.map(option => (
      <Option key={option.id} label={option.bankAccountDetails.nameOnAccount}>
        <h6>{option.bankAccountDetails.nameOnAccount}</h6>
        <small>{option.bankAccountDetails.bankAccountCurrency}</small>
        <div>
          <small>
            {option.bankAccountDetails.accountNumber
              ? `Account Number : ${option.bankAccountDetails.accountNumber}`
              : ''}
          </small>
        </div>
        <div>
          <small>
            {option.bankAccountDetails.iban ? `Iban : ${option.bankAccountDetails.iban}` : ''}
          </small>
        </div>
      </Option>
    ))
  }

  getEdit = () => {
    const { clientBeneficiaries, beneficiary } = this.props
    let beneOptions
    if (Object.entries(beneficiary).length !== 0) {
      if (beneficiary.cryptoCurrency) {
        beneOptions = beneficiary.cryptoCurrency
          ? this.getCryptoBene(clientBeneficiaries)
          : this.getFiatBene(clientBeneficiaries)
      } else if (clientBeneficiaries[0]) {
        beneOptions = clientBeneficiaries[0].cryptoCurrency
          ? this.getCryptoBene(clientBeneficiaries)
          : this.getFiatBene(clientBeneficiaries)
      } else {
        beneOptions = []
      }
    } else if (clientBeneficiaries[0]) {
      beneOptions = clientBeneficiaries[0].cryptoCurrency
        ? this.getCryptoBene(clientBeneficiaries)
        : this.getFiatBene(clientBeneficiaries)
    } else {
      beneOptions = []
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
          {beneOptions}
        </Select>
        {/* <Button className="ml-1" type="primary" onClick={this.update}>
          Update
        </Button> */}
        <Popconfirm
          title="Sure to update?"
          onConfirm={() => {
            this.update()
          }}
        >
          <Button className="ml-2" type="primary">
            Update
          </Button>
        </Popconfirm>
      </div>
    )
  }

  update = () => {
    const { updatedBeneficiary } = this.state
    const { id, onBeneUpdate } = this.props
    const values = {
      updatedBeneficiary,
      id,
      isCrypto: updatedBeneficiary.cryptoCurrency !== undefined,
    }
    if (onBeneUpdate) onBeneUpdate(values)
    this.hidePopOver()
  }

  render() {
    const { isEditMode, beneficiary } = this.props
    const { visible } = this.state
    const nullSymbol = '---'
    const getBeneficiaryDetails = bene => {
      if (Object.entries(beneficiary).length !== 0) {
        if (bene.cryptoCurrency) {
          return bene.aliasName
        }
        if (bene.bankAccountDetails) {
          if (bene.bankAccountDetails.nameOnAccount) {
            return bene.bankAccountDetails.nameOnAccount
          }
        }
      }
      return nullSymbol
    }
    return (
      <Col className="mt-4">
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
                  {Object.entries(beneficiary).length !== 0
                    ? getBeneficiaryDetails(beneficiary)
                    : nullSymbol}
                </span>
              </Popover>
            ) : (
              <div className={`${styles.inputBox} ${styles.flex}`}>
                <span>
                  {Object.entries(beneficiary).length !== 0
                    ? getBeneficiaryDetails(beneficiary)
                    : nullSymbol}
                </span>
              </div>
            )}
          </div>
        </div>
      </Col>
    )
  }
}
export default Beneficiary
