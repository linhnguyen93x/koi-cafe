import Expo from 'expo'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { AppRegistry } from 'react-native'
import reducer from './app/reducers'
import AppContainer from './app/containers/AppContainer'
import { Actions } from 'react-native-router-flux'
import { Permissions, Notifications } from 'expo';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ });

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
    ),    
  );

  return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

class App extends Component {
  
  render() {
   return <Provider store={store}>
        <AppContainer />
      </Provider>
    }
}

Expo.registerRootComponent(App);
