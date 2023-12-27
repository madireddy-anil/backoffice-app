import React, { Component } from 'react'
import { validateDataWithNoErrors } from '../../../../../utilities/transformer'

class ViewProductInfo extends Component {
  state = {
    textEmpty: '--',
  }

  render() {
    const { textEmpty } = this.state
    const { productInformation, brands } = this.props

    const filterBrands = () => {
      const brandData = validateDataWithNoErrors(productInformation, 'array').map(productbrand =>
        (brands || []).find(brand => brand.products.id === productbrand.id),
      )
      return brandData
    }

    const clientBrands = () => {
      const filterBrand = filterBrands()
      const key = 'brand'
      const arrayUniqueByKey = [
        ...new Map(filterBrand.map(item => [item.clientBrands[key], item])).values(),
      ].map(item => {
        return <div>{item.clientBrands.brand}</div>
      })
      return arrayUniqueByKey.length > 0 ? arrayUniqueByKey : textEmpty
    }

    const productBrands = () => {
      const filterBrand = filterBrands()
      const key = 'brand'
      const arrayUniqueByKey = [
        ...new Map(filterBrand.map(item => [item[key], item])).values(),
      ].map(item => {
        return <div>{item.brand}</div>
      })
      return arrayUniqueByKey.length > 0 ? arrayUniqueByKey : textEmpty
    }

    const products = () =>
      validateDataWithNoErrors(productInformation, 'array').map(productInfo =>
        !productInfo.product ? textEmpty : <div>{productInfo.product}</div>,
      )

    return (
      <React.Fragment>
        <div>
          <div>
            <p className="companyTitle">Client Brands</p>
            <div className="companySubject">{clientBrands()}</div>
          </div>
          <div>
            <p className="companyTitle">Product Brands</p>
            <div className="companySubject">{productBrands()}</div>
          </div>
          <div>
            <p className="companyTitle">Products</p>
            <div className="companySubject">{products()}</div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ViewProductInfo
