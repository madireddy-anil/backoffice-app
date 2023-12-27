import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, Row, Col, Spin, Button } from 'antd'
import { withRouter } from 'react-router'

import { getFxBaseRateDetailsById } from 'redux/fxBaseRate/actions'
import FxBaseRateSummary from './summary'

const mapStateToProps = ({ settings, user, fxBaseRate }) => ({
  timeZone: settings.timeZone.value,
  token: user.token,
  currentFxBaseRate: fxBaseRate.currentFxBaseRate,
})

@withRouter
@connect(mapStateToProps)
class ViewFxBaseRate extends Component {
  componentDidMount() {
    const {
      dispatch,
      token,
      currentFxBaseRate: { id },
    } = this.props
    dispatch(getFxBaseRateDetailsById(id, token))
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/fx-base-rates')
  }

  render() {
    const {
      currentFxBaseRate: { fxBaseRateReference, currentFxBaseRateLoading },
    } = this.props

    return (
      <Card
        title={fxBaseRateReference}
        bordered={false}
        headStyle={{
          border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        bodyStyle={{
          padding: '2px',
          border: '1px solid #a8c6fa',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
        }}
        extra={
          <Button type="link" onClick={this.onBackButtonHandler}>
            Back
          </Button>
        }
      >
        <Row>
          <Col xs={{ span: 24 }} lg={{ span: 13 }}>
            <Spin spinning={currentFxBaseRateLoading}>
              <FxBaseRateSummary />
            </Spin>
          </Col>
        </Row>
      </Card>
    )
  }
}
export default ViewFxBaseRate
