import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Checkbox, Button, Form, Spin } from 'antd'
import Modal from 'components/customComponents/Modal'
import RejectDocument from '../rejectDocument'

import jsondata from '../data.json'

const selectedOptions = [
  {
    id: '13',
    label: 'Incorporation number is listed',
    name: 'incorporationNumbercertificateOfIncorporation',
    value: 'incorporationNumber',
    inputType: 'checkBox',
    documentType: 'certificateOfIncorporation',
  },
]

const mapStateToProps = ({ clientManagement }) => ({
  isDocumentsUpdated: clientManagement.isDocumentsUpdated,
})

@connect(mapStateToProps)
@Form.create()
class DocumentCriteria extends Component {
  state = {
    checked: true,
    viewModal: false,
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isClientFetched) {
      this.getClientManagementList()
    }
  }

  getClientManagementList = () => {
    this.setState({ viewModal: false })
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isDocumentsUpdated } = this.props
    const isPropsUpdated = {
      isClientFetched: prevProps.isDocumentsUpdated !== isDocumentsUpdated,
    }
    return isPropsUpdated
  }

  handleShowModal = () => {
    this.setState({
      viewModal: true,
    })
  }

  handleCloseModal = () => {
    this.setState({
      viewModal: false,
    })
  }

  onSubmitCriteriaForm = () => {
    const { dispatch, form, file, token } = this.props
    const upateDetails = {
      status: 'approved',
    }
    form.validateFields((error, values) => {
      if (!error) {
        console.log('onSubmitCriteriaForm', values)
        dispatch({
          type: 'UPDATE_DOCUMENT_STATUS',
          data: upateDetails,
          file: file[0].fileName,
          token,
        })
      }
    })
  }

  rejectDocument = () => {
    const { dispatch, file, token } = this.props
    const upateDetails = {
      status: 'rejected',
    }
    dispatch({
      type: 'UPDATE_DOCUMENT_STATUS',
      data: upateDetails,
      file: file[0].fileName,
      token,
    })
  }

  render() {
    const { formProps, dispatch, isDocumentExists, file, loading, token, documentType } = this.props
    const { checked, viewModal } = this.state
    const { documentCriteria } = jsondata
    const formData = (documentCriteria || []).filter(
      data =>
        data.documentType ===
        (documentType !== undefined && documentType !== undefined && documentType),
    )
    return (
      <React.Fragment>
        <Spin spinning={loading}>
          <Modal
            modalType="Reject document"
            modalView={viewModal}
            modalWidth={600}
            modalDescription={
              <RejectDocument
                dispatch={dispatch}
                token={token}
                file={file}
                documentType={documentType}
                formProps={formProps}
                loading={loading}
                handleCloseModal={() => this.handleCloseModal()}
              />
            }
            className="rejectDocModule"
          />
          <div className="panel__content">
            <div className="panelCriteria">
              <Form onSubmit={() => this.onSubmitCriteriaForm()}>
                <div>
                  {formData.map(item => {
                    const data = selectedOptions.find(datas => datas.value === item.value)
                    return (
                      <Form.Item key={item.id} hidden>
                        {formProps.getFieldDecorator(item.name, {
                          initialValue: data !== undefined && data.value ? checked : false,
                          valuePropName: 'checked',
                        })(
                          <Checkbox value={item.value} disabled={loading && item.disabled}>
                            {item.label}
                          </Checkbox>,
                        )}
                      </Form.Item>
                    )
                  })}
                </div>
                <Row>
                  <Col span={24} style={{ textAlign: 'right', marginTop: '20px' }}>
                    <Button
                      shape="round"
                      icon="close"
                      disabled={!isDocumentExists}
                      style={{ marginRight: '5px' }}
                      // onClick={() => this.handleShowModal()}
                      onClick={this.rejectDocument}
                    >
                      <span className="btnCancel">Reject Document</span>
                    </Button>
                    <Button
                      disabled={!isDocumentExists}
                      icon="check"
                      shape="round"
                      className="cc-btn-save"
                      htmlType="submit"
                    >
                      <span className="btnSubmit">Approve Document</span>
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Spin>
      </React.Fragment>
    )
  }
}

export default DocumentCriteria
