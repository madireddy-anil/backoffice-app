import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Row, Col, Card, Divider, Form, Input, Icon } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
import InfoCard from 'components/customComponents/InfoCard'

import styles from './style.module.scss'

const favicon = (
  <img
    src="resources/images/logo_square-mobile.svg"
    alt="Payconstruct"
    style={{
      height: '25px',
    }}
  />
)

const mapStateToProps = ({ user }) => ({
  token: user.token,
  profile: user.userProfile,
})

@Form.create()
@withRouter
@connect(mapStateToProps)
class Profile extends Component {
  state = {
    emptyValue: '---',
  }

  getVerifiedStatus = isVerfied => {
    const restunRsp =
      isVerfied === 'Y' ? (
        <Icon
          type="check-circle"
          theme="filled"
          style={{ color: '#16ce16', marginLeft: '12px', fontSize: '20px' }}
        />
      ) : (
        <Icon
          type="close-circle"
          theme="filled"
          style={{ color: '#FF4D4F', marginLeft: '12px', fontSize: '20px' }}
        />
      )
    return restunRsp
  }

  getVerifiedTextStatus = (fieldName, isVerfied) => {
    const restunRsp =
      isVerfied === 'Y' ? <div>{fieldName} verified</div> : <div>{fieldName} not verified</div>
    return restunRsp
  }

  handleClose = () => {
    const { history } = this.props
    history.push('/accoun-balances')
  }

  render() {
    const { form, profile } = this.props
    const { emptyValue } = this.state
    const customDividerStyle = {
      height: '477px',
    }
    const customDivider = {
      height: '142px',
      marginTop: '11px',
    }

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <InfoCard
              header="Check your details..."
              subHeader="It is important to keep your personal details up to date for secuirty and screening. We dont want to send anything private to the wrong person!"
              closeButton={this.handleClose}
            />
          </div>
        </div>
        <Spacer height="25px" />
        <div className="row">
          <div className="col-sm-12 col-lg-6 mb-4">
            <Card
              style={{
                borderRadius: '10px',
              }}
            >
              <Row>
                <Col span={2}>
                  {favicon} <br />
                  <div className={styles.divider}>
                    <Divider style={customDividerStyle} type="vertical" dashed />
                  </div>
                </Col>
                <Col span={22}>
                  <strong className="font-size-18">Personal Details</strong>
                  <Spacer height="20px" />
                  <strong className="font-size-15">First Name</strong>
                  <Form.Item>
                    {form.getFieldDecorator('firstName', {
                      initialValue: profile.firstName ? profile.firstName : emptyValue,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Input
                        style={{ width: '93%', marginTop: '14px', pointerEvents: 'none' }}
                        size="large"
                        className={styles.inputbox}
                      />,
                    )}
                  </Form.Item>
                  <strong className="font-size-15">Last Name</strong>
                  <Form.Item>
                    {form.getFieldDecorator('lastName', {
                      initialValue: profile.lastName ? profile.lastName : emptyValue,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Input
                        style={{ width: '93%', marginTop: '14px', pointerEvents: 'none' }}
                        size="large"
                        className={styles.inputbox}
                      />,
                    )}
                  </Form.Item>
                  <strong className="font-size-15">Date Of Birth</strong>
                  <Form.Item>
                    {form.getFieldDecorator('dateOfBirth', {
                      initialValue: profile.dateOfBirth ? profile.dateOfBirth : emptyValue,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Input
                        style={{ width: '93%', marginTop: '14px', pointerEvents: 'none' }}
                        size="large"
                        className={styles.inputbox}
                      />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Spacer height="29px" />
            </Card>
          </div>
          <div className="col-sm-12 col-lg-6">
            <Card
              style={{
                borderRadius: '10px',
              }}
            >
              <Row>
                <Col span={2}>
                  {favicon} <br />
                  <div className={styles.divider}>
                    <Divider style={customDividerStyle} type="vertical" dashed />
                  </div>
                </Col>
                <Col span={22}>
                  <strong className="font-size-18">Contact Information</strong>
                  <Spacer height="20px" />
                  <strong className="font-size-15">Mobile Number</strong>
                  <Form.Item>
                    {form.getFieldDecorator('mobileNumber', {
                      initialValue: profile.mobileNumber ? profile.mobileNumber : emptyValue,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Input
                        style={{ width: '90%', marginTop: '14px', pointerEvents: 'none' }}
                        size="large"
                        className={styles.inputbox}
                      />,
                    )}
                    {this.getVerifiedStatus(profile.mobilePhoneVerified)}
                    <div className={styles.textVerifyBlock}>
                      {this.getVerifiedTextStatus('Mobile Number', profile.mobilePhoneVerified)}
                    </div>
                  </Form.Item>
                  <strong className="font-size-15">Address</strong>
                  <Spacer height="14px" />
                  <Form.Item>
                    {form.getFieldDecorator('address', {
                      initialValue: '',
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <div className={styles.addressBlock}>
                        <div className={`${styles.listCard}`}>
                          <Row>
                            <Col span={11}>
                              <strong>Address Line 1</strong>
                              <br />
                              <p className={styles.addSubText}>
                                {Object.entries(profile.address).length > 0 &&
                                profile.address.addressLine1
                                  ? profile.address.addressLine1
                                  : emptyValue}
                              </p>
                              <strong>Address Line 2</strong>
                              <br />
                              <p className={styles.addSubText}>
                                {Object.entries(profile.address).length > 0 &&
                                profile.address.addressLine2
                                  ? profile.address.addressLine2
                                  : emptyValue}
                              </p>
                              <strong>Address Line 3</strong>
                              <br />
                              <p className={styles.addSubText}>
                                {Object.entries(profile.address).length > 0 &&
                                profile.address.addressLine3
                                  ? profile.address.addressLine3
                                  : emptyValue}
                              </p>
                            </Col>
                            <Col span={2}>
                              <div className={styles.divider}>
                                <Divider style={customDivider} type="vertical" dashed />
                              </div>
                            </Col>
                            <Col span={11}>
                              <strong>Province</strong>
                              <br />
                              <p className={styles.addSubText}>
                                {Object.entries(profile.address).length > 0 &&
                                profile.address.province
                                  ? profile.address.province
                                  : emptyValue}
                              </p>
                              <strong>City/Postal Code</strong>
                              <br />
                              <p className={styles.addSubText}>
                                {Object.entries(profile.address).length > 0 && profile.address.city
                                  ? profile.address.city
                                  : emptyValue}
                                /
                                {Object.entries(profile.address).length > 0 &&
                                profile.address.postalCode
                                  ? profile.address.postalCode
                                  : emptyValue}
                              </p>
                              <strong>Country</strong>
                              <br />
                              <p className={styles.addSubText}>
                                {Object.entries(profile.address).length > 0 &&
                                profile.address.countryOfResidence
                                  ? profile.address.countryOfResidence
                                  : emptyValue}
                              </p>
                            </Col>
                          </Row>
                        </div>
                        {this.getVerifiedStatus(profile.addressVerified)}
                      </div>,
                    )}
                    <div className={styles.textVerifyBlock}>
                      {this.getVerifiedTextStatus('Address', profile.addressVerified)}
                    </div>
                  </Form.Item>
                  <strong className="font-size-15">Email</strong>
                  <Form.Item>
                    {form.getFieldDecorator('email', {
                      initialValue: profile.email ? profile.email : emptyValue,
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(
                      <Input
                        style={{ width: '90%', marginTop: '14px', pointerEvents: 'none' }}
                        size="large"
                        className={styles.inputbox}
                      />,
                    )}
                    {this.getVerifiedStatus(profile.emailValidated)}
                    <div className={styles.textVerifyBlock}>
                      {this.getVerifiedTextStatus('Email', profile.emailValidated)}
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}
export default Profile
