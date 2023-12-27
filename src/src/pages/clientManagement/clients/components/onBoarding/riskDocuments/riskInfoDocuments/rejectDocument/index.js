import React, { Component } from 'react'
import { Row, Col, Checkbox, Button, Input, Form } from 'antd'

import jsondata from '../data.json'

const selectedOptions = [
  {
    id: '11',
    label: 'Entities name listed',
    name: 'entitiesNamecertificateOfIncorporation',
    value: 'entitiesName',
    inputType: 'checkBox',
    documentType: 'certificateOfIncorporation',
  },
]

@Form.create()
class RejectDocument extends Component {
  state = {
    checked: true,
  }

  handleChangeRejectForm = data => {
    const isOtherReasonSelected = data.target.value
    if (isOtherReasonSelected === 'otherReasons') {
      this.setState({ [isOtherReasonSelected]: data.target.checked })
    }
  }

  onSubmitRejectForm = () => {
    const { dispatch, form, file, token } = this.props
    const upateDetails = {
      status: 'rejected',
    }
    form.validateFields((error, values) => {
      if (!error) {
        console.log('onSubmitCriteriaForm', values)
        dispatch({
          type: 'UPDATE_DOCUMENT_STATUS',
          data: upateDetails,
          file: file[0].name,
          token,
        })
      }
    })
  }

  render() {
    const { formProps, documentType, loading, handleCloseModal } = this.props
    const { checked, otherReasons } = this.state
    const { rejectDocument } = jsondata
    const formData = rejectDocument.filter(
      data => data.documentType === (documentType !== undefined && documentType),
    )
    return (
      <React.Fragment>
        <div className="panel__content">
          <div className="panelCriteria">
            <Form onSubmit={() => this.onSubmitRejectForm()}>
              {formData.map(item => {
                const data = selectedOptions.find(datas => datas.value === item.value)
                return (
                  <Form.Item key={item.id} hidden>
                    {formProps.getFieldDecorator(item.name, {
                      initialValue: data !== undefined && data.value ? checked : false,
                      valuePropName: 'checked',
                    })(
                      <Checkbox
                        value={item.value}
                        disabled={loading && item.disabled}
                        onChange={this.handleChangeRejectForm}
                      >
                        {item.label}
                      </Checkbox>,
                    )}
                  </Form.Item>
                )
              })}
              {otherReasons && (
                <Form.Item className="formTextAreaItem" label="Advice to Merchant">
                  {formProps.getFieldDecorator('adviceToMerchant', {
                    initialValue: '',
                    valuePropName: 'checked',
                    rules: [
                      {
                        required: true,
                        message: `Please enter the required field`,
                      },
                    ],
                  })(
                    <Input.TextArea
                      size="default"
                      autoComplete="off"
                      placeholder="Enter Advice here"
                    />,
                  )}
                </Form.Item>
              )}
              <Row>
                <Col span={24} style={{ textAlign: 'right', marginTop: '20px' }}>
                  <Button shape="round" style={{ marginRight: '5px' }} onClick={handleCloseModal}>
                    <span className="btnCancel">Cancel</span>
                  </Button>
                  <Button loading={loading} shape="round" className="cc-btn-save" htmlType="submit">
                    <span className="btnSubmit">Reject With Reason</span>
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default RejectDocument
