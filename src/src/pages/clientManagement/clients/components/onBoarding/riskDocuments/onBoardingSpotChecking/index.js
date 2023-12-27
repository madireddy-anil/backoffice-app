import React, { Component } from 'react'
import DynamicCollapse from 'components/customComponents/Collapse'
import Text from 'components/customComponents/Text'

import styles from './style.module.scss'

class OnBoardingSpotChecking extends Component {
  state = {
    isCollapseActive: false,
  }

  panelTitle = (
    <div className={styles.panel__header}>
      <Text size="default">Onboarding Spot check submission</Text>
    </div>
  )

  generalQualificationQus = () => {
    return (
      <>
        <p>Coming Soon... </p>
      </>
    )
  }

  handleonChangeCollapse = () => {
    // console.log(e)
  }

  render() {
    const { isCollapseActive } = this.state
    return (
      <React.Fragment>
        <div
          className={
            isCollapseActive ? 'collapse__block__active mt-2' : 'collapse__block_inactive mt-2'
          }
        >
          <DynamicCollapse
            panelHeadTitle={this.panelTitle}
            panelData={this.generalQualificationQus()}
            handleonChangeCollapse={this.handleonChangeCollapse()}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default OnBoardingSpotChecking
