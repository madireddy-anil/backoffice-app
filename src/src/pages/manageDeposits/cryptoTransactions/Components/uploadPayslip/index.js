import React, { Component } from 'react'
import { Row, Col, Upload, Button, List, Icon, Modal, message } from 'antd'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { createPaySlip, getPresignedUrl } from 'redux/upload/actions'

const mapStateToProps = ({ user, trade, upload }) => ({
  token: user.token,
  tradeId: trade.tradeId,
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
  }

  componentDidMount() {
    this.setState({ downloadOrPreviewType: '' })
  }

  componentDidUpdate(prevProps) {
    const { upload } = this.props
    const { preSignedURL } = upload
    const { downloadOrPreviewType, downloadOrPreviewFile } = this.state
    // if (prevProps.client !== client && client !== '') {
    //   dispatch(geDepositSlipsByTradeId(tradeId, token))
    // }

    if (prevProps.upload.preSignedURL !== preSignedURL && preSignedURL !== '') {
      if (downloadOrPreviewType === 'download') {
        // this.toDataURL(preSignedURL)
        //   .then(dataUrl => {
        //     console.log('RESULT:', dataUrl)
        //   })
        const a = document.createElement('a')
        a.href = preSignedURL
        a.download = downloadOrPreviewFile.name
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

  // toDataURL = url => fetch(url, {
  //   mode: 'cors',
  //   headers: {
  //     'Access-Control-Allow-Origin': '*'
  //   }
  // })
  //   .then(response => response.blob())
  //   .then(blob => new Promise((resolve, reject) => {
  //     const reader = new FileReader()
  //     reader.onloadend = () => resolve(reader.result)
  //     reader.onerror = reject
  //     reader.readAsDataURL(blob)
  //   }))

  setImagePreview = () => {
    const {
      upload: { preSignedURL },
    } = this.props
    const { downloadOrPreviewFile } = this.state
    if (preSignedURL) {
      this.setState({
        previewImage: preSignedURL,
        previewVisible: true,
        previewTitle: downloadOrPreviewFile.name,
      })
    }
  }

  handleUpload = () => {
    const { fileList } = this.state

    const { tradeOrTranId, clientOrVendorName, category, dispatch, token } = this.props

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

  getImagePreSignedUrl = (file, type) => {
    const { clientOrVendorName, dispatch, token } = this.props
    const payload = {
      file,
      clientOrVendorName,
      documentType: 'Payslips',
    }
    Promise.resolve(dispatch(getPresignedUrl(payload, token))).then(() => {
      this.setState({
        downloadOrPreviewType: type,
        downloadOrPreviewFile: file,
      })
    })
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

    return (
      <Row className="mt-4">
        <div style={{ display: uploadView.canUpload ? '' : 'none' }}>
          <Col xs={{ span: 24 }} lg={{ span: 24 }}>
            <div>
              <h6>
                <strong>Upload New {title}:</strong>
              </h6>
              <div className="clearfix">
                <Upload key {...uploadProps}>
                  {/* {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                ) : (
                    uploadButton
                  )} */}
                  {uploadButton}
                </Upload>
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

        <div style={{ display: uploadView.viewUploadList ? '' : 'none' }}>
          <Col className="mt-4" xs={{ span: 24 }} lg={{ span: 24 }}>
            <h6>
              <strong>{title}s :</strong>
            </h6>
            <List
              // header={<h5>Uploaded Payslips</h5>}
              bordered
              pagination={{
                pageSize: 5,
                size: 'small',
              }}
              dataSource={showPaySlips}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Icon
                      hidden={
                        item.fileType === 'application/pdf' ||
                        item.fileType === 'application/zip' ||
                        item.fileType === 'application/x-zip-compressed'
                      }
                      onClick={() => this.getImagePreSignedUrl(item, 'preview')}
                      type="eye"
                    />,
                    <Icon
                      onClick={() => this.getImagePreSignedUrl(item, 'download')}
                      type="download"
                    />,
                  ]}
                >
                  {item.friendlyName}
                </List.Item>
              )}
            />
          </Col>
        </div>
      </Row>
    )
  }
}
export default UploadPayslip
