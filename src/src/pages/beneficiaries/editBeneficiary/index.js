import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Form, Input, Button, Checkbox, Select } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import Text from 'components/CleanUIComponents/Text'
import styles from './style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, general, digitalPayment }) => ({
  token: user.token,
  currencies: general.currencies,
  countries: general.countries,
  beneficiaryData: digitalPayment.newPayment.beneficiaryData,

  beneFieldsList: digitalPayment.beneFieldsList,
})

// @Form.create()
@connect(mapStateToProps)
class EditBeneficiary extends Component {
  state = {
    checked: undefined,
  }

  componentDidMount() {
    const { beneficiaryData } = this.props
    this.setState({
      checked: beneficiaryData.isSaved,
    })
  }

  onChange = e => {
    this.setState({
      checked: e.target.checked,
    })
  }

  onChangeCountrySelected = (value, name) => {
    const { formProps } = this.props
    formProps.setFieldsValue({ [name]: value })
  }

  render() {
    const {
      formProps,
      onSubmitAccount,
      beneficiaryData,
      handleCancel,
      editData,
      columnStyle,
      countries,
    } = this.props
    const { checked } = this.state
    const countriesOptions = countries.map(option => (
      <Option key={option.id} label={option.name} value={option.alpha2Code}>
        <div>
          <span>{option.name}</span>
        </div>
      </Option>
    ))
    return (
      <Card
        title="Edit Beneficiary"
        bordered={false}
        headStyle={{
          border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        bodyStyle={{
          border: '1px solid #a8c6fa',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
        }}
        className={styles.mainCard}
      >
        {/* <Form onSubmit={onSubmitAccount}> */}
        <div className="row">
          {editData.map(item => {
            return (
              <div key={item.schemaName} className={columnStyle}>
                {item.type === 'input' ? (
                  <Form.Item label={item.labelName} className={styles.formBlock}>
                    {formProps.getFieldDecorator(item.schemaName, {
                      initialValue: item.value,
                      rules: [
                        {
                          required: item.required,
                          message: `Please enter ${item.labelName}`,
                        },
                        {
                          pattern: new RegExp(item.regex),
                          message: item.message ? item.message : '',
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>
                ) : (
                  ''
                )}
                {item.type === 'select' && item.schemaName === 'country' ? (
                  <Form.Item label={item.labelName} className={styles.formBlock}>
                    {formProps.getFieldDecorator(item.schemaName, {
                      initialValue: item.value,
                      rules: [
                        {
                          required: item.isRequired,
                          message: `Please enter ${item.labelName}`,
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        style={{ width: '100%' }}
                        optionFilterProp="label"
                        optionLabelProp="label"
                        placeholder="select country"
                        onChange={value => this.onChangeCountrySelected(value, item.schemaName)}
                      >
                        {countriesOptions}
                      </Select>,
                    )}
                  </Form.Item>
                ) : (
                  ''
                )}
              </div>
            )
          })}
        </div>

        <div className="row">
          <div className="col-10">
            <Form.Item>
              {formProps.getFieldDecorator('isSaved', {
                initialValue: beneficiaryData.isSaved,
                // rules: [
                //   {
                //     required: true,
                //     message: `Please enter State/ Province`,
                //   },
                // ],
              })(
                <Checkbox className={styles.checkboxBtn} checked={checked} onChange={this.onChange}>
                  Save this beneficiary in my beneficiaries list for future use
                </Checkbox>,
              )}
            </Form.Item>
          </div>
        </div>

        <div className={styles.flexSpaceBetween}>
          <div>
            <Spacer height="10px" />
            <Button className={styles.btnCANCEL} onClick={handleCancel}>
              Cancel
            </Button>
          </div>
          <div>
            <Spacer height="10px" />
            <Button
              className={styles.btnNext}
              htmlType="submit"
              onClick={e => onSubmitAccount(e, formProps)}
            >
              Update
            </Button>
          </div>
        </div>
        {/* </Form> */}
      </Card>
    )
  }
}

export default EditBeneficiary
