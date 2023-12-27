import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Row,
  Col,
  Checkbox,
  Upload,
  Form,
  Card,
  Button,
  Icon,
  Divider,
  Progress,
  Spin,
  Tooltip,
  Modal,
} from 'antd'
import {
  DownloadOutlined,
  DeleteOutlined,
  WarningOutlined,
  FileExclamationOutlined,
} from '@ant-design/icons'

import DynamicCollapse from 'components/customComponents/Collapse'
import Text from 'components/customComponents/Text'

import DocumentCriteria from './documentCriteria'
import { requiredDocumentsList } from './data.json'

import './style.scss'

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

const mapStateToProps = ({ user, clientManagement }) => ({
  token: user.token,
  loading: clientManagement.loading,
  entityId: clientManagement.entityId,

  loaderDelete: clientManagement.loaderDelete,

  isUploadFileProgressBarEnabled: clientManagement.isUploadFileProgressBarEnabled,
  uploadFilLoader: clientManagement.uploadFilLoader,
  uploadFilePercent: clientManagement.uploadFilePercent,

  selectedDocumentFiles: clientManagement.selectedDocumentFiles,
  selectedDocumentsQuestions: clientManagement.selectedDocumentsQuestions,

  isDocumentsUpdated: clientManagement.isDocumentsUpdated,
  requiredDocumentsList: clientManagement.requiredDocumentsList,
  originFileObj: clientManagement.originFileObj,
  previewURL: clientManagement.previewURL,
})

@connect(mapStateToProps)
@Form.create()
class RiskInformationDocments extends Component {
  state = {
    isCollapseActive: false,
    selectedFile: '',
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  }

  panelTitle = (
    <div className="panel__header">
      <Text size="default">Risk information - Documents</Text>
    </div>
  )

  panelCriteriaTitle = (
    <div className="panel__header">
      <Text size="default">Document Criteria</Text>
    </div>
  )

