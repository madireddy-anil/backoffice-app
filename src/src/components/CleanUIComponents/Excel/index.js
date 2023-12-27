import React from 'react'
import ReactExport from 'react-data-export'
import { Tooltip, Icon, Button } from 'antd'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ReactExport.ExcelFile

class Download extends React.Component {
  render() {
    const {
      columns,
      data,
      fileName,
      icon,
      isIconOnly,
      isPrimaryButtonVisible,
      primaryButtonName,
      isDownloadDisabled,
    } = this.props
    const dataSet = [
      {
        columns,
        data,
      },
    ]

    return (
      <ExcelFile
        element={
          <Tooltip placement="right" title="Download Excel">
            {isIconOnly && <Icon type={icon || 'download'} />}
            {isPrimaryButtonVisible && (
              <Button type="primary" disabled={isDownloadDisabled}>
                <Icon type={icon || 'download'} />
                {primaryButtonName}
              </Button>
            )}
          </Tooltip>
        }
        filename={fileName}
      >
        <ExcelSheet dataSet={dataSet} name="Organization" />
      </ExcelFile>
    )
  }
}

export default Download
