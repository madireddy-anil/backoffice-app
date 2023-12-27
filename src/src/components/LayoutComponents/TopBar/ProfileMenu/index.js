import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Menu, Dropdown, Avatar, Button, Modal } from 'antd'
import { FormattedMessage } from 'react-intl'
import { userLogOut } from 'redux/user/actions'
import { showChangePasswordModal, closeChangePasswordModal } from 'redux/register/actions'
import ChangePassword from 'pages/user/changePassword'
import styles from './style.module.scss'

const mapStateToProps = ({ user, register }) => ({
  modalVisible: register.modalVisible,
  name: user.name,
  email: user.email,
  loginUrl: user.loginUrl,
  phone: user.phone,
  isMFAset: user.isMFAset,
})

@withRouter
@connect(mapStateToProps)
class ProfileMenu extends React.Component {
  logout = () => {
    const { loginUrl, dispatch, history } = this.props
    dispatch(userLogOut())
    history.push(loginUrl)
  }

  showModal = () => {
    const { dispatch } = this.props
    dispatch(showChangePasswordModal())
  }

  handleCancel = () => {
    const { dispatch } = this.props
    dispatch(closeChangePasswordModal())
  }

  render() {
    const { name, email, phone, isMFAset, modalVisible } = this.props
    const menu = (
      <Menu selectable={false}>
        <Menu.Item>
          <strong>
            <FormattedMessage id="topBar.profileMenu.hello" />, {name || 'Anonymous'}
          </strong>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div>
            <strong>
              <FormattedMessage id="topBar.profileMenu.email" />:{' '}
            </strong>
            {email}
            {phone || '-'}
          </div>
        </Menu.Item>
        {isMFAset && <Menu.Divider />}
        {isMFAset && (
          <Menu.Item>
            <Button
              type="link"
              onClick={this.showModal}
              icon="edit"
              className={styles.changePassBtn}
            >
              <FormattedMessage id="topBar.profileMenu.changePassword" />
            </Button>
          </Menu.Item>
        )}
        <Menu.Divider />
        <Menu.Item onClick={this.logout}>
          <Button type="link" icon="logout">
            <FormattedMessage id="topBar.profileMenu.logout" />
          </Button>
        </Menu.Item>
      </Menu>
    )
    return (
      <div>
        <div>
          <Modal
            visible={modalVisible}
            onCancel={this.handleCancel}
            footer={null}
            className={styles.modalBlock}
            destroyOnClose
          >
            <ChangePassword />
          </Modal>
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
          <div className={styles.dropdown}>
            <Avatar className={styles.avatar} shape="square" size="small" icon="user" />
          </div>
        </Dropdown>
      </div>
    )
  }
}

export default ProfileMenu
