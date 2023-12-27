import React from 'react'
import { connect } from 'react-redux'
// import HomeMenu from './HomeMenu'
// import ProjectManagement from './ProjectManagement'
// import IssuesHistory from './IssuesHistory'
// import LiveSearch from './LiveSearch'
// import BitcoinPrice from './BitcoinPrice'
import { updateNotificationItem } from 'redux/notifications/actions'
import ProfileMenu from './ProfileMenu'
import Notifications from './Notifications'
// import LanguageSelector from './LanguageSelector'
import TimeZoneSelector from './TimeZoneSelector'
import styles from './style.module.scss'

const mapStateToProps = ({ user }) => ({
  clientName: user.userData.accountName,
  ws: user.ws,
})

@connect(mapStateToProps)
class TopBar extends React.Component {
  componentWillMount() {
    const { ws, dispatch } = this.props

    if (ws) {
      ws.onopen = () => {
        console.log('connected')
      }

      ws.onmessage = evt => {
        dispatch(updateNotificationItem(JSON.parse(evt.data)))
      }

      ws.onclose = () => {
        console.log('disconnected')
      }
    }
  }

  render() {
    const { clientName } = this.props
    return (
      <div className={styles.topbar}>
        <div className="mr-4">
          {/* <IssuesHistory /> */}
          <strong>{clientName || ''}</strong>
        </div>
        <div className="mr-4">{/* <ProjectManagement /> */}</div>
        <div className="mr-auto">{/* <LiveSearch /> */}</div>
        {/* <div className="mr-4">
          <BitcoinPrice />
        </div> */}
        {/* <div className="mr-4"><LanguageSelector /></div> */}
        {/* <div className="mr-4"><HomeMenu /></div> */}
        <div className="mr-4">
          <TimeZoneSelector />
        </div>
        <div className="mr-4">
          <Notifications />
        </div>
        <ProfileMenu />
      </div>
    )
  }
}

export default TopBar
