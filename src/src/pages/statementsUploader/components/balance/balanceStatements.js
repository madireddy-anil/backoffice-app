import React, { Component } from 'react'
import { connect } from 'react-redux'
// import moment from 'moment'
import { Button, Icon, message, Upload, Alert, Typography } from 'antd'

import { uploadBalanceStatements, updateErrorList } from 'redux/vendorStatements/action'
import Spacer from 'components/CleanUIComponents/Spacer'
import styles from './styles.module.scss'

// import data from './data.json'

const { Dragger } = Upload
const { Paragraph, Text } = Typography

const mapStateToProps = ({ user, vendorStatements }) => ({
  token: user.token,
  errorList: vendorStatements.errorList,
  uploading: vendorStatements.uploading,
})

@connect(mapStateToProps)
class balancesUploader extends Component {
  state = {
    fileList: [],
  }

  componentDidMount() {
    const { dispatch } = this.props
    const emptyArray = []
    dispatch(updateErrorList(emptyArray))
  }

  handleUpload = () => {
    const { dispatch, token } = this.props
    const { fileList } = this.state
    const formData = new FormData()
    if (fileList.length > 0) {
      fileList.map(file => {
        formData.append('file', file)
        formData.append('type', 'Balance')
        return formData
      })
    }
    dispatch(uploadBalanceStatements(formData, token))
  }

  // handleDownloadTemplate = async () => {
  //   const balanceTypes = ['Opening Balance', 'Interim Balance', 'Closing Balance']
  //   const indicator = ['Credit', 'Debit']
  //   const balanceTypesList = balanceTypes.join(',')
  //   const workbook = new ExcelJS.Workbook()
  //   workbook.created = new Date(1985, 8, 30)
  //   workbook.modified = new Date()
  //   workbook.addWorksheet('Sheet 1', {
  //     pageSetup: { paperSize: 9, orientation: 'landscape' },
  //   })
  //   const worksheet = workbook.getWorksheet(1)
  //   worksheet.columns = data.headerData
  //   const rows = []
  //   worksheet.addRows(rows)
  //   worksheet.getColumn('balanceType').values = ['', '', '']
  //   worksheet.views = [
  //     { state: 'frozen', xSplit: undefined, ySplit: 1, topLeftCell: 'A2', activeCell: 'A1' },
  //   ]
  //   const balanceType = worksheet.getColumn('balanceType')
  //   balanceType.header = 'Balance Type'
  //   balanceType.eachCell(cell => {
  //     worksheet.getCell(cell.address).dataValidation = {
  //       type: 'list',
  //       allowBlank: false,
  //       formulae: [`"${balanceTypesList}"`],
  //     }
  //   })

  //   worksheet.getColumn('creditDebitIndicator').values = ['', '']

  //   const creditDebitIndicator = worksheet.getColumn('creditDebitIndicator')
  //   creditDebitIndicator.header = 'Credit Debit Indicator'
  //   creditDebitIndicator.eachCell(cell => {
  //     worksheet.getCell(cell.address).dataValidation = {
  //       type: 'list',
  //       allowBlank: true,
  //       formulae: [`"${indicator}"`],
  //     }
  //   })

  //   const headerRow = worksheet.getRow(1)
  //   headerRow.eachCell(cell => {
  //     cell.protection = { locked: 'True', lockText: 'True' }
  //   })
  //   const buffer = await workbook.xlsx.writeBuffer()
  //   const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  //   const fileExtension = '.xlsx'

  //   const date = moment(new Date()).format('DDMMYYYY_HHMMSS')
  //   const blob = new Blob([buffer], { type: fileType })
  //   saveAs(blob, `Statement_Uploader_Balances_ABN_AMRO_${date}${fileExtension}`)
  // }

  render() {
    const { fileList } = this.state
    const { errorList, uploading, dispatch } = this.props
    const uploadProps = {
      name: 'file',
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file)
          const newFileList = state.fileList.slice()
          newFileList.splice(index, 1)
          dispatch(updateErrorList([]))
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: file => {
        let isError = false
        let isFileTypeError = false
        let isFileSizeExceeded = false
        let isFileCountExceeded = false
        console.log('file.type', file)
        const isLt2M = file.size / 1024 / 1024 < 2
        console.log('file.anme', file.name.indexOf('.csv'))
        if (file.name.indexOf('.csv') > 0) {
          isFileTypeError = false
        } else {
          isFileTypeError = true
        }
        if (file.size === isLt2M) {
          isFileSizeExceeded = true
        }

        if (fileList.length >= 1) {
          isFileCountExceeded = true
        }

        if (!isFileCountExceeded) {
          if (!isFileTypeError) {
            if (!isFileSizeExceeded) {
              isError = false
            } else {
              isError = true
              message.error('File must smaller than 2MB!')
            }
          } else {
            isError = true
            message.error('Only .csv file is accepted ')
          }
        } else {
          isError = true
          message.error('Can upload only one file')
        }
        if (!isError) {
          this.setState(state => ({
            fileList: [...state.fileList, file],
          }))
        }
        return false
      },
      fileList,
    }
    return (
      <div className="col-md-7 offset-md-3">
        {errorList.length > 0 ? (
          <div>
            <div className={styles.errorBlock}>
              <Alert
                // showIcon
                type="error"
                message={
                  <div className="desc">
                    <Paragraph>
                      <Text
                        strong
                        style={{
                          fontSize: 14,
                        }}
                      >
                        Upload failed. The submitted file has the following error. Please fix the
                        file and try again
                      </Text>
                    </Paragraph>
                    {errorList.map(item => {
                      return (
                        <Paragraph>
                          <Icon style={{ color: 'red' }} type="close-circle" /> {item}
                        </Paragraph>
                      )
                    })}
                  </div>
                }
              />
            </div>
            <Spacer height="25px" />
          </div>
        ) : (
          ''
        )}
        <div className={styles.stepUploadBlock}>
          <div className="row">
            <div className="col-lg-6">
              <Button
                className={styles.buttonStyle}
                href="https://docs.google.com/spreadsheets/d/1ZRNS_dt-VAwZKZOubhaPQT45bloWfYlSSicm4DxX72M/edit?usp=sharing"
                target="_blank"
              >
                View Balance Statement File Template
              </Button>
            </div>
            <div className="col-lg-6">
              <Button
                className={styles.guideLineButtonStyle}
                href="https://payperform.atlassian.net/wiki/x/poD9XQ"
                target="_blank"
              >
                Usage Guidelines For Creating A Statement File
              </Button>
            </div>
          </div>
          <Spacer height="15px" />
          <Dragger {...uploadProps} showUploadList={{ showDownloadIcon: true }}>
            <p className="ant-upload-drag-icon">
              <Icon type="upload" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <small>Please make sure the file size is less than 2MB.</small>
            <p>Note : Only .csv files are accepted.</p>
          </Dragger>
          <div className="pt-3">
            <Button
              type="primary"
              onClick={this.handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default balancesUploader
