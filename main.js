import React, { Component } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReduxers, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { AppRegistry } from 'react-native'
import reducer from './app/reducers'
import AppContainer from './app/containers/AppContainer'
import { Actions } from 'react-native-router-flux'
import * as language from './app/language'
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

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

  constructor() {
    super();
  }

  componentDidMount() {
    MessageBarManager.registerMessageBar(this.refs.alert);
  }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
  }


  render() {

    return <Provider store={store}>
      <View style={{ flex: 1 }}>
        <AppContainer {...this.props} />
        <MessageBarAlert ref="alert" />
      </View>
    </Provider>
  }
}

export default App
