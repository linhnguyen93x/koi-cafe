import reducer from '../reducers'
import { createNavigationEnabledStore  } from '@expo/ex-navigation'
import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

let middleware = [
  thunkMiddleware,
  loggerMiddleware
]

const createStoreWithNavigation = createNavigationEnabledStore({
  createStore,
  navigationStateKey: 'navigation',
})

const initialState = {}

const Store = createStoreWithNavigation(
  reducer,
  initialState,
  compose(
    devtools(
      applyMiddleware(...middleware)
    )
  )
)

export default Store