import React, { Component } from 'react'
import { Card } from 'antd'
import InitialVendorData from './components/initialVendorSetUp/addVendorData'

import styles from './style.module.scss'

class newVendorConfig extends Component {
  render() {
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">New Vendor Configuration</span>
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
          <InitialVendorData />
          {/* create button */}
        </Card>
      </React.Fragment>
    )
  }
}

export default newVendorConfig
