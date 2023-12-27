import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Collapse } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import Text from 'components/customComponents/Text'
import People from './people'

import styles from './style.module.scss'

const { Panel } = Collapse

const mapStateToProps = ({ user, clientManagement }) => ({
  token: user.token,
  entityId: clientManagement.entityId,
})

@connect(mapStateToProps)
class RiskInformationPeople extends Component {
  panelHeadTitle = (
    <div className={styles.panel__header}>
      <Text size="default">Risk information - People inc. IDV</Text>
    </div>
  )

  render() {
    return (
      <div>
        <Collapse
          ghost
          className="collapse__block__oo_active"
          expandIcon={({ isActive }) => (
            <RightOutlined style={{ color: '#bdc4ce' }} rotate={isActive ? 90 : 0} />
          )}
        >
          <Panel header={this.panelHeadTitle} className="test-cace border-0">
            <People />
          </Panel>
        </Collapse>
      </div>
    )
  }
}

export default RiskInformationPeople
