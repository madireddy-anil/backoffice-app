import React from 'react'
import styles from './style.module.scss'

class PaymentTransaction extends React.Component {
  state = {
    income: false,
    name: '',
    info: '',
    footer: '',
  }

  componentWillMount() {
    this.getParams()
  }

  getParams = () => {
    const params = this.props
    this.setState({
      ...params,
    })
  }

  render() {
    const { income, name, footer, info } = this.state
    const { onClickCard } = this.props

    return (
      <a
        onClick={onClickCard}
        href=""
        className={`${styles.paymentTransaction} card card--withShadow ${
          income ? styles.income : ''
        }`}
      >
        <div className={styles.icon}>
          <i className={income ? 'icmn icmn-user' : 'icmn icmn-user'} />
        </div>
        {name && (
          <div>
            <span className={styles.name}>{name}</span>
            {info && <sup className={styles.info}>{info}</sup>}
          </div>
        )}
        {footer && <div className={styles.footer}>{footer}</div>}
      </a>
    )
  }
}

export default PaymentTransaction
