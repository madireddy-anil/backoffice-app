import React from 'react'
import CryptoTransactions from '..'

export default class OtcComponent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <CryptoTransactions type="otc" />
      </React.Fragment>
    )
  }
}
