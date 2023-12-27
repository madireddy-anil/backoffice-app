import React from 'react'
import { CSVLink } from 'react-csv'
import { Icon, Tooltip } from 'antd'

class Download extends React.Component {
  render() {
    const { data, fileName, headers, onClickOk, icon, toolTip } = this.props
    return (
      <CSVLink data={data} headers={headers} filename={fileName} onClick={onClickOk}>
        <Tooltip title={toolTip}>
          <Icon type={icon || 'download'} />
        </Tooltip>
      </CSVLink>
    )
  }
}

export default Download
