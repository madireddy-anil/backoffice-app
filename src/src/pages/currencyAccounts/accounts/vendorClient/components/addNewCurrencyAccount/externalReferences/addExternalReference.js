import React, { Component } from 'react'
import { Modal, Form, Input, Button, Select } from 'antd'
import {
  updateShowAddExternalReference,
  addNewVendorClientExternalReference,
  editVendorClientExternalReference,
  updateShowEditExternalReference,
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
  showEditExternalReference: currencyAccounts.showEditExternalReference,
  addExternalRefLoading: currencyAccounts.addExternalRefLoading,
  selectedRecordToEdit: currencyAccounts.selectedRecordToEdit,
})

@Form.create()
@connect(mapStateToProps)
class addExternalReferences extends Component {
  onSubmit = event => {
    event.preventDefault()
    const {
      form,
      token,
      selectedCurrencyAccount,
      dispatch,
      showAddExternalReference,
      selectedRecordToEdit,
    } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        if (showAddExternalReference) {
          dispatch(addNewVendorClientExternalReference(selectedCurrencyAccount.id, values, token))
        } else {
          dispatch(
            editVendorClientExternalReference(
              selectedCurrencyAccount.id,
              selectedRecordToEdit.id,
              values,
              token,
            ),
          )
        }
      }
    })
  }

  handleAddReferenceCancel = () => {
    const { dispatch, showEditExternalReference } = this.props
    if (showEditExternalReference) {
      dispatch(updateShowEditExternalReference(false))
    } else {
      dispatch(updateShowAddExternalReference(false))
    }
  }

  render() {
    const {
      form,
      showAddExternalReference,
      addExternalRefLoading,
      vendors,
      showEditExternalReference,
      selectedRecordToEdit,
    } = this.props

    const vendorOption = vendors.map(option => (
      <Option
        key={option.id}
        label={option.genericInformation.registeredCompanyName}
        value={option.id}
      >
        {option.genericInformation.registeredCompanyName}
      </Option>
    ))
    return (
      <React.Fragment>
        <Modal
          visible={showAddExternalReference || showEditExternalReference}
          title={
            <div className={styles.modalHeader}>
              <InfoCard
                minHeight="80px"
                imgHeight="100px"
                imgTop="43%"
                header={
                  showEditExternalReference ? 'Edit External References' : 'Add External References'
                }
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
                <div className="col-md-6 col-lg-12">
                  <Form.Item label="Vendor" hasFeedback>
                    {form.getFieldDecorator('issuerEntityId', {
                      initialValue: showEditExternalReference
                        ? selectedRecordToEdit.issuerEntityId
                        : undefined,
                      rules: [{ required: true, message: 'Please select account issuer' }],
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
                        {vendorOption}
                      </Select>,
                    )}
                  </Form.Item>
                </div>

                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Reference" hasFeedback>
                    {form.getFieldDecorator('reference', {
                      initialValue: showEditExternalReference
                        ? selectedRecordToEdit.reference
                        : undefined,
                      rules: [{ required: true, message: 'Please enter reference' }],
                    })(<Input placeholder="Enter reference" />)}
                  </Form.Item>
                </div>
                <div className="col-md-12 col-lg-12">
                  <Form.Item label="Reference Description" hasFeedback>
                    {form.getFieldDecorator('referenceDescription', {
                      initialValue: showEditExternalReference
                        ? selectedRecordToEdit.referenceDescription
                        : undefined,
                      // rules: [{ required: true, message: 'Please enter reference description' }],
                    })(<Input placeholder="Enter reference description" />)}
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className={styles.btnStyles}>
                  <Button
                    className={styles.btnCANCEL}
                    onClick={this.handleAddReferenceCancel}
                    // disabled={payments.length === 0}
                  >
                    Cancel
                  </Button>
                  <Button
                    className={styles.btnSAVE}
                    htmlType="submit"
                    loading={addExternalRefLoading}
                  >
                    {showEditExternalReference ? 'Update' : 'Submit'}
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
