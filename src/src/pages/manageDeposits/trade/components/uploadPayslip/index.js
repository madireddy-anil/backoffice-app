import React, { Component } from 'react'
import { Row, Col, Upload, Button, List, Icon, Modal, message, Spin, Card, Popconfirm } from 'antd'
import _ from 'lodash'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { createPaySlip, getPresignedUrl } from 'redux/upload/actions'
import { deleteDepositSlip } from 'redux/trade/actions'
import {
  deleteRemittanceSlipAccountsOnly,
  deleteRemittanceSlipSwap,
  deleteRemittanceSlipFX,
} from 'redux/transactions/actions'

import styles from './style.module.scss'

const mapStateToProps = ({ user, trade, upload, settings, transactions }) => ({
  token: user.token,
  isEditMode: trade.isEditMode,
  tradeId: trade.tradeId,
  timeZone: settings.timeZone.value,
  deletionLoadingTrade: trade.deletionLoadingTrade,
  deletionLoadingTransactions: transactions.deletionLoadingTransactions,
  upload,
})

@connect(mapStateToProps)
class UploadPayslip extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    uploading: false,
    loading: false,
    error: false,
    downloadOrPreviewType: '',
    downloadOrPreviewFile: {},
    selectedFiles: [],
  }

  componentDidMount() {
    this.setState({ downloadOrPreviewType: '' })
  }

  componentDidUpdate(prevProps) {
    const { upload } = this.props
    const { preSignedURL } = upload
    const { downloadOrPreviewType, downloadOrPreviewFile } = this.state

    if (prevProps.upload.preSignedURL !== preSignedURL && preSignedURL !== '') {
      if (downloadOrPreviewType === 'download') {
        const a = document.createElement('a')
        a.href = preSignedURL
        a.download = downloadOrPreviewFile.name || 'download'
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      if (downloadOrPreviewType === 'preview') {
        this.setImagePreview()
      }
    }
  }

  setImagePreview = () => {
    const {
      upload: { preSignedURL },
    } = this.props
    const { downloadOrPreviewFile } = this.state
    if (preSignedURL) {
      this.setState({
        previewImage: preSignedURL,
        previewVisible: true,
        previewTitle: downloadOrPreviewFile.name || 'download',
      })
    }
  }

  handleUpload = () => {
    const { fileList } = this.state

    const {
      tradeOrTranId,
      clientOrVendorName,
      category,
      dispatch,
      progressLogs,
      timeZone,
      token,
    } = this.props

    fileList.map(file => {
      if (file.status === 'new' || file.status === 'error') {
        file.status = 'uploading'
      }
      return file
    })

    this.setState({
      uploading: true,
    })

    const payload = {
      fileList,
      tradeOrTranId,
      clientOrVendorName,
      documentType: 'Payslips',
      category,
      progressLogs,
      timeZone,
    }

    Promise.resolve(dispatch(createPaySlip(payload, token))).then(() => {
      this.setState({
        uploading: false,
        fileList: [],
      })
    })
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handleChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({ loading: true })
    }
    if (file.status === 'done') {
      this.getBase64(file.originFileObj, imageUrl =>
        this.setState({
          previewImage: imageUrl,
          loading: false,
        }),
      )
    }

    this.setState({ fileList })
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj, imageUrl => {
        this.setState({
          previewImage: imageUrl,
          loading: false,
        })
      })
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }

  getImagePreSignedUrl = (files, type) => {
    const { clientOrVendorName, dispatch, token } = this.props
    const payload = {
      files,
      clientOrVendorName,
      documentType: 'Payslips',
    }
    Promise.resolve(dispatch(getPresignedUrl(payload, token))).then(() => {
      this.setState({
        downloadOrPreviewType: type,
        downloadOrPreviewFile: files.length === 1 ? files[0] : '',
      })
    })
  }

  deleteSelected = async item => {
    const { dispatch, token, categoryType } = this.props
    switch (categoryType) {
      case 'Deposit Slip':
        dispatch(deleteDepositSlip(item.id, token))
        break
      case 'IsAccountOnly':
        dispatch(deleteRemittanceSlipAccountsOnly(item.id, token))
        break
      case 'Swap':
        dispatch(deleteRemittanceSlipSwap(item.id, token))
        break
      case 'Fx':
        dispatch(deleteRemittanceSlipFX(item.id, token))
        break
      default:
        break
    }
  }

  actionsForSlips = (slip, uploadView) => {
    const defaultActions = [
      <Icon
        onClick={() =>
          slip.fileStatus === 'uploaded' ? this.getImagePreSignedUrl([slip], 'preview') : ''
        }
        type="eye"
        style={{ color: slip.fileStatus === 'uploaded' ? '#008000' : '' }}
      />,
      <Icon
        onClick={() =>
          slip.fileStatus === 'uploaded' ? this.getImagePreSignedUrl([slip], 'download') : ''
        }
        type="download"
        style={{ color: slip.fileStatus === 'uploaded' ? '#3d8af7' : '' }}
      />,
      <Popconfirm
        title="Sure to delete?"
        onConfirm={() => {
          this.deleteSelected(slip)
        }}
      >
        <Icon type="delete" style={{ color: '#ff5d55' }} />
      </Popconfirm>,
    ]

    const actions = []

    const flag =
      slip.fileType === 'application/pdf' ||
      slip.fileType === 'application/zip' ||
      slip.fileType === 'application/x-zip-compressed'

    if (!flag) {
      actions.push(defaultActions[0])
      actions.push(defaultActions[1])
    } else {
      actions.push(defaultActions[1])
    }

    if (uploadView.canDelete) {
      actions.push(defaultActions[2])
    }

    return actions
  }

  onChangeCheckbox = (e, file) => {
    const { selectedFiles } = this.state
    if (e.target.checked) {
      this.setState(prevState => ({ selectedFiles: [...prevState.selectedFiles, file] }))
    } else if (selectedFiles.length > 0) {
      const updatedFiles = selectedFiles.filter(el => el.id !== file.id)
      this.setState({ selectedFiles: updatedFiles })
    }
  }

  onBulkDownloadFiles = () => {
    const { showPaySlips } = this.props
    const uploadedPaySlips = _.filter(showPaySlips, ['fileStatus', 'uploaded'])

    this.getImagePreSignedUrl(uploadedPaySlips, 'download')
  }

  render() {
    const {
      previewVisible,
      previewImage,
      fileList,
      previewTitle,
      loading,
      uploading,
      error,
    } = this.state

    const { showPaySlips, uploadView, title } = this.props
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    )

    const uploadProps = {
      listType: 'picture-card',
      multiple: true,
      onRemove: file => {
        if (file.status === 'error') {
          const errorFiles = fileList.filter(el => el.status === file.status)
          if (errorFiles.length === 1) {
            this.setState({ error: false })
          }
        }
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: file => {
        const isJpgOrPngOrPdfOrZip =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpg' ||
          file.type === 'application/pdf' ||
          file.type === 'application/zip' ||
          file.type === 'application/x-zip-compressed'

        if (!isJpgOrPngOrPdfOrZip) {
          message.error('You can only upload JPG/PNG/PDF/ZIP file!')
          this.setState({ error: true })
          file.status = 'error'
        }
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          message.error('Image must smaller than 50MB!')
          this.setState({ error: true })
          file.status = 'error'
        }

        file.status = file.status === 'error' ? 'error' : 'new'
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }))

        return false
      },
      onChange: this.handleChange,
      onPreview: this.handlePreview,
      fileList,
    }

    const { deletionLoadingTrade, deletionLoadingTransactions } = this.props

    return (
      <Row className="mt-4">
        <div style={{ display: uploadView.canUpload ? '' : 'none' }}>
          <Col xs={{ span: 24 }} lg={{ span: 24 }}>
            <div>
              <h6>
                <strong>Upload New {title}:</strong>
              </h6>
              <div className="clearfix">
                <Upload {...uploadProps}>{uploadButton}</Upload>
                <Modal
                  visible={previewVisible}
                  title={previewTitle}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
                <Button
                  type="primary"
                  onClick={this.handleUpload}
                  disabled={fileList.length === 0 || error}
                  loading={uploading}
                  style={{ marginTop: 16 }}
                >
                  {uploading ? 'Uploading' : 'Start Upload'}
                </Button>
              </div>
            </div>
          </Col>
        </div>
        <Spin
          spinning={deletionLoadingTrade || deletionLoadingTransactions}
          tip="Deleting In Progress"
        >
          <div style={{ display: uploadView.viewUploadList ? '' : 'none' }}>
            <Col className="mt-4" xs={{ span: 24 }} lg={{ span: 24 }}>
              <Card
                className={styles.cardStyle}
                title={
                  <>
                    <span>{`${title}s`}</span>
                  </>
                }
                headStyle={{
                  border: '1px solid #a8c6fa',
                  borderTopLeftRadius: '10px',
                  borderTopRightRadius: '10px',
                }}
                bodyStyle={{
                  padding: '0',
                  border: '1px solid #a8c6fa',
                  borderBottomRightRadius: '10px',
                  borderBottomLeftRadius: '10px',
                }}
                extra={
                  <div>
                    <Button
                      hidden={showPaySlips.length === 0 || showPaySlips.length < 2}
                      type="primary"
                      className="ml-3"
                      onClick={this.onBulkDownloadFiles}
                    >
                      Download All
                      <Icon type="download" />
                    </Button>
                  </div>
                }
              >
                <List
                  bordered
                  pagination={{
                    pageSize: 5,
                    size: 'small',
                  }}
                  dataSource={showPaySlips}
                  renderItem={item => (
                    <List.Item
                      style={{ wordBreak: 'break-all' }}
                      actions={this.actionsForSlips(item, uploadView)}
                    >
                      <span>
                        {item.fileStatus === 'uploaded' ? (
                          <Icon
                            type="check-circle"
                            style={{ color: '#72bb53', paddingRight: '10px' }}
                          />
                        ) : (
                          ''
                        )}
                        {item.fileStatus === 'uploading' || item.fileStatus === 'new' ? (
                          <Icon
                            type="clock-circle"
                            style={{ color: '#ecb160', paddingRight: '10px' }}
                          />
                        ) : (
                          ''
                        )}
                        {item.fileStatus === 'cancelled' ? (
                          <Icon
                            type="close-circle"
                            style={{ color: '#ff5d55', paddingRight: '10px' }}
                          />
                        ) : (
                          ''
                        )}
                        {item.friendlyName}
                      </span>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </div>
        </Spin>
      </Row>
    )
  }
}
export default UploadPayslip
