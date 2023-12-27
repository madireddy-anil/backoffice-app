import React, { Component } from 'react'

class ViewCompanyInfo extends Component {
  state = {
    textEmpty: '--',
  }

  render() {
    const { textEmpty } = this.state
    const { basicCompanyInfo } = this.props
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-6 col-lg-4">
            <div className="companyManagementInfo">
              <p className="companyTitle">Trading Name</p>
              <p className="companySubject">
                {basicCompanyInfo.tradingName ? basicCompanyInfo.tradingName : textEmpty}
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="companyManagementInfo">
              <p className="companyTitle">Company Number</p>
              <p className="companySubject">
                {basicCompanyInfo.companyNumber ? basicCompanyInfo.companyNumber : textEmpty}
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="companyManagementInfo">
              <p className="companyTitle">Company Incorporation</p>
              <p className="companySubject">
                {basicCompanyInfo.companyIncorporation.length > 0 &&
                basicCompanyInfo.companyIncorporation[0].country
                  ? basicCompanyInfo.companyIncorporation[0].country
                  : textEmpty}
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="companyManagementInfo">
              <p className="companyTitle">Industry</p>
              <p className="companySubject">
                {basicCompanyInfo.industry.length > 0 &&
                  basicCompanyInfo.industry
                    .map(item => {
                      const returnResp = !item.industryType ? textEmpty : item.industryType
                      return returnResp
                    })
                    .join('/')}
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="companyManagementInfo">
              <p className="companyTitle">Industry Sub-Type</p>
              <div className="companySubject">
                <p>
                  {basicCompanyInfo.industry.length > 0 &&
                    basicCompanyInfo.industry[0] !== 'other' &&
                    basicCompanyInfo.industry[0].subType
                      .map(subType => {
                        const returnResp = !subType ? textEmpty : subType
                        return returnResp
                      })
                      .join('/')}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="companyManagementInfo">
              <p className="companyTitle">Other Industry</p>
              <p className="companySubject">
                {basicCompanyInfo.industry.length > 0 &&
                basicCompanyInfo.industry[0].industryType === 'other'
                  ? basicCompanyInfo.industry[0].comment
                  : textEmpty}
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="companyManagementInfo">
              <p className="companyTitle">Tier</p>
              <p className="companySubject">
                {basicCompanyInfo.tier ? basicCompanyInfo.tier : textEmpty}
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ViewCompanyInfo
