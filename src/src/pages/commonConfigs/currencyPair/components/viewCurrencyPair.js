import React, { Component } from 'react'
import {
  Card,
  Button,
  // Col,
  // Row,
  Form,
  Tag,
} from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import styles from '../style.module.scss'

const mapStateToProps = ({ user, currencyPairs }) => ({
  token: user.token,
  selectedCurrencyPair: currencyPairs.selectedCurrencyPair,
})

@Form.create()
@connect(mapStateToProps)
class ViewCurrency extends Component {
  state = {
    noData: '--',
  }

  navigateToEditCurrency = () => {
    const { history } = this.props
    history.push('/edit-currency-pair')
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/currency-pair')
  }

  formateData = data => {
    return data.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(',')
  }

  render() {
    const { selectedCurrencyPair } = this.props
    const { noData } = this.state
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">View Currency Details</span>
            </div>
          }
          bordered
          headStyle={{
            border: '1px solid #a8c6fa',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '29px',
            paddingBottom: '3px',
            border: '1px solid #a8c6fa',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          className={styles.mainCard}
          extra={
            <>
              <Button type="link" className="pr-3" onClick={() => this.navigateToEditCurrency()}>
                Edit
              </Button>
              <Button type="link" onClick={this.onBackButtonHandler}>
                Back
              </Button>
            </>
          }
        >
          <Helmet title="Country" />
          <Form layout="vertical" onSubmit={this.onSubmit}>
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Vendor</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrencyPair.vendor ? selectedCurrencyPair.vendor : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Buy Currency Code</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrencyPair.buyCurrency ? selectedCurrencyPair.buyCurrency : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Sell Currency Code</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrencyPair.sellCurrency ? selectedCurrencyPair.sellCurrency : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Allowed Trading Days</strong>
                <div className="pb-4 mt-1">
                  <span className={`font-size-13 ${styles.textBlock}`}>
                    {selectedCurrencyPair.allowedTradingDays.length > 0
                      ? this.formateData(selectedCurrencyPair.allowedTradingDays)
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Allowed Trading Times</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {Object.entries(selectedCurrencyPair.allowedTradingTimes).length > 0
                      ? `${selectedCurrencyPair.allowedTradingTimes.start} to ${selectedCurrencyPair.allowedTradingTimes.end}`
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Non Allowed Trading Days</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrencyPair.nonAllowedTradingDays.length > 0
                      ? selectedCurrencyPair.nonAllowedTradingDays.map(item => {
                          return (
                            <Tag
                              //   closable
                              //   onClose={() => this.handleRemoveDate(item)}
                              key={item}
                              color="#313343"
                              style={{ marginBottom: '3px' }}
                            >
                              {item}
                            </Tag>
                          )
                        })
                      : noData}
                  </span>
                </div>
              </div>
            </div>
          </Form>
        </Card>
      </React.Fragment>
    )
  }
}

export default ViewCurrency
