import React, { Component } from 'react'
import { Card } from 'antd'
import InitialPricingData from './components/initialPricingProfileSetup'

import styles from './style.module.scss'

class newPricingProfile extends Component {
  render() {
    return (
      <Card
        title={
          <div>
            <span className="font-size-16">New Pricing Profile</span>
          </div>
        }
        bordered
        headStyle={{
          //   border: '1px solid #a8c6fa',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
        bodyStyle={{
          padding: '30px',
          //   border: '1px solid #a8c6fa',
          borderBottomRightRadius: '10px',
          borderBottomLeftRadius: '10px',
        }}
        className={styles.mainCard}
      >
        <InitialPricingData />
        {/* create button */}
      </Card>
    )
  }
}

export default newPricingProfile
