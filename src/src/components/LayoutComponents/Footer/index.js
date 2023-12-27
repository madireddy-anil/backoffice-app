import React from 'react'
// import { Button } from 'antd'
import styles from './style.module.scss'

const Footer = () => (
  <div className={styles.footer}>
    <div className={styles.inner}>
      <div className="row" />
      <div className={styles.bottom}>
        <div className="row">
          <div className="col-sm-12">
            <div className={styles.copyright}>
              <img
                src="resources/images/logo_square-mobile.svg"
                rel="noopener noreferrer"
                alt="Payconstruct"
              />
              <span>
                © 2020{' '}
                <a href="https://payconstruct.com/" target="_blank" rel="noopener noreferrer">
                  Payconstruct
                </a>
                <br />
                All rights reserved
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Footer
