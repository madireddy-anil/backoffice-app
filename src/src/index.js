import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { logger } from 'redux-logger'
import thunk from 'redux-thunk'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import { routerMiddleware } from 'connected-react-router'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { createHashHistory } from 'history'
import reducers from 'redux/reducers'
import sagas from 'redux/sagas'
import Router from 'router'
import Localization from 'components/LayoutComponents/Localization'
import storage from 'redux-persist/es/storage'
import * as serviceWorker from './serviceWorker'

// app styles
import './global.scss'

const history = createHashHistory()
const sagaMiddleware = createSagaMiddleware()
const routeMiddleware = routerMiddleware(history)
const middlewares = [thunk, sagaMiddleware, routeMiddleware]

if (process.env.REACT_APP_ENVIRONMENT === 'development' && true) {
  middlewares.push(logger)
}

const migrations = {
  0: state => {
    // migration clear out device state
    return {
      ...state,
      device: undefined,
    }
  },
  1: state => {
    // migration to keep only device state
    return {
      device: state.device,
    }
  },
}

const persistConfig = {
  key: 'primary',
  version: 0,
  storage,
  migrate: createMigrate(migrations, { debug: true }),
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(persistedReducer, compose(applyMiddleware(...middlewares)))
sagaMiddleware.run(sagas)

const persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Localization>
        <Router history={history} />
      </Localization>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
)

serviceWorker.unregister()
export { store, history }
