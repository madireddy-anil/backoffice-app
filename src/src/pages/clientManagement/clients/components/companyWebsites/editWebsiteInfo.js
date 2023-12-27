import React, { Component } from 'react'
import { Form, Modal } from 'antd'
import { connect } from 'react-redux'

import { updateClientManagement } from 'redux/clientManagement/actions'

import DynamicForm from 'components/customComponents/Form'

const { confirm } = Modal

const mapStateToProps = ({ user, clientManagement }) => ({
  token: user.token,
  loading: clientManagement.loading,
  id: clientManagement.entityId,
  websiteInformation: clientManagement.companyWebsites,
  isClientManagementUpdated: clientManagement.isClientManagementUpdated,
})

@Form.create()
@connect(mapStateToProps)
class EditWebsiteInfo extends Component {
  state = {
    viewForm: true,
  }

  onPopUpMessage = e => {
    e.preventDefault()
    const insidethis = this
    confirm({
      title: 'Are you sure Save?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        insidethis.handleUpdateWebsiteInfo()
      },
      onCancel() {},
    })
  }

  handleUpdateWebsiteInfo = () => {
    const { form, dispatch, id, token } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const { website } = values
        const webSiteAddress = website.filter(x => x != null)
        const genericInformation = {
          websiteAddress: webSiteAddress,
        }
        dispatch(updateClientManagement(id, { genericInformation }, token))
      }
    })
  }

  getModalDescription = () => {
    return <div>test</div>
  }

  render() {
    const { viewForm } = this.state
    const { form, loading, closeModalPopup, websiteInformation } = this.props
    return (
      <React.Fragment>
        <DynamicForm
          formData={[
            {
              id: 1,
              label: 'Website',
              fieldName: 'website',
              inputType: 'formlist',
              placeholder: 'https://',
              prefix: <img src="resources/images/website.png" alt="website" />,
              name: 'website',
              btnLabel: 'Add Website',
              initialKey: websiteInformation,
            },
          ]}
          formProps={form}
          viewForm={viewForm}
          mainLoader={false}
          loader={loading}
          handelCancel={closeModalPopup}
          onSubmitForm={this.onPopUpMessage}
        />
      </React.Fragment>
    )
  }
}

export default EditWebsiteInfo
