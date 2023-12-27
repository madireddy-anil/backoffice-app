import React from 'react'

import { connect } from 'react-redux'

import { Form, DatePicker, Button, Popover, Col, Row, Popconfirm } from 'antd'

import {
  formatToZoneDateTZFormat,
  formatToZoneDate,
  disabledFutureDate,
} from 'utilities/transformer'

import moment from 'moment'

import { updateBackDatedTrade } from 'redux/trade/actions'

const mapStateToProps = ({ trade, settings, user }) => ({
  tradeId: trade.tradeId,
  tradeConfirmed: trade.progressLogs.tradeRequestedAt,
  timeZone: settings.timeZone.value,
  token: user.token,
  progressLogs: trade.progressLogs,
})

@Form.create()
@connect(mapStateToProps)
class UpdateBackDatedTrade extends React.Component {
  state = {
    visible: false,
  }

  hideSourcePopOver = () => {
    this.setState({
      visible: false,
    })
  }

  handleVisibleSourceChange = visible => {
    this.setState({ visible })
  }

  handleSubmit = () => {
    const { form, tradeId, dispatch, token, progressLogs } = this.props
    form.validateFields((err, value) => {
      if (!err) {
        const values = {
          newDate: {
            progressLogs: {
              ...progressLogs,
              tradeRequestedAt: new Date(value.trade).toISOString(),
              bankAccountsRequestedByClientAt: new Date(value.trade).toISOString(),
            },
          },
          tradeID: tradeId,
        }
        dispatch(updateBackDatedTrade(values, token))
      }
    })
    this.hideSourcePopOver()
  }

  getEditSource = () => {
    const { form, tradeConfirmed, timeZone } = this.props
    return (
      <div>
        <Form layout="inline">
          <Form.Item label="">
            {form.getFieldDecorator('trade', {
              initialValue: moment(
                formatToZoneDateTZFormat(tradeConfirmed, timeZone),
                'YYYY-MM-DDTHH:mm:ss.SSSSZ',
              ),
            })(
              <DatePicker
                style={{
                  width: 200,
                  margin: '0px',
                  border: '1px solid #a8c6fa',
                  borderRadius: '4px',
                }}
                showTime={{
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                }}
                disabledDate={disabledFutureDate}
                format="YYYY/MM/DD HH:mm:ss"
                size="large"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {/* <Button type="primary" onClick={this.handleSubmit}>
              Update
            </Button> */}
            <Popconfirm
              title="Sure to update?"
              onConfirm={() => {
                this.handleSubmit()
              }}
            >
              <Button type="primary">Update</Button>
            </Popconfirm>
          </Form.Item>
        </Form>
      </div>
    )
  }

  render() {
    const { visible } = this.state
    const { tradeConfirmed, timeZone } = this.props

    return (
      <Row>
        <Col className="mt-4">
          <strong className="font-size-15 mt-3"> Date and Time Trade Requested At : </strong>
        </Col>
        <Col className="mt-2">
          <Popover
            content={this.getEditSource()}
            title="Date And Time Trade Requested At : "
            trigger="click"
            placement="topLeft"
            visible={visible}
            onVisibleChange={this.handleVisibleSourceChange}
            arrowPointAtCenter
          >
            <span className="font-size-12 edit-mode">
              {formatToZoneDate(tradeConfirmed, timeZone)}
            </span>
          </Popover>
        </Col>
      </Row>
    )
  }
}

export default UpdateBackDatedTrade
