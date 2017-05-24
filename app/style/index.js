import Colors  from './colors'
import ReactNative from 'react-native'
import Expo from 'expo'

const {
	StyleSheet,
	Platform
} = ReactNative

const statusBarHeight = Expo.Constants.statusBarHeight;

const globalStyle = StyleSheet.create({
	headerHeight: {
		paddingTop: Platform.OS === 'ios'? 64 : 54
	},
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	loginPaddingImage: {
		marginTop: Platform.OS === 'ios'? 80 : 70
	},
	mainMarginTop: {
		marginTop: Platform.OS === 'ios'? 64 : 54
	},
	mainPaddingTop: {
		paddingTop: Platform.OS === 'ios'? 64 : 54
	}
});

export {
	Colors,
	globalStyle
}

