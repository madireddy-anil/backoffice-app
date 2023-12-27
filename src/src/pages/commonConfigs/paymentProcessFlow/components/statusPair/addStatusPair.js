import React, { Component } from 'react'
import { Form, Select, Icon } from 'antd'
import { connect } from 'react-redux'
import { updateStatusPair, updateAddStatusPairView } from 'redux/paymentProcessFlow/action'
import data from '../../data.json'
import styles from '../../style.module.scss'

const { Option } = Select
const FALSE_VALUE = false

const mapStateToProps = ({ user, currencyPairs, paymentProcessFlow }) => ({
  token: user.token,
  errorList: currencyPairs.errorList,
  addProcessLoading: paymentProcessFlow.addProcessLoading,
  statusPair: paymentProcessFlow.selectedProcessFlow.status,
})

@Form.create()
@connect(mapStateToProps)
class addStatusPair extends Component {
  state = {
    showTick: true,
    type: undefined,
    nextExitStatusCode: undefined,
  }

  // componentDidMount(){
  //   const {dispatch}=this.props
  //   dispatch(updateStatusPair([]))
  // }

  handleAddStatusPair = () => {
    this.setState({ showTick: false })
    this.setValue()
  }

  handleCancelStatusPair = () => {
    this.setState({ showTick: true })
  }

  handleSelectedType = e => {
    this.setState({ type: e, showTick: true })
  }

  handleCodeType = e => {
    this.setState({ nextExitStatusCode: e, showTick: true })
  }

  setValue = () => {
    const { type, nextExitStatusCode } = this.state
    const { statusPair, dispatch } = this.props
    const value = {
      type,
      nextExitStatusCode,
    }
    const test = [...statusPair, value]
    dispatch(updateAddStatusPairView(FALSE_VALUE))
    dispatch(updateStatusPair(test))
  }

  render() {
    const { showTick, type, nextExitStatusCode } = this.state
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
              value={type}
              filterOption={(input, option) =>
                option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={this.handleSelectedType}
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
              value={nextExitStatusCode}
              onChange={this.handleCodeType}
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
              <Icon type="check" onClick={this.handleAddStatusPair} className={styles.tickIcon} />
            </div>
          ) : (
            <div className="col-md-1 col-lg-1">
              <Icon
                type="delete"
                onClick={this.handleCancelStatusPair}
                className={styles.closeIcon}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }
}

export default addStatusPair
