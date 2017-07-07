/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import App from './main'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { NativeModules } from 'react-native';  

export default class Koi extends Component {
  render() {
    return (
      <App />
    );
  }
}


AppRegistry.registerComponent('Koi', () => Koi);
