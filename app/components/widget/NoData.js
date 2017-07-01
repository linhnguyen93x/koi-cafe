import React, { Component } from 'react'
import ReactNative from 'react-native'
import Colors from '../../style/colors'

const {
	Text,
	View,
	Image
} = ReactNative

class NoData extends Component {
	render() {
		return (
			<View style={ { alignItems: 'center' } }>
				<Text style={ { padding: 8, color: Colors.text_secondary, fontSize: 14 } }>Chưa có dữ liệu.</Text>
			</View>
		);
	}
}

export default NoData