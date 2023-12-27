import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Row, Col, Tag } from 'antd'
import DynamicCollapse from 'components/customComponents/Collapse'
import { InfoCircleOutlined } from '@ant-design/icons'
import Text from 'components/customComponents/Text'

import styles from './style.module.scss'

const mapStateToProps = ({ user, clientManagement }) => ({
  token: user.token,
  id: clientManagement.entityId,
  loading: clientManagement.loading,
  kycStatus: clientManagement.kycStatus,
})

@connect(mapStateToProps)
class OnBoardingSignOff extends Component {
  state = {
    isCollapseActive: false,
  }

  panelTitle = (
    <div className={styles.panel__header}>
      <Text size="default">OnBoarding team sign-off</Text>
    </div>
  )

  handleLinkForDocuments = () => {
    window.scrollTo(0, document.body.scrollHeight)
  }

  handleBtnForCompliance = () => {
    const { dispatch, id, token } = this.props
    dispatch({
      type: 'SEND_COMPLIANCE_REVIEW_MAIL',
      entityId: id,
      token,
    })
  }

  panelSection = () => {
    const { loading, kycStatus } = this.props
    return (
      <>
        <div className={styles.onboarding__wrapper}>
          <Row style={{ marginBottom: '15px' }}>
            <Col lg={{ span: 24 }}>
              <div className={styles.onboarding__content}>
                <div>
                  <Tag color="#ebf3fe" className={styles.required__document}>
                    <InfoCircleOutlined style={{ color: '#2d80eb' }} />{' '}
                    <span style={{ marginLeft: '6px' }}>
                      Please ensure all the required documentation is present and correct.{' '}
                      <Button
                        type="link"
                        onClick={() => this.handleLinkForDocuments()}
                        style={{ background: 'none', border: 'none', color: '#313343' }}
                      >
                        <span className={styles.document__link}>Check documents.</span>
                      </Button>
                    </span>
                  </Tag>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ marginTop: '15px', marginBottom: '15px' }}>
              <Button
                type="primary"
                loading={loading}
                shape="round"
                disabled={kycStatus !== 'pending'}
                onClick={() => this.handleBtnForCompliance()}
                style={{ background: 'none', border: '1px solid #e3e8f0', color: '#313343' }}
              >
                <span style={{ color: '#313343', fontWeight: '500' }}>
                  Submit for Compliance Review
                </span>
              </Button>
            </Col>
          </Row>
        </div>
      </>
    )
  }

  handleonChangeCollapse = () => {
    // console.log(e)
  }

  render() {
    const { isCollapseActive } = this.state
    return (
      <React.Fragment>
        <div
          className={
            isCollapseActive ? 'collapse__block__active mt-2' : 'collapse__block_inactive mt-2'
          }
        >
          <DynamicCollapse
            panelHeadTitle={this.panelTitle}
            panelData={this.panelSection()}
            handleonChangeCollapse={this.handleonChangeCollapse()}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default OnBoardingSignOff
