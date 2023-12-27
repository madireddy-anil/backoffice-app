import React, { Component } from 'react'
import { Row, Col, Button, Form, Input, Select, Checkbox, Spin, Modal } from 'antd'

import './style.scss'

let id = 0

const { Option } = Select

const selectOptions = [
  {
    id: 1,
    label: 'Entities name listed',
    name: 'entitiesName',
    value: 'entitiesName',
  },
]

@Form.create()
class DynamicForm extends Component {
  emailValidation = fieldName => {
    return {
      type: fieldName,
      message: 'Email is not valid!',
    }
  }

  mobilePhoneValidation = () => {
    return {
      pattern: new RegExp('^[0-9]*$'),
      message: 'Phone number is not valid!',
    }
  }

  passwordValidation = () => {
    const msg = (
      <div style={{ fontSize: '13px' }}>
        Password must be min 8 and max 16 Characters <br />
        long with one uppercase, one lowercase, one <br />
        numeric digit and one special character
      </div>
    )
    return {
      pattern: new RegExp('^^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$'),
      message: msg,
    }
  }

  inputTag = item => {
    const { formProps } = this.props
    return (
      <Form.Item label={item.label} key={item.id} className="formInputItem" hidden={item.hidden}>
        {formProps.getFieldDecorator(item.fieldName, {
          initialValue: item.initialValue,
          rules: [
            {
              required: true,
              message: `Please complete this required field!`,
            },
            item.fieldName === 'email' && this.emailValidation(item.fieldName),
            item.fieldName === 'mobilePhone' && this.mobilePhoneValidation(),
            item.fieldName === 'password' && this.passwordValidation(),
          ],
        })(
          <Input
            size="large"
            autoComplete="off"
            disabled={item.isDisabled}
            type={item.fieldName === 'password' ? item.fieldName : ''}
            placeholder={item.placeholder}
            style={{ width: '100%', fontSize: '14px', color: '#888A9D' }}
            prefix={item.prefix}
          />,
        )}
      </Form.Item>
    )
  }

  selectTag = item => {
    const { formProps } = this.props
    return (
      <Form.Item key={item.id} label={item.label} className="formInputItem" hidden={item.hidden}>
        {formProps.getFieldDecorator(item.fieldName, {
          initialValue: item.initialValue,
          rules: [
            {
              required: true,
              message: `Please complete this required field!`,
            },
          ],
        })(
          <Select
            // className="cstmSelectInput"
            style={{ width: '100%' }}
            bordered={false}
            mode={item.mode}
            onChange={item.selectOnChange}
            showSearch
            size="large"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.label !== undefined &&
              option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {item.data !== undefined &&
              item.data.map(option => {
                return (
                  <Option key={option || option.id} value={option.value} label={option.label}>
                    <span style={{ fontSize: '14px', color: '#888A9D' }}>{option.label}</span>
                  </Option>
                )
              })}
          </Select>,
        )}
      </Form.Item>
    )
  }

  checkBoxTag = item => {
    const { formProps, loading, onChangeDocumentCriteria, checked } = this.props
    const data = selectOptions.find(datas => datas.value === item.value)
    return (
      <div>
        <Form.Item key={item.id}>
          {formProps.getFieldDecorator(item.name, {
            initialValue: data !== undefined && data.value ? checked : false,
            valuePropName: 'checked',
          })(
            <Checkbox disabled={loading && item.disabled} onChange={onChangeDocumentCriteria}>
              {item.label}
            </Checkbox>,
          )}
        </Form.Item>
      </div>
    )
  }

  remove = (k, name) => {
    const { formProps } = this.props
    const keys = formProps.getFieldValue(name)
    if (keys.length === 1) {
      return
    }
    const nextKeys = keys.filter(key => key !== k)
    formProps.setFieldsValue({
      [name]: nextKeys,
    })
  }

