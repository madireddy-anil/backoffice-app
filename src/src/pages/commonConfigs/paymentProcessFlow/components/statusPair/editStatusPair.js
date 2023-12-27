import React, { Component } from 'react'
import { Form, Select, Icon } from 'antd'
import { connect } from 'react-redux'
import { updateStatusPairAtIndex } from 'redux/paymentProcessFlow/action'
import data from '../../data.json'
import styles from '../../style.module.scss'

const { Option } = Select

const mapStateToProps = ({ user, currencyPairs, paymentProcessFlow }) => ({
  token: user.token,
  errorList: currencyPairs.errorList,
  addProcessLoading: paymentProcessFlow.addProcessLoading,
  statusPair: paymentProcessFlow.selectedProcessFlow.status,
})

@Form.create()
@connect(mapStateToProps)
class editStatusPair extends Component {
  state = {
    showTick: false,
  }

  handleSelectedType = (newValue, index) => {
    const { statusPair, dispatch } = this.props
    dispatch(updateStatusPairAtIndex(statusPair, newValue, index, 'type'))
  }

  handleCodeType = (newValue, index) => {
    const { statusPair, dispatch } = this.props
    dispatch(updateStatusPairAtIndex(statusPair, newValue, index, 'nextExitStatusCode'))
  }

  render() {
    const { showTick } = this.state
    const { item, index, onCancel } = this.props
    const statusTypeList = data.statusType.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    const statusCode = data.nextExitStatusCode.map(option => (
      <Option key={option.value} value={option.value} label={option.label}>
        {option.label}
      </Option>
    ))
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-6 col-lg-4">
            <Select
              style={{ width: '100%' }}
              optionLabelProp="label"
              className={styles.cstmSelectInput}
              placeholder="Select Status type"
              showSearch
              value={item.type}
              filterOption={(input, option) =>
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={e => this.handleSelectedType(e, index)}
            >
              {statusTypeList}
            </Select>
          </div>
          <div className="col-md-6 col-lg-4">
            <Select
              style={{ width: '100%' }}
              optionLabelProp="label"
              className={styles.cstmSelectInput}
              placeholder="Select next status code"
              showSearch
              value={item.nextExitStatusCode}
              onChange={e => this.handleCodeType(e, index)}
              filterOption={(input, option) =>
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              // mode="multiple"
            >
              {statusCode}
            </Select>
          </div>
          {showTick ? (
            <div className="col-md-1 col-lg-1">
              <Icon
                type="check"
                onClick={() => this.handleAddStatusPair(item, index)}
                className={styles.tickIcon}
              />
            </div>
          ) : (
            <div className="col-md-1 col-lg-1">
              <Icon type="delete" onClick={onCancel} className={styles.closeIcon} />
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default editStatusPair
