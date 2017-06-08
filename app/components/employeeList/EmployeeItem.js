import React, { Component } from 'react'
import ReactNative from 'react-native'
import Expo, {

} from 'expo';
import { Colors, globalStyle } from '../../style'
import * as language from '../../language'
import { FontAwesome as Icon } from '@expo/vector-icons'

const {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity
} = ReactNative

class EmployeeItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <View style={styles.container}>
				<Image
					style={ styles.image } 
					source={{ uri: "https://s-media-cache-ak0.pinimg.com/236x/2e/56/a1/2e56a1d72c817e63bb74f6cb1b7636eb.jpg"}}
					resizeMode="contain" />
				<Text style={ styles.name }>{ this.props.item.get('HoTen') }</Text>
				<TouchableOpacity
					activeOpacity={.5}
					onPress={ () => {} }>
						<View style={ styles.button }>
							<Text style={ styles.text }>Chi tiết</Text>
						</View>
					</TouchableOpacity>
			</View>

	}
}

// Css for each view
const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 8
	},
	image: {
		width: 40,
		height: 40,
		borderRadius: 40
	},
	name: {
		flex: 1,
		color: 'white',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingHorizontal: 16
		
	},
	button: {
		backgroundColor: Colors.colorPrimaryDark
	},
	text: {
		color: 'white',
		paddingVertical: 4,
		paddingHorizontal: 8
	}
});

export default EmployeeItem