import React, { Component } from 'react'
import {
  Card,
  Button,
  // Col,
  // Row,
  Form,
} from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import styles from '../style.module.scss'

const mapStateToProps = ({ user, currencies }) => ({
  token: user.token,
  selectedCurrency: currencies.selectedCurrency,
})

@Form.create()
@connect(mapStateToProps)
class ViewCurrency extends Component {
  state = {
    noData: '--',
  }

  navigateToEditCurrency = () => {
    const { history } = this.props
    history.push('/edit-currency')
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/currencies')
  }

  render() {
    const { selectedCurrency } = this.props
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
                <strong className="font-size-15">Currency Code</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrency.code ? selectedCurrency.code : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Currency Name</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrency.name ? selectedCurrency.name : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Currency Account</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrency.currencyAccount ? selectedCurrency.currencyAccount : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Deposits</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrency.deposits ? selectedCurrency.deposits : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Payments</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrency.payments ? selectedCurrency.payments : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <strong className="font-size-15">Restricted Deposits</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedCurrency.restrictedDeposits
                      ? selectedCurrency.restrictedDeposits
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
