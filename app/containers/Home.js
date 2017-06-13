import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, TouchableNativeFeedback, NativeModules  } from 'react-native'
import { Actions } from 'react-native-router-flux'
import registerForPushNotificationsAsync from '../utils/PushNotificationUtils';
import Expo, {
	Notifications,
} from 'expo';
import { Colors, globalStyle } from '../style'
import { FontAwesome as Icon } from '@expo/vector-icons'
import * as language from '../language'

const NetworkInfo = NativeModules.NetworkInfo;

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
		NetworkInfo.getIPAddress( (err) => {
			console.log(err);
		}, 
		(ip) => {
			Actions.refresh({title: ip});
			console.log(ip);
		});

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
		return <Image style={[styles.imgContainer, globalStyle.container, globalStyle.mainPaddingTop]}
			source={require('../../assets/backgrounds/main_bg.png')}
			resizeMode={Image.resizeMode.cover} >
			<TouchableNativeFeedback
				onPress={this._onPressButton}
				background={TouchableNativeFeedback.SelectableBackground()}>
				<View style={styles.bgItem}>
					<Image
						style={styles.icon}
						source={require('../../assets/icons/update_ip.png')}
						resizeMode="cover" />
					<Text style={styles.menuText}>{language.get('update_ip')}</Text>
					<Icon style={styles.arrow} name="chevron-right" size={25} color="white" />
				</View>
			</TouchableNativeFeedback>
			<TouchableNativeFeedback
				onPress={() => Actions.employeeList()}
				background={TouchableNativeFeedback.SelectableBackground()}>
				<View style={styles.bgItem}>
					<Image
						style={styles.icon}
						source={require('../../assets/icons/view_list.png')}
						resizeMode="cover" />
					<Text style={styles.menuText}>{language.get('view_list_employee')}</Text>
					<Icon style={styles.arrow} name="chevron-right" size={25} color="white" />
				</View>
			</TouchableNativeFeedback>
			<TouchableNativeFeedback
				onPress={this._onPressButton}
				background={TouchableNativeFeedback.SelectableBackground()}>
				<View style={styles.bgItem}>
					<Image
						style={styles.icon}
						source={require('../../assets/icons/request_leave.png')}
						resizeMode="cover" />
					<Text style={styles.menuText}>{language.get('request_off')}</Text>
					<Icon style={styles.arrow} name="chevron-right" size={25} color="white" />
				</View>
			</TouchableNativeFeedback>


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
		justifyContent: 'center',
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
	},
	bgItem: {
		flexDirection: 'row',
		backgroundColor: Colors.colorPrimaryDark,
		alignSelf: 'stretch',
		justifyContent: 'space-around',
		alignItems: 'center',
		padding: 16,
		marginVertical: 2
	},
	icon: {
		width: 40,
		height: 40,
	},
	menuText: {
		flex: 1,
		color: 'white',
		marginHorizontal: 8
	},
	arrow: {
		marginTop: 4
	}
});

export default Home