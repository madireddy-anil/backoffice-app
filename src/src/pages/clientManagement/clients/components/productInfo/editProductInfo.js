import React, { Component } from 'react'
import { Form, Modal } from 'antd'
import { connect } from 'react-redux'

import DynamicForm from 'components/customComponents/Form'

import { updateClientManagement } from 'redux/clientManagement/actions'

const { confirm } = Modal

const mapStateToProps = ({ user, clientManagement }) => ({
  token: user.token,
  loading: clientManagement.loading,
  id: clientManagement.entityId,
  productInformation: clientManagement.productInformation,
  productsList: clientManagement.payconstructProducts,
  isClientManagementUpdated: clientManagement.isClientManagementUpdated,

  selectedPayconstructProducts: clientManagement.selectedPayconstructProducts,
})

@Form.create()
@connect(mapStateToProps)
class EditProductInfo extends Component {
  state = {
    unUsed: false,
    viewForm: true,
    isProductChanged: false,
  }

  payConstructProducts = payProducts => {
    const allPayProdcuts = []
    if (payProducts !== undefined) {
      payProducts.map(item => {
        const structureData = {
          id: item.products.product,
          label: item.products.label,
          value: item.products.productCode,
        }
        allPayProdcuts.push(structureData)
        return structureData
      })
    }
    return allPayProdcuts
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
        insidethis.handleUpdateProductInfo()
      },
      onCancel() {},
    })
  }

  handleUpdateProductInfo = () => {
    const { form, dispatch, id, token, productsList } = this.props
    const selectedProducts = []
    form.validateFields((error, values) => {
      if (!error) {
        if (values.products.length > 0) {
          values.products.map(selectedProduct => {
            const filterObj = productsList.find(
              products => products.products.productCode === selectedProduct,
            )
            /* eslint-disable */
            return selectedProducts.push(filterObj?.products['_id'])
          })
        }
        const data = {
          requiredProduct: selectedProducts,
        }
        const dataCheck = selectedProducts.length > 0
        if (dataCheck) {
          dispatch(updateClientManagement(id, data, token))
        }
      }
    })
  }

  handleSelectedProduct = data => {
    if (data) {
      this.setState({ isProductChanged: true })
    }
  }

  render() {
    const { unUsed, viewForm, isProductChanged } = this.state
    const {
      form,
      productsList,
      selectedPayconstructProducts,
      loading,
      closeModalPopup,
    } = this.props

    if (unUsed) {
      console.log(isProductChanged, 'unused')
    }
    return (
      <React.Fragment>
        <DynamicForm
          formData={[
            {
              id: 1,
              label: 'Brand',
              fieldName: 'brandData',
              inputType: 'input',
              required: true,
              isDisabled: true,
              initialValue: 'Payperform',
            },
            {
              id: 2,
              label: 'Products',
              fieldName: 'products',
              inputType: 'select',
              mode: 'multiple',
              required: true,
              initialValue: selectedPayconstructProducts,
              data: this.payConstructProducts(productsList),
              selectOnChange: this.handleSelectedProduct,
            },
            // {
            //   id: 3,
            //   label: 'Sub-Product',
            //   fieldName: 'subProduct',
            //   inputType: 'select',
            //   required: true,
            //   initialValue: !isProductChanged
            //     ? subproducts.length > 0 && subproducts.subproduct
            //     : '',
            //   data: subproducts,
            // },
          ]}
          loader={loading}
          formProps={form}
          viewForm={viewForm}
          mainLoader={false}
          loading={loading}
          handelCancel={closeModalPopup}
          onSubmitForm={this.onPopUpMessage}
        />
      </React.Fragment>
    )
  }
}

export default EditProductInfo
