import React, { Component } from 'react';
import ReactNative from 'react-native';
import Colors from '../../style/colors';
import * as language from '../../language';

const { Text, View, Image } = ReactNative;

class NoData extends Component {
  render() {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            padding: 8,
            backgroundColor: 'transparent',
            color: Colors.text_secondary,
            fontSize: 14
          }}
        >
          {language.get('no_data')}
        </Text>
      </View>
    );
  }
}

export default NoData;
