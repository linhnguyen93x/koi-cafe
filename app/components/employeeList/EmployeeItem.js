import React, { PureComponent } from 'react'
import ReactNative from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Colors, globalStyle } from '../../style'
import * as language from '../../language'
import Icon from 'react-native-vector-icons/FontAwesome';

const {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity
} = ReactNative

class EmployeeItem extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return <View style={styles.container}>
				<Image
					style={ styles.image }
					source={{ uri: "http://www.limestone.edu/sites/default/files/user.png"}}
					resizeMode="cover" />
				<Text style={ styles.name }>{ this.props.item.get('HoTen') }</Text>
				<TouchableOpacity
					activeOpacity={.5}
					onPress={ () => { Actions.employeeMenu({ item: this.props.item }) } }>
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
		height: 60,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 8
	},
	image: {
		width: 40,
		height: 40,
		borderRadius: 20
	},
	name: {
		flex: 1,
		color: 'white',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingHorizontal: 16,
        backgroundColor: "transparent"

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
