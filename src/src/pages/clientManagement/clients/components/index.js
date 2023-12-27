import React, { Component } from 'react'
import _ from 'lodash'
import { Card, Button, Form, Tabs } from 'antd'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import Modal from 'components/customComponents/Modal'
// import {capitalize} from 'utilities/transformer'
import ViewCompanyInfo from './basicCompanyInfo/viewCompanyInfo'
import ViewProductInfo from './productInfo/viewProductInfo'
import ViewWebsiteInfo from './companyWebsites/viewWebsiteInfo'
import EditCompanyInfo from './basicCompanyInfo/editCompanyInfo'
import EditWebsiteInfo from './companyWebsites/editWebsiteInfo'
import EditProductInfo from './productInfo/editProductInfo'
import OnboardingCustomer from './onBoarding'

import { getClientManagementById } from '../../../../redux/clientManagement/actions'

import './style.scss'

const { TabPane } = Tabs

const mapStateToProps = ({ user, general, clientManagement }) => ({
  token: user.token,
  loading: clientManagement.loading,
  selectedAccountDetails: clientManagement.selectedAccountDetails,
  basicCompanyInfo: clientManagement.basicCompanyInfo,
  productInformation: clientManagement.productInformation,
  brands: general.brands,
  websiteInformation: clientManagement.companyWebsites,
  productsList: clientManagement.payconstructProducts,
  isClientManagementUpdated: clientManagement.isClientManagementUpdated,
  kycStatus: clientManagement.kycStatus,
})

@Form.create()
@connect(mapStateToProps)
class Clients extends Component {
  state = {
    textEmpty: '--',
    viewModal: false,
  }

  componentDidMount() {
    const { dispatch, match, token } = this.props
    const clientOrVendorId = match.params.id
    dispatch(getClientManagementById(clientOrVendorId, token))
    const payconstructDetails = {
      accessToken: token,
      productName: 'payconstruct',
    }
    dispatch({
      type: 'GET_PAYCONSTRUCT_PRODUCTS',
      payload: payconstructDetails,
    })
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (snapShot.isClientFetched) {
      this.getClientManagementList()
    }
  }

  getClientManagementList = () => {
    this.setState({ viewModal: false })
  }

  getSnapshotBeforeUpdate(prevProps) {
    const { isClientManagementUpdated } = this.props
    const isPropsUpdated = {
      isClientFetched: prevProps.isClientManagementUpdated !== isClientManagementUpdated,
    }
    return isPropsUpdated
  }

  showModal = () => {
    this.setState({
      viewModal: true,
    })
  }

  handleCloseModal = () => {
    this.setState({
      viewModal: false,
    })
  }

  getEditModules = () => {
    const { viewModal } = this.state
    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="Basic Information" key="1">
          <EditCompanyInfo viewModal={viewModal} closeModalPopup={this.handleCloseModal} />
        </TabPane>
        <TabPane tab="Company Websites" key="2">
          <EditWebsiteInfo closeModalPopup={this.handleCloseModal} />
        </TabPane>
        <TabPane tab="Product Information" key="3">
          <EditProductInfo closeModalPopup={this.handleCloseModal} />
        </TabPane>
      </Tabs>
    )
  }

  render() {
    const {
      // loading,
      basicCompanyInfo,
      productInformation,
      websiteInformation,
      kycStatus,
      brands,
    } = this.props
    const { textEmpty, viewModal } = this.state

    return (
      <React.Fragment>
        <Modal
          modalType="Edit Company"
          modalView={viewModal}
          modalWidth={600}
          modalDescription={this.getEditModules()}
          className="editModulePage"
        />
        <Card
          title={
            <div className="cardHeader">
              <span className="companyHeaderTitle">
                {basicCompanyInfo.registeredCompanyName !== undefined &&
                  basicCompanyInfo.registeredCompanyName}
              </span>
              <span className="ml-3">
                <span>
                  <img src="resources/images/avatar1.png" alt="avatar1Image" />
                </span>
                <span>
                  <img src="resources/images/avatar2.png" alt="avatar2Image" />
                </span>
                <span>
                  <img src="resources/images/avatar3.png" alt="avatar3Image" />
                </span>
                <span>
                  <img src="resources/images/avatar4.png" alt="avatar4Image" />
                </span>
                <span>
                  <img src="resources/images/Circle.png" alt="circleImage" />
                </span>
                <Button className="riskLabelHeader">
                  <span className="riskLabel">KYC&nbsp;{_.startCase(_.camelCase(kycStatus))}</span>
                </Button>
              </span>
            </div>
          }
          bordered={false}
          headStyle={{
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
          bodyStyle={{
            padding: '25px 25px 0',
            borderBottomRightRadius: '10px',
            borderBottomLeftRadius: '10px',
          }}
          extra={
            <div>
              <Button onClick={this.showModal} style={{ borderRadius: '16px' }}>
                <span className="editLabel">Edit </span>
                <span className="editVector">
                  <img src="resources/images/Vector.png" alt="VectorImage" />
                </span>
              </Button>
            </div>
          }
        >
          <Helmet title="Merchant 123 LTD" />
          <Card
            style={{ borderRadius: '18px' }}
            bodyStyle={{
              paddingBottom: '0px',
            }}
          >
            <div>
              <ViewCompanyInfo basicCompanyInfo={basicCompanyInfo} />
            </div>
          </Card>
          <Card bordered={false} style={{ marginBottom: '-34px', marginTop: '10px' }}>
            <div className="row">
              <div className="col-md-8 col-lg-7">
                <p className="productInfo">Product Information</p>
              </div>
              <div className="col-md-4 col-lg-4">
                <p className="companySite">Company Websites</p>
              </div>
            </div>
          </Card>
          <Card bordered={false}>
            <div className="row">
              <div className="col-md-8 col-lg-7" style={{ padding: '0px' }}>
                <div className="productInfoSubject">
                  <ViewProductInfo productInformation={productInformation} brands={brands} />
                </div>
              </div>
              <div className="col-md-4 col-lg-5" style={{ padding: '0px' }}>
                <div className="webSiteSubject">
                  {websiteInformation.length > 0 ? (
                    <ViewWebsiteInfo websiteInformation={websiteInformation} />
                  ) : (
                    textEmpty
                  )}
                </div>
              </div>
            </div>
          </Card>
          <div>
            <OnboardingCustomer />
          </div>
        </Card>
      </React.Fragment>
    )
  }
}

export default Clients
