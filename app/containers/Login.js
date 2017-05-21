import React, { Component } from 'react'
import ReactNative from 'react-native'
import SubmitLogin from '../components/SubmitLogin'
import * as language from '../language'
import { Colors, globalStyle } from '../style'

// All Component react for render view
const {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Image,
	TouchableHighlight,
	TextInput,
	Dimensions,
} = ReactNative

class Login extends Component {

	render() {
		return <Image style={[styles.imgContainer, globalStyle.container]}
			source={require('../../assets/backgrounds/main_bg.png')}
			resizeMode={Image.resizeMode.cover} >
			{/*Logo Section*/}
			<View style={[styles.contentSection, globalStyle.loginPaddingImage]}>
				<Image
					source={require('../../assets/icons/koi_logo.png')}
					style={styles.logo} />
			</View>

			<SubmitLogin {...this.props} />

			<View style={styles.container} />
		</Image>
	}
}

// Css for each view
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imgContainer: {
		width: undefined,
		height: undefined,
		backgroundColor: 'transparent',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	contentSection: {
		height: 200,
		width: 200,
		backgroundColor: Colors.koi_container,
		borderRadius: 100,
		padding: 15
	},
	wrapper: {
		paddingHorizontal: 40
	},
	logo: {
		height: 150,
		width: 150,
		resizeMode: "contain",
	},
	title: {
		color: 'white',
		textAlign: 'center',

		paddingBottom: 8,
		fontSize: 20,
		fontWeight: 'bold'
	}
});

export default Login