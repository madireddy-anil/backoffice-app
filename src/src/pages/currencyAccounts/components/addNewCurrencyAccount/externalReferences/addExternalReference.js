import React, { Component } from 'react'
import { Modal, Form, Input, Button, Select } from 'antd'
import {
  updateShowAddExternalReference,
  addNewExternalReference,
} from 'redux/currencyAccounts/action'
import InfoCard from 'components/customComponents/InfoCard'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, general, currencyAccounts }) => ({
  token: user.token,
  clients: general.clients,
  vendors: general.newVendors,
  companies: general.companies,
  selectedCurrencyAccount: currencyAccounts.selectedCurrencyAccount,

  showAddExternalReference: currencyAccounts.showAddExternalReference,
  addExternalRefLoading: currencyAccounts.addExternalRefLoading,
})

@Form.create()
@connect(mapStateToProps)
class addExternalReferences extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, token, selectedCurrencyAccount, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch(addNewExternalReference(selectedCurrencyAccount.id, values, token))
      }
    })
  }

  handleAddReferenceCancel = () => {
    const { dispatch } = this.props
    dispatch(updateShowAddExternalReference(false))
  }

  onCancelHandler = () => {
    const { dispatch } = this.props
    dispatch(updateShowAddExternalReference(false))
  }

  getIssuerEntityDropDown = type => {
    const { form, vendors, companies } = this.props
    const vendorOption = vendors.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))

    const companiesList = companies.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))
    switch (type) {
      case 'client':
        return (
          <Form.Item label="Vendor" hasFeedback>
            {form.getFieldDecorator('issuerEntityId', {
              rules: [{ required: true, message: 'Please select vendor' }],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                optionLabelProp="label"
                placeholder="Please select vendor"
                //   value={selectedType}
                filterOption={(input, option) =>
                  option.props.label
                    ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : ''
                }
              >
                {companiesList}
              </Select>,
            )}
          </Form.Item>
        )
      case 'pl':
        return (
          <Form.Item label="Vendor" hasFeedback>
            {form.getFieldDecorator('issuerEntityId', {
              rules: [{ required: true, message: 'Please select vendor' }],
            })(
              <Select
                showSearch
                optionFilterProp="children"
                optionLabelProp="label"
                placeholder="Please select vendor"
                //   value={selectedType}
                filterOption={(input, option) =>
                  option.props.label
                    ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : ''
                }
              >
                {companiesList}
              </Select>,
            )}
          </Form.Item>
        )
      case 'vendor_client':
        return (
          <Form.Item label="Vendor" hasFeedback>
            {form.getFieldDecorator('issuerEntityId', {
              rules: [{ required: true, message: 'Please select vendor' }],
            })(
              <Select
                // showArrow={false}
                // className={styles.selectDropDown}
                style={{ width: '100%', borderRadius: '9px' }}
                showSearch
                placeholder="Please select vendor"
                optionLabelProp="label"
                onClick={() => this.handleSelectClick}
                filterOption={(input, option) =>
                  option.props.label
                    ? option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : ''
                }
              >
                {vendorOption}
              </Select>,
            )}
          </Form.Item>
        )
      case 'vendor_pl':
        return (
          <Form.Item label="Vendor" hasFeedback>
            {form.getFieldDecorator('issuerEntityId', {
              rules: [{ required: true, message: 'Please select vendor' }],
            })(
              <Select
                // showArrow={false}
                // className={styles.selectDropDown}
                style={{ width: '100%', borderRadius: '9px' }}
                showSearch
                placeholder="Please select vendor"
                optionLabelProp="label"
                onClick={() => this.handleSelectClick}
                filterOption={(input, option) =>
                  option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {vendorOption}
              </Select>,
            )}
          </Form.Item>
        )
      default:
        return ''
    }
  }

  render() {
    const {
      form,
      selectedCurrencyAccount,
      showAddExternalReference,
      addExternalRefLoading,
    } = this.props

    return (
      <React.Fragment>
        <Modal
          visible={showAddExternalReference}
          title={
            <div className={styles.modalHeader}>
              <InfoCard
                minHeight="80px"
                imgHeight="100px"
                imgTop="43%"
                header="Add External References"
                closeButton={this.handleAddReferenceCancel}
              />
            </div>
          }
          footer={null}
          className={styles.modalBlock}
          closable={false}
          destroyOnClose
        >
          <Helmet title="Currency" />
          <div>
            <Form layout="vertical" onSubmit={this.onSubmit}>
              <div className="row">
                <div className="col-md-12 col-lg-12">
                  {this.getIssuerEntityDropDown(selectedCurrencyAccount.accountType)}
                </div>

                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Reference" hasFeedback>
                    {form.getFieldDecorator('reference', {
                      rules: [{ required: true, message: 'Please enter reference' }],
                    })(<Input placeholder="Enter reference" />)}
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className={styles.btnStyles}>
                  <Button
                    className={styles.btnCANCEL}
                    onClick={this.onCancelHandler}
                    // disabled={payments.length === 0}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={styles.btnSAVE}
                    htmlType="submit"
                    loading={addExternalRefLoading}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Modal>
      </React.Fragment>
    )
  }
}

export default addExternalReferences
