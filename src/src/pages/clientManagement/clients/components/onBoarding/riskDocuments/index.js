import React, { Component } from 'react'
import OnBoardingSignOff from './onBoardingSignOff'
import RiskInformationGeneral from './riskInfoGeneral'
import RiskInformationDocments from './riskInfoDocuments'
// import RiskInformationQuestions from './riskInfoQuestions'
import RiskInformationPeople from './riskInfoPeople'
// import OnBoardingSpotChecking from './onBoardingSpotChecking'
import ApplicationApproval from './applicationApproval'

class RiskDocuments extends Component {
  handleonChangeCollapse = () => {
    // console.log(e)
  }

  render() {
    return (
      <React.Fragment>
        <div className="mt-3">
          <OnBoardingSignOff />
        </div>
        <div className="mt-3">
          <RiskInformationGeneral />
        </div>
        <div className="mt-3">
          <RiskInformationDocments />
        </div>
        {/* <div className="mt-3">
          <RiskInformationQuestions />
        </div> */}
        <div className="mt-3">
          <RiskInformationPeople />
        </div>
        {/* <div className="mt-3">
          <OnBoardingSpotChecking />
        </div> */}
        <div className="mt-3">
          <ApplicationApproval />
        </div>
      </React.Fragment>
    )
  }
}

export default RiskDocuments
