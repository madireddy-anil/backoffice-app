import React from 'react'
import { Result } from 'antd'
import { withRouter } from 'react-router-dom'

@withRouter
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  constructor(props) {
    super(props)
    const { history } = this.props

    history.listen(() => {
      const { hasError } = this.state
      if (hasError) {
        this.setState({
          hasError: false,
        })
      }
    })
  }

  componentDidCatch() {
    this.setState({
      hasError: true,
    })
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props
    if (hasError) {
      return (
        <div>
          <Result status="500" title="Oops ! " subTitle="Something went wrong, Please try later " />
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary
