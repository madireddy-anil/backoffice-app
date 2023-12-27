import React, { Fragment } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
import momentTZ from 'moment-timezone'
import Loader from 'components/LayoutComponents/Loader'

import PublicLayout from './Public'
import LoginLayout from './Login'
import MainLayout from './Main'

const Layouts = {
  public: PublicLayout,
  login: LoginLayout,
  main: MainLayout,
}

@withRouter
@connect(({ user, trade, settings, general }) => ({
  user,
  tradeId: trade.tradeId,
  timeZone: settings.timeZone.value,
  loginUrl: user.loginUrl,
  isMFAset: user.isMFAset,
  isCustomerLoading: general.isCustomerLoading,
  defaultLandingPage: general.defaultLandingPage,
  returnUrl: user.loginUrl,
}))
class IndexLayout extends React.PureComponent {
  previousPath = ''

  componentDidMount() {
    const { user, history } = this.props

    if (user.passwordResetPath) {
      history.push(user.passwordResetPath)
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    const { prevLocation } = prevProps
    if (location !== prevLocation) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    const {
      children,
      location: { pathname, search },
      user,
      timeZone,
      // isCustomerLoading,
      defaultLandingPage,
      returnUrl,
    } = this.props

    // Timezone Default
    momentTZ.tz.setDefault(timeZone)

    // NProgress Management
    const currentPath = pathname + search
    if (currentPath !== this.previousPath) {
      NProgress.start()
    }

    setTimeout(() => {
      NProgress.done()
      this.previousPath = currentPath
    }, 300)

    // Layout Rendering
    const getLayout = () => {
      if (pathname === '/') {
        return 'public'
      }
      if (/^\/user(?=\/|$)/i.test(pathname)) {
        return 'login'
      }
      return 'main'
    }

    const Container = Layouts[getLayout()]
    const isUserAuthorized = user.isLoggedIn
    const isUserLoading = user.loading
    const isLoginLayout = getLayout() === 'login'

    const BootstrappedLayout = () => {
      // show loader when user in check authorization process, not authorized yet and not on login pages
      if (isUserLoading && !isUserAuthorized && !isLoginLayout) {
        return <Loader />
      }

      // if (isCustomerLoading) {
      //   return <Loader />
      // }

      // redirect to login page if current is not login page and user not authorized
      if (!isLoginLayout && !isUserAuthorized) {
        return <Redirect to={returnUrl} />
      }
      // redirect to main dashboard when user on login page and authorized
      if (isLoginLayout && isUserAuthorized && defaultLandingPage) {
        return <Redirect to={defaultLandingPage} />
      }
      // in other case render previously set layout
      return <Container>{children}</Container>
    }

    return (
      <Fragment>
        <Helmet
          titleTemplate="PayConstruct - Architects in Payments | %s"
          title="PayConstruct - Architects in Payments"
        />
        {BootstrappedLayout()}
      </Fragment>
    )
  }
}

export default IndexLayout
