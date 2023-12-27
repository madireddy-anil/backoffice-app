import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Form, Input, Divider, Spin } from 'antd'
import Spacer from 'components/CleanUIComponents/Spacer'
// import Text from 'components/CleanUIComponents/Text'
import { validateOtp } from 'redux/user/actions'
import QRCode from 'qrcode.react'
import styles from '../style.module.scss'

const mapStateToProps = ({ user }) => ({
  userStore: user,
  loading: user.loading,
  qrCode: user.barcode,
  emailId: user.email,
  mfaToken: user.mfaToken,
})

@Form.create()
@connect(mapStateToProps)
class SetUp2FA extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { dispatch, form, mfaToken, emailId } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        values.mfa_token = mfaToken
        values.email = emailId
        dispatch(validateOtp(values))
      }
    })
  }

  render() {
    const { loading, form, qrCode } = this.props
    return (
      <div className={styles.block}>
        <div className="row">
          <div className="col-xl-12">
            <div className={styles.inner}>
              <div className={styles.form}>
                <Spin spinning={loading}>
                  <div>
                    <h5 className={styles.header}>Additional Security</h5>
                    <Spacer height="40px" />
                    <h5 className={styles.header}>2 Factor Authentication</h5>
                    <p>
                      This will provide the security codes required to execute transactions from
                      within the member portal. We currently support the following authenticators.
                    </p>

                    <div className="text-center">
                      <img src="resources/images/auth.png" alt="Authentication" width="60%" />
                    </div>
                    <div className="d-flex justify-content-center">
                      <div className={styles.appTitles}>Google Twilio Microsoft</div>
                    </div>
                    <Divider />
                    <div className={styles.lockIcon}>
                      <div className={styles.qrBlock}>
                        <QRCode value={qrCode} />
                      </div>
                    </div>
                    <Spacer height="10px" />
                    <p>
                      Scan the QR code using an authentication app and enter the 6 digit code to
                      confirm setup is complete.
                    </p>
                    <Spacer height="20px" />
                    <Form layout="vertical" onSubmit={this.onSubmit}>
                      <Form.Item>
                        {form.getFieldDecorator('code', {
                          initialValue: '',
                          rules: [
                            {
                              required: true,
                              min: 6,
                              max: 6,
                              message: 'Please input your 6-digit code',
                            },
                          ],
                        })(
                          <Input
                            type="password"
                            size="default"
                            placeholder="6-digit code"
                            style={{ textAlign: 'center', padding: '16px', letterSpacing: '6px' }}
                          />,
                        )}
                      </Form.Item>
                      <Spacer height="40px" />
                      <div className={styles.btnBlock}>
                        <Button
                          block
                          className="width-200 mr-2"
                          type="primary"
                          htmlType="submit"
                          loading={loading}
                        >
                          Confirm
                        </Button>
                      </div>
                    </Form>
                    <Spacer height="22px" />
                  </div>
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SetUp2FA
