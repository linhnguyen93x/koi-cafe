import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  NativeModules,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import Immutable, { Map, fromJS } from 'immutable'
import { Actions } from "react-native-router-flux";
import registerForPushNotificationsAsync from "../utils/PushNotificationUtils";
import Expo, { Notifications, AppLoading } from "expo";
import { Colors, globalStyle } from "../style";
import { FontAwesome as Icon } from "@expo/vector-icons";
import * as language from "../language";
import * as AppConstants from "../utils/AppConstans";

const NetworkInfo = NativeModules.NetworkInfo;

var _notificationSubscription;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: {},
      token: "",
      user: null
    };
  }

  componentWillMount() {
    this._getUser();

    NetworkInfo.getIPAddress(
      err => {
        console.log(err);
      },
      ip => {
        Actions.refresh({ title: ip });
        console.log(ip);
      }
    );

    // registerForPushNotificationsAsync();
    //
    // let newToken = Notifications.getExponentPushTokenAsync().then(item => {
    //   this.setState({
    //     token: item
    //   });
    // });
    //
    // // Handle notifications that are received or selected while the app
    // // is open. If the app was closed and then opened by tapping the
    // // notification (rather than just tapping the app icon to open it),
    // // this function will fire on the next tick after the app starts
    // // with the notification data.
    // _notificationSubscription = Notifications.addListener(
    //   this._handleNotification
    // );
  }

  _getUser = async () => {
    let user = JSON.parse(await AsyncStorage.getItem("user"));

    this.setState({
      ...this.state,
      user
    });
  };

  _handleNotification = notification => {
    this.setState({ notification: notification });
  };

  _bindViewRole = () => {
    let functionByRole = [];

    if (
      this.state.user.ChucVu.toUpperCase().trim() ===
      AppConstants.ROLE_CAN_BO_TIEM
    ) {
      functionByRole = [
        {
          key: 0,
          text: language.get("update_ip"),
          image: require("../../assets/icons/update_ip.png"),
          type: "updateIp"
        },
        {
          key: 1,
          text: language.get("view_list_employee"),
          image: require("../../assets/icons/view_list.png"),
          type: "listEmployee"
        },
        {
          key: 2,
          text: language.get("request_off"),
          image: require("../../assets/icons/request_leave.png"),
          type: "request_off"
        }
      ];
    } else if (
      this.state.user.ChucVu.toUpperCase().trim() ===
      AppConstants.ROLE_NHAN_VIEN
    ) {
      functionByRole = [
        {
          key: 0,
          text: language.get("checkIn_checkOut"),
          image: require("../../assets/icons/update_ip.png"),
          type: "checkInOut"
        },
        {
          key: 1,
          text: language.get("employee_info"),
          image: require("../../assets/icons/view_list.png"),
          type: "employeeInfo"
        }
      ];
    }
    return functionByRole;
  };

  _itemSelected = type => {
    switch (type) {
      case "listEmployee":
        Actions.employeeList();

        break;
      case "checkInOut":
        Actions.checkInOut();
        break;
      case "employeeInfo":
        Actions.employeeMenu({
          title: this.state.user.HoTen,
          item: Map(this.state.user)
        });
        break;
      default:
    }
  };

  render() {
    if (this.state.user == null) {
      return <AppLoading />;
    }

    let functionByRole = this._bindViewRole();

    return (
      <Image
        style={[
          styles.imgContainer,
          globalStyle.container,
          globalStyle.mainPaddingTop
        ]}
        source={require("../../assets/backgrounds/main_bg.png")}
        resizeMode={Image.resizeMode.cover}
      >
        {functionByRole.map(item => {
          return (
            <TouchableOpacity
              style={{ alignSelf: "stretch" }}
              key={item.key}
              onPress={() => this._itemSelected(item.type)}
              activeOpacity={0.5}
            >
              <View style={styles.bgItem}>
                <Image
                  style={styles.icon}
                  source={item.image}
                  resizeMode="cover"
                />
                <Text style={styles.menuText}>
                  {item.text}
                </Text>
                <Icon
                  style={styles.arrow}
                  name="chevron-right"
                  size={25}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          );
        })}

      </Image>
    );
  }
}

// Css for each view
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imgContainer: {
    width: undefined,
    height: undefined,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
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
    resizeMode: "contain"
  },
  title: {
    color: "white",
    textAlign: "center",
    paddingBottom: 8,
    fontSize: 20,
    fontWeight: "bold"
  },
  bgItem: {
    flexDirection: "row",
    backgroundColor: Colors.colorPrimaryDark,
    alignSelf: "stretch",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    marginVertical: 2
  },
  icon: {
    width: 40,
    height: 40
  },
  menuText: {
    flex: 1,
    color: "white",
    marginHorizontal: 8
  },
  arrow: {
    marginTop: 4
  }
});

export default Home;
