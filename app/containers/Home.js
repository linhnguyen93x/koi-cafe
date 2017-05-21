import React, { Component } from 'react'
import { View, Text } from 'react-native'
import registerForPushNotificationsAsync from '../utils/PushNotificationUtils';
import Expo, {
  Notifications,
} from 'expo';

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
		return <View>
			<Text>{this.state.token}</Text>
		</View>
	}
}

export default Home