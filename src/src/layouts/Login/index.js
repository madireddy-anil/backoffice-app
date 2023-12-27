import React from 'react'
import { Layout } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import { resetUserState } from '../../redux/user/actions'

const mapStateToProps = ({ user }) => ({ user })

@connect(mapStateToProps)
@withRouter
class LoginLayout extends React.PureComponent {
  state = {
    backgroundNumber: 1,
    backgroundEnabled: true,
  }

  changeBackground = () => {
    const { backgroundNumber } = this.state
    this.setState({
      backgroundEnabled: true,
      backgroundNumber: backgroundNumber === 5 ? 1 : backgroundNumber + 1,
    })
  }

  toggleBackground = () => {
    const { backgroundEnabled } = this.state
    this.setState({
      backgroundEnabled: !backgroundEnabled,
    })
  }

  handleResetUserState = () => {
    const { dispatch } = this.props
    dispatch(resetUserState())
  }

  render() {
    const { children, user } = this.props
    const { backgroundNumber, backgroundEnabled } = this.state

    return (
      <Layout>
        <Layout.Content>
          <div
            className={backgroundEnabled ? `${styles.layout} ${styles.light}` : `${styles.layout}`}
            style={{
              backgroundImage: backgroundEnabled
                ? `url('resources/images/photos/${backgroundNumber}.jpg')`
                : `none`,
            }}
          >
            <div className={styles.header}>
              <div className={styles.logo}>
                <Link to={user.loginUrl} onClick={this.handleResetUserState}>
                  {!backgroundEnabled && (
                    <img src="resources/images/pc_logo.svg" alt="Payconstruct" width="200" />
                  )}
                  {backgroundEnabled && (
                    <img src="resources/images/pc_logo.svg" alt="Payconstruct" width="200" />
                  )}
                </Link>
              </div>
              {/* <div className={styles.controls}>
                <div className="d-inline-block mr-3">
                  <Button type="default" onClick={this.changeBackground}>
                    Change Background
                  </Button>
                </div>
                <div className="d-inline-block">
                  <Button type="default" onClick={this.toggleBackground}>
                    Toggle Background
                  </Button>
                </div>
              </div> */}
              {/* <nav className={styles.navigation}>
                <ul className={styles.navigationItems}>
                  <li>
                    <a href="">&larr; Back</a>
                  </li>
                  <li>
                    <a className={styles.navigationActive} href="">
                      Login
                    </a>
                  </li>
                  <li>
                    <a href="">About</a>
                  </li>
                  <li>
                    <a href="">Support</a>
                  </li>
                </ul>
              </nav> */}
            </div>
            <div className={styles.content}>{children}</div>
            <div className={`${styles.footer} text-center`}>
              <ul className="list-unstyled list-inline mb-3">
                <li className="list-inline-item">
                  <a href="">Terms of Use</a>
                </li>
                {/* <li className="active list-inline-item">
                  <a href="">Compliance</a>
                </li> */}
                <li className="list-inline-item">
                  <a href="">Support</a>
                </li>
                <li className="list-inline-item">
                  <a href="">Contacts</a>
                </li>
              </ul>
              <p>&copy; 2020 Payconstruct. All rights reserved.</p>
            </div>
          </div>
        </Layout.Content>
      </Layout>
    )
  }
}

export default LoginLayout
