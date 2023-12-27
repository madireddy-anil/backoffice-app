import React, { Component } from 'react'
import { Collapse } from 'antd'
import Spacer from 'components/customComponents/Spacer'
import { RightOutlined } from '@ant-design/icons'

import './style.scss'

const { Panel } = Collapse

class DynamicCollapse extends Component {
  state = {
    bordered: false,
  }

  render() {
    const { bordered } = this.state
    const {
      panelHeadTitle,
      panelHeadTitleIcon,
      panelOneTitle,
      panelTwoTitle,
      panelOneData,
      panelTwoData,
      panelData,
      nestedCollapse,
      handleonChangeCollapse,
    } = this.props

    return (
      <React.Fragment>
        <div>
          <Collapse
            bordered={bordered}
            ghost
            expandIcon={({ isActive }) => <RightOutlined rotate={isActive ? 90 : 0} />}
            onChange={handleonChangeCollapse}
          >
            <Panel header={panelHeadTitle} extra={panelHeadTitleIcon} className="border-0">
              {nestedCollapse ? (
                <Collapse
                  bordered={bordered}
                  expandIcon={({ isActive }) => (
                    <RightOutlined className="test" rotate={isActive ? 90 : 0} />
                  )}
                  className="nested__pannel__block"
                >
                  <Spacer height="10px" />
                  {panelOneTitle && (
                    <Panel header={panelOneTitle} className="border-0 pannel__header">
                      <div className="panel__content">{panelOneData}</div>
                    </Panel>
                  )}
                  {panelTwoTitle && (
                    <Panel header={panelTwoTitle} className="border-0 pannel__header">
                      <div className="panel__content">{panelTwoData}</div>
                    </Panel>
                  )}
                </Collapse>
              ) : (
                <div className="panel__content px-0 pt-2">{panelData}</div>
              )}
            </Panel>
          </Collapse>
        </div>
      </React.Fragment>
    )
  }
}

export default DynamicCollapse
