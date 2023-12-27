import React from 'react'
import { Form, Input, Button, Modal } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import Text from 'components/CleanUIComponents/Text'
import styles from './style.module.scss'

const { confirm } = Modal

@Form.create()
class EditBeneficiaryForm extends React.Component {
  render() {
    const {
      formProps,
      title,
      formFields,
      columnStyle,
      btnTitle,
      confirmBtnLoading,
      onSubmitAddBeneficiary,
      viewButton,
      inputTyping,
    } = this.props

    this.onPopUpMessage = e => {
      e.preventDefault()
      confirm({
        title: 'Are you sure Update?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          onSubmitAddBeneficiary(e)
        },
        onCancel() {},
      })
    }

    return (
      <div>
        {formFields !== undefined && formFields.length > 0 ? (
          <Form onSubmit={this.onPopUpMessage}>
            <p className={styles.beneTitle}>{title}</p>
            <div className="row">
              {formFields.map(item => {
                return (
                  <div key={item.schemaName} className={columnStyle}>
                    <strong className="font-size-15">{item.fieldName}</strong>
                    <Spacer height="14px" />
                    <Form.Item>
                      {formProps.getFieldDecorator(item.schemaName, {
                        initialValue: item.value,
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
                          disabled={item.isEnable}
                          className={styles.inputbox}
                          onChange={e => inputTyping(e, item.schemaName, title)}
                        />,
                      )}
                    </Form.Item>
                  </div>
                )
              })}
            </div>
            <Spacer height="6px" />
            {btnTitle === 'UPDATE' && !viewButton ? (
              <div>
                <Spacer height="10px" />
                <Button className={styles.btnNext} htmlType="submit" loading={confirmBtnLoading}>
                  {btnTitle}
                </Button>
              </div>
            ) : (
              ''
            )}
          </Form>
        ) : (
          ''
        )}
      </div>
    )
  }
}

export default EditBeneficiaryForm