  panelFlagsTilte = (
    <div className="panel__header">
      <Text size="default">Document Flags</Text>
    </div>
  )

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isPreviewURLFetched) {
      this.previewDocumentImage()
    }
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { previewURL } = this.props
    const isPropsUpdated = {
      isPreviewURLFetched: prevProps.previewURL !== previewURL,
    }
    return isPropsUpdated
  }

  previewDocumentImage = () => {
    const { originFileObj, previewURL } = this.props
    if (!originFileObj.url || !originFileObj.preview) {
      originFileObj.previewURL = previewURL
      this.setState({
        previewImage: originFileObj.previewURL || originFileObj.url,
        previewVisible: true,
        previewTitle:
          originFileObj.name || originFileObj.url.substring(originFileObj.url.lastIndexOf('/') + 1),
      })
    }
  }

  handelUpdateStatusIncorrect = (e, document) => {
    const { dispatch, token } = this.props
    const upateIncorrect = {
      status: 'incorrect',
    }
    const upatePending = {
      status: 'pending',
    }
    if (e.target.checked) {
      dispatch({
        type: 'UPDATE_DOCUMENT_STATUS',
        data: upateIncorrect,
        file: document[0].fileName,
        token,
      })
    } else {
      dispatch({
        type: 'UPDATE_DOCUMENT_STATUS',
        data: upatePending,
        file: document[0].fileName,
        token,
      })
    }
  }

  onSubmitCriteriaForm = () => {
    const { form } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        console.log(values)
      }
    })
  }

  handleBeforeUploadFile = (file = {}, label) => {
    this.setState({ selectedFile: label.name })
    const { dispatch, token, entityId } = this.props
    const isJpgOrPngOrPdfOrZip =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/jpg' ||
      file.type === 'application/pdf' ||
      file.type === 'jpeg' ||
      file.type === 'jpg' ||
      file.type === 'png' ||
      file.type === 'pdf'
    if (isJpgOrPngOrPdfOrZip && file.status !== 'removed') {
      file.documentType = label.name
      dispatch({
        type: 'GET_PRESIGNED_URL',
        entityId,
        file,
        token,
      })
    }
    return false
  }

  getStatusBar = (status, tab) => {
    let returnResp = {}
    switch (status) {
      case 'pending':
        returnResp = {
          status: 'Pending',
          colorCode: 'pendingStatus',
        }
        break
      case 'rejected':
        returnResp = {
          status: 'Rejected',
          colorCode: 'rejectStatus',
        }
        break
      case 'incorrect':
        returnResp = {
          status: 'Incorrect',
          colorCode: 'rejectStatus',
        }
        break
      case 'approved':
        returnResp = {
          status: 'Approved',
          colorCode: 'approvedStatus',
        }
        break
      default:
        returnResp = {
          status: 'Pending',
          colorCode: 'pendingStatus',
        }
        break
    }
    const checkResp = tab === 'status' ? returnResp.status : returnResp.colorCode
    return checkResp
  }

  handleonChangeCollapse = () => {
    // console.log(e)
  }

  handleRemoveTest = () => {
    return false
  }

  handleRemove = file => {
    const fileList = file[0]
    this.setState({ selectedFile: fileList.uid })
    const { entityId, dispatch, token } = this.props
    if (file.status !== 'removed') {
      dispatch({
        type: 'REMOVE_DOCUMENT_FILES',
        payload: {
          fileName: fileList.fileName,
          documentType: fileList.documentType,
          uid: fileList.uid,
        },
        entityId,
        token,
      })
    }
  }

  convertToFile = async data => {
    const response = await fetch(data[0].url)
    const blob = await response.blob()
    return new File([blob], data[0].name, {
      type: data[0].type,
    })
  }

  // handleDownloadDoc = async data => {
  //   // const file1 = data[0]
  //   if (data[0].type === 'pdf') {
  //     const file = await this.convertToFile(data)
  //     const reader = new FileReader()
  //     reader.readAsDataURL(file)
  //     reader.onloadend = () => {
  //       const base64data = reader.result
  //       const link = document.createElement('a')
  //       link.download = data[0].friendlyName.concat('.', data[0].type)
  //       link.href = base64data
  //       document.body.appendChild(link)
  //       link.click()
  //       document.body.removeChild(link)
  //     }
  //   } else {
  //     const link = document.createElement('a')
  //     window.open(data[0].url, '_blank')
  //     link.download = data[0].friendlyName.concat('.', data[0].type)
  //     link.href = data[0].url
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)

  //     // const link = document.createElement('a')
  //     // window.open(data[0].url, '_blank')
  //     // link.download = file1.name
  //     // link.href = file1.url
  //     // // window.open(file1.url, '_blank')

  //     // document.body.appendChild(link)
  //     // link.click()
  //     // document.body.removeChild(link)
  //   }
  // }

  handleDownloadDoc = file => {
    // const link = document.createElement('a')
    // link.download = file[0].friendlyName.concat('.', file[0].type)
    // link.href = file[0].url
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
    const isDownloadable = true
    const { dispatch, token, entityId } = this.props
    dispatch({
      type: 'GET_PRESIGNED_URL_DOWNLOAD',
      entityId,
      file,
      token,
      isDownloadable,
    })
  }

  handleBeforeUpload = () => {
    return false
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    const isDownloadable = false
    const { dispatch, token, entityId } = this.props
    dispatch({
      type: 'GET_PRESIGNED_URL_PREVIEW',
      entityId,
      file,
      isDownloadable,
      token,
    })
  }

  panelContent = () => {
    const { selectedFile, previewImage, previewVisible, previewTitle } = this.state
    const {
      dispatch,
      token,
      isUploadFileProgressBarEnabled,
      uploadFilLoader,
      uploadFilePercent,
      selectedDocumentFiles,
      form,
      loading,
      loaderDelete,
      originFileObj,
    } = this.props
    return requiredDocumentsList.map(item => {
      const document = selectedDocumentFiles.filter(
        data => data.documentType !== undefined && data?.documentType === item?.name,
      )
      return (
        <div key={item.name} className="panelDiv">
          <Spin spinning={uploadFilLoader}>
            <Row>
              <Col lg={{ span: 12 }}>
                <div>
                  <p className="panelHeadTitle">{item?.label}</p>
                </div>
              </Col>
              <Col lg={{ span: 12 }}>
                <div>
                  <p
                    className={this.getStatusBar(
                      document?.length > 0 && document[0]?.status,
                      'tab',
                    )}
                  >
                    {this.getStatusBar(document?.length > 0 && document[0]?.status, 'status')}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col style={{ marginTop: '10px' }} lg={{ span: 8 }}>
                <div className="cc_custom-upload">
                  <Upload
                    beforeUpload={info => this.handleBeforeUploadFile(info, item)}
                    // onChange={info => selectedDocument.document === document[0].document && this.handleUploadFile(info, item)}
                  >
                    <Tooltip title={item?.toolTip}>
                      <Button
                        disabled={isUploadFileProgressBarEnabled}
                        block
                        style={{ padding: '14px', marginBottom: '25px' }}
                      >
                        <div style={{ marginTop: '-9px' }}>
                          <Icon type="upload" /> Upload
                        </div>
                      </Button>
                    </Tooltip>
                  </Upload>

                  {isUploadFileProgressBarEnabled && selectedFile === item?.name && (
                    <div className="ml-4 mt-1">
                      <Progress
                        style={{ width: 210 }}
                        percent={uploadFilePercent}
                        size="small"
                        status="active"
                      />
                    </div>
                  )}
                </div>
                {document?.length > 0 ? (
                  document.map(fileItem => {
                    return (
                      <Card
                        key={fileItem?.uid}
                        style={{ borderRadius: '3px', marginBottom: '13px' }}
                      >
                        <Row>
                          <Col lg={{ span: 20 }}>
                            <div className="cc_custom_upload">
                              <Upload
                                name="file"
                                listType="picture"
                                defaultFileList={[fileItem]}
                                beforeUpload={this.handleBeforeUploadFile}
                                onPreview={info => this.handlePreview(info)}
                                onDownload={info => this.handleDownload(info)}
                              />
                            </div>
                          </Col>
                          <Col lg={{ span: 4 }}>
                            {!loaderDelete && (
                              <div style={{ marginTop: '22px' }}>
                                <DownloadOutlined
                                  style={{ marginTop: '-10px', fontSize: '15px' }}
                                  onClick={() => this.handleDownloadDoc([fileItem])}
                                />
                                <DeleteOutlined
                                  style={{
                                    marginTop: '-10px',
                                    marginLeft: '11px',
                                    fontSize: '14px',
                                  }}
                                  onClick={() => this.handleRemove([fileItem])}
                                />
                              </div>
                            )}
                            {loaderDelete && selectedFile === fileItem?.uid && (
                              <div className="mt-4">
                                {<Spin indicator={antIcon} spinning={loaderDelete} />}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Card>
                    )
                  })
                ) : (
                  <Card className="noFileWrapper">
                    <Row>
                      <Col lg={{ span: 1 }}>
                        <FileExclamationOutlined />
                      </Col>
                      <Col lg={{ span: 21 }}>
                        <span className="noFileText">No files uploaded</span>
                      </Col>
                      <Col lg={{ span: 2 }}>
                        <WarningOutlined className="warningIcon" />
                      </Col>
                    </Row>
                  </Card>
                )}
                {originFileObj?.type !== 'pdf' && (
                  <Modal
                    width={900}
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                  >
                    {previewImage && (
                      <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
                    )}
                  </Modal>
                )}
                <div style={{ marginTop: '15px' }}>
                  <Checkbox
                    checked={
                      document !== undefined &&
                      document?.length === 1 &&
                      document[0]?.status !== undefined &&
                      document[0]?.status === 'incorrect'
                    }
                    disabled={!document?.length > 0}
                    onChange={e => this.handelUpdateStatusIncorrect(e, document)}
                  >
                    Document incorrect
                  </Checkbox>
                </div>
              </Col>
              <Col lg={{ span: 1 }} />
              <Col lg={{ span: 15 }}>
                <div>
                  <div className="panelCriteria">
                    <DynamicCollapse
                      panelHeadTitle={this.panelCriteriaTitle}
                      panelData={
                        <DocumentCriteria
                          dispatch={dispatch}
                          token={token}
                          documentType={item.key}
                          file={document}
                          formProps={form}
                          loading={loading}
                          isDocumentExists={document?.length > 0}
                        />
                      }
                      handleonChangeCollapse={this.handleonChangeCollapse()}
                    />
                  </div>
                  <div className="panelCriteria">
                    <DynamicCollapse
                      panelHeadTitle={this.panelFlagsTilte}
                      handleonChangeCollapse={this.handleonChangeCollapse()}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Divider style={{ marginTop: '60px', marginBottom: '-10px' }} />
          </Spin>
        </div>
      )
    })
  }

  render() {
    const { isCollapseActive } = this.state
    return (
      <React.Fragment>
        <div
          className={
            isCollapseActive ? 'collapse__block__active mt-2' : 'collapse__block_inactive mt-2'
          }
        >
          <DynamicCollapse
            panelHeadTitle={this.panelTitle}
            panelData={this.panelContent()}
            handleonChangeCollapse={this.handleonChangeCollapse()}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default RiskInformationDocments
