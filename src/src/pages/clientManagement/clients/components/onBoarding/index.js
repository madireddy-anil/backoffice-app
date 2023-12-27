import React, { Component } from 'react'
import { Tabs } from 'antd'
import RiskDocuments from './riskDocuments'
import OperationInformation from '../operationalInformation'
import TermsOfService from '../termsOfService'

import './style.scss'

const { TabPane } = Tabs
class OnboardingCustomer extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="onBoardingWrapper">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Risk &#38; Documentation" key="1">
              <div>
                <RiskDocuments />
              </div>
            </TabPane>
            <TabPane tab="Products Predictions" key="2">
              <OperationInformation />
            </TabPane>
            <TabPane tab="Terms of Service" key="3">
              <TermsOfService />
            </TabPane>
          </Tabs>
        </div>
      </React.Fragment>
    )
  }
}

export default OnboardingCustomer