  add = name => {
    const { formProps } = this.props
    const keys = formProps.getFieldValue(name)
    const nextKeys = keys.concat((id += 1))
    formProps.setFieldsValue({
      [name]: nextKeys,
    })
  }

  formList = item => {
    const { formProps } = this.props
    formProps.getFieldDecorator(`${item.name}List`, {
      initialValue: item.initialKey !== undefined && [...item.initialKey.keys()],
    })
    const data = formProps.getFieldValue(`${item.name}List`)

    if (formProps.getFieldValue(`${item.name}List`).length === item.initialKey.length) {
      id = formProps.getFieldValue(`${item.name}List`).length - 1
    }

    const formtest = data.map(k => (
      <Form.Item label={item.label} required={false} key={k} className="formInputItem">
        {formProps.getFieldDecorator(`${item.name}[${k}]`, {
          initialValue: k + 1 <= item.initialKey.length ? `${item.initialKey[k]}` : ' ',
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: `Please input ${item.name}`,
            },
          ],
        })(<Input placeholder={item.placeholder} style={{ width: '100%' }} />)}
        {data.length > 1 ? (
          <span
            className="removeIcon"
            onClick={() => this.remove(k, `${item.name}List`)}
            onKeyDown={() => console.log('test')}
            role="button"
            tabIndex="0"
          >
            <img
              src="resources/images/deleteVector.png"
              alt="deleteVector"
              style={{ width: '95%' }}
            />
          </span>
        ) : null}
      </Form.Item>
    ))

    return (
      item.btnLabel && (
        <div>
          {formtest}
          <Form.Item>
            <Button onClick={() => this.add(`${item.name}List`)} className="addIcon">
              + {item.btnLabel}
            </Button>
          </Form.Item>
        </div>
      )
    )
  }

  defaultValidation = name => ({
    validateTrigger: ['onChange', 'onBlur'],
    rules: [
      {
        required: true,
        whitespace: true,
        message: `Please input ${name}.`,
      },
    ],
  })

  getFields = (item, inputType) => {
    let returnResp
    switch (inputType) {
      case 'input':
        returnResp = this.inputTag(item)
        break
      case 'checkBox':
        returnResp = this.checkBoxTag(item)
        break
      case 'select':
        returnResp = this.selectTag(item)
        break
      case 'formlist':
        returnResp = this.formList(item)
        break
      default:
        break
    }
    return returnResp
  }

  render() {
    const {
      loader,
      mainLoader,
      modalView,
      handleClosePopup,
      modalType,
      modalDescription,
      onSubmitForm,
      viewForm,
      formData,
      handelCancel,
      cancelLabelBtn,
      saveLabelBtn,
    } = this.props
    return (
      <Row>
        <Col>
          <Spin spinning={mainLoader}>
            <Modal
              modalView={modalView}
              handleClosePopup={handleClosePopup}
              modalType={modalType}
              modalDescription={modalDescription}
            />
            {viewForm && (
              <Form layout="vertical" hideRequiredMark onSubmit={onSubmitForm}>
                <div className="row">
                  {formData.map(item => {
                    return (
                      <div key={item.id && item.id} className="col-12">
                        {this.getFields(item, item.inputType)}
                      </div>
                    )
                  })}
                </div>
                <Row>
                  <Col span={24} style={{ textAlign: 'right', marginTop: '20px' }}>
                    <Button
                      shape="round"
                      style={{ marginRight: '5px' }}
                      onClick={() => handelCancel()}
                    >
                      <span className="btnCancel">
                        {!cancelLabelBtn ? 'Cancel' : cancelLabelBtn}
                      </span>
                    </Button>
                    <Button
                      loading={loader}
                      shape="round"
                      className="cc-btn-save"
                      htmlType="submit"
                    >
                      <span className="btnSubmit">
                        {!saveLabelBtn ? 'Save Changes' : saveLabelBtn}
                      </span>
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </Spin>
        </Col>
      </Row>
    )
  }
}

export default DynamicForm
