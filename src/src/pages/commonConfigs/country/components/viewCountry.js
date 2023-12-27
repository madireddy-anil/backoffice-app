import React, { Component } from 'react'
import { Card, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import styles from '../style.module.scss'

const mapStateToProps = ({ user, currencies }) => ({
  token: user.token,
  selectedCountry: currencies.selectedCountry,
})

@connect(mapStateToProps)
class ViewCountry extends Component {
  state = {
    noData: '--',
  }

  navigateToEditCountry = () => {
    const { history } = this.props
    history.push('/edit-country')
  }

  onBackButtonHandler = () => {
    const { history } = this.props
    history.push('/countries')
  }

  formatNamingConvention = key => {
    let returnResp
    switch (key) {
      case 'high':
        returnResp = 'High'
        break
      case 'medium':
        returnResp = 'Medium'
        break
      case 'low':
        returnResp = 'Low'
        break
      case 'prohibited':
        returnResp = 'Prohibited'
        break
      default:
        break
    }
    return returnResp
  }

  render() {
    const { selectedCountry } = this.props
    const { noData } = this.state
    return (
      <React.Fragment>
        <Card
          title={
            <div>
              <span className="font-size-16">View Country Details</span>
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
              <Button type="link" className="pr-3" onClick={() => this.navigateToEditCountry()}>
                Edit
              </Button>
              <Button type="link" onClick={this.onBackButtonHandler}>
                Back
              </Button>
            </>
          }
        >
          <Helmet title="Country" />
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Country</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.name ? selectedCountry.name : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Alpha-2 Code</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.alpha2Code ? selectedCountry.alpha2Code : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Alpha-3 Code</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.alpha3Code ? selectedCountry.alpha3Code : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Numeric Code</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.numericCode ? selectedCountry.numericCode : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Telephone Prefix</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.telephonePrefix ? selectedCountry.telephonePrefix : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Deposits</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.deposits ? selectedCountry.deposits : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Fiat Currency</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.fiatCurrency ? selectedCountry.fiatCurrency : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Payments</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.payments ? selectedCountry.payments : noData}
                </span>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Medium Risk</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.riskCategory
                    ? this.formatNamingConvention(selectedCountry.riskCategory)
                    : noData}
                </span>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <strong className="font-size-15">Residency</strong>
              <div className="pb-4 mt-1">
                <span className="font-size-13">
                  {selectedCountry.sanction ? selectedCountry.residency : noData}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default ViewCountry
