import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Checkbox } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import Text from 'components/CleanUIComponents/Text'
import styles from './style.module.scss'

@Form.create()
@connect(({ user }) => ({
  role: user.role,
  merchants: user.merchants,
}))
class AddBeneficiaryForm extends React.Component {
  render() {
    const {
      formProps,
      title,
      formFields,
      columnStyle,
      confirmBtnLoading,
      handleNext,
      viewCheckBox,
      ischecked,
      onSubmitAddBeneficiary,
      inputTyping,
      isNextClicked,
      btnTitle,
      btnCancel,
      handleCancel,
    } = this.props
    return (
      <Form onSubmit={onSubmitAddBeneficiary}>
        <p className={styles.beneTitle}>{title}</p>
        <div className="row">
          {formFields.map(item => {
            return (
              <div key={item.schemaName} className={columnStyle}>
                <strong className="font-size-15">{item.fieldName}</strong>
                <Spacer height="14px" />
                <Form.Item>
                  {formProps.getFieldDecorator(item.schemaName, {
                    initialValue: '',
                    rules: [
                      {
                        required: item.required,
                        message: `Please enter ${item.fieldName}`,
                      },
                    ],
                  })(
                    <Input
                      style={{ width: '100%' }}
                      size="large"
                      className={styles.inputbox}
                      onChange={e => inputTyping(e, item.schemaName, title)}
                    />,
                  )}
                </Form.Item>
              </div>
            )
          })}
        </div>
        {viewCheckBox ? (
          <Checkbox onChange={ischecked}>
            <strong className="font-size-15">Intermediary bank Details</strong>
            <Spacer height="10px" />
          </Checkbox>
        ) : (
          ''
        )}
        <Spacer height="3px" />
        {isNextClicked && btnTitle === 'NEXT' ? (
          <div>
            <Spacer height="10px" />
            <Button className={styles.btnNext} onClick={handleNext}>
              {btnTitle}
            </Button>
          </div>
        ) : (
          ''
        )}
        {btnTitle === 'CREATE' && btnCancel === 'CANCEL' ? (
          <div className={styles.flexSpaceBetween}>
            <div>
              <Spacer height="10px" />
              <Button className={styles.btnCANCEL} onClick={handleCancel}>
                {btnCancel}
              </Button>
            </div>
            <div>
              <Spacer height="10px" />
              <Button className={styles.btnNext} htmlType="submit" loading={confirmBtnLoading}>
                {btnTitle}
              </Button>
            </div>
          </div>
        ) : (
          ''
        )}
      </Form>
    )
  }
}

export default AddBeneficiaryForm
