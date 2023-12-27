import React from 'react'
import { Menu, Dropdown } from 'antd'
import { connect } from 'react-redux'
import TZ from '../../../../utilities/variables'
import styles from './style.module.scss'

@connect(({ settings }) => ({ settings }))
class TimeZoneSelector extends React.Component {
  changeTimeZone = tz => {
    const { dispatch } = this.props
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'timeZone',
        value: tz,
      },
    })
  }

  render() {
    const {
      settings: { timeZone },
    } = this.props

    const timeZoneMenu = (
      <Menu className={styles.menu} selectedKeys={[timeZone.code]}>
        {TZ.timeZoneOptions.map(tz => {
          return (
            <Menu.Item key={tz.code} onClick={() => this.changeTimeZone(tz)}>
              <span role="img" aria-label="hkt" className="mr-2">
                {tz.code}
              </span>
              {tz.value}
            </Menu.Item>
          )
        })}
      </Menu>
    )
    return (
      <Dropdown overlay={timeZoneMenu} trigger={['click']}>
        <div className={styles.dropdown}>
          Time Zone : <strong className="text-uppercase">{timeZone.code}</strong>
        </div>
      </Dropdown>
    )
  }
}

export default TimeZoneSelector
