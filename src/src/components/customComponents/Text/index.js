import React, { Component } from 'react'
import './style.scss'

class Text extends Component {
  render() {
    const { kind, size, weight, className, notranslate, style, children } = this.props
    return (
      <React.Fragment>
        <span
          className={`Text ${kind} ${size} ${className} ${weight}`}
          style={style}
          notranslate={notranslate ? '' : undefined}
        >
          {children}
        </span>
      </React.Fragment>
    )
  }
}

export default Text
