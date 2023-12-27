import React, { Component } from 'react'
import { Card, Button, Form, Tag } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import lodash from 'lodash'

import styles from '../style.module.scss'

const mapStateToProps = ({ user, paymentProcessFlow }) => ({
  token: user.token,
  selectedProcessFlow: paymentProcessFlow.selectedProcessFlow,
})

@Form.create()
@connect(mapStateToProps)
class ViewPaymentFlow extends Component {
  state = {
    noData: '--',
  }

  navigateToEditCurrency = () => {
    const { history } = this.props
    history.push('/edit-payment-process-flow')
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/payment-order-list')
  }

  render() {
    const { selectedProcessFlow } = this.props
    const { noData } = this.state
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">View Process Flow Details</span>
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
              <div className="col-md-6 col-lg-4">
                <strong className="font-size-15">Procees Flow</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedProcessFlow.processFlow
                      ? lodash.startCase(selectedProcessFlow.processFlow)
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <strong className="font-size-15">Call Function</strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedProcessFlow.callFunction
                      ? lodash.startCase(selectedProcessFlow.callFunction)
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <strong className="font-size-15">Exit Status Code </strong>
                <div className="pb-4 mt-1">
                  <span className="font-size-13">
                    {selectedProcessFlow.exitStatusCode
                      ? selectedProcessFlow.exitStatusCode
                      : noData}
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <strong className="font-size-15">Status Pair </strong>
                <div className={styles.statusBlock}>
                  {selectedProcessFlow.status && selectedProcessFlow.status.length > 0
                    ? selectedProcessFlow.status.map(item => {
                        return (
                          <div className="pb-2" key={item.type}>
                            <Tag>
                              <span className="font-size-13">
                                {`${lodash.capitalize(item.type)} : ${lodash.capitalize(
                                  item.nextExitStatusCode,
                                )}`}
                              </span>
                            </Tag>
                          </div>
                        )
                      })
                    : ''}
                </div>
              </div>
            </div>
          </Form>
        </Card>
      </React.Fragment>
    )
  }
}

export default ViewPaymentFlow
