import React from 'react'
import styles from './style.module.scss'

const Spacer = props => {
  const { height, hideSmall, hideMedium, hideLarge, hideXLarge } = props

  const moduleStyle = {
    height,
  }

  return (
    <div
      className={`${styles.Spacer} ${hideSmall ? styles.hidesmall : ''} ${
        hideMedium ? styles.hidemedium : ''
      } ${hideLarge ? styles.hidelarge : ''} ${hideXLarge ? styles.hidexlarge : ''}`}
      style={moduleStyle}
    />
  )
}

export default Spacer
