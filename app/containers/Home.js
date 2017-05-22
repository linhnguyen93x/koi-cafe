import React, { Component } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import registerForPushNotificationsAsync from '../utils/PushNotificationUtils';
import Expo, {
  Notifications,
} from 'expo';
import { Colors, globalStyle } from '../style'

var _notificationSubscription;

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			notification: {},
			token: ""
		}
	}

	componentWillMount() {
		registerForPushNotificationsAsync();

		let newToken = Notifications.getExponentPushTokenAsync().then(item => {
			this.setState({
				token: item
			})
		});
		

		// Handle notifications that are received or selected while the app
		// is open. If the app was closed and then opened by tapping the
		// notification (rather than just tapping the app icon to open it),
		// this function will fire on the next tick after the app starts
		// with the notification data.
		_notificationSubscription = Notifications.addListener(this._handleNotification);
	}

	_handleNotification = (notification) => {
		this.setState({ notification: notification });
	};

	render() {
		return <Image style={[styles.imgContainer, globalStyle.container]}
			source={require('../../assets/backgrounds/main_bg.png')}
			resizeMode={Image.resizeMode.cover} >
			<View style={[globalStyle.mainMarginTop]}>
				<Text>{this.state.token}</Text>
			</View>

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

export default Home