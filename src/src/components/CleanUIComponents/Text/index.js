import React from 'react'
import './text.scss'

export default function Text(props) {
  const { kind, size, weight, className, notranslate, style, children } = props

  return (
    <span
      className={`Text ${kind} ${size} ${className} ${weight}`}
      style={style}
      notranslate={notranslate ? '' : undefined}
    >
      {children}
    </span>
  )
}
