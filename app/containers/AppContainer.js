import React, { Component } from "react";
import ReactNative from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ActionCreators } from "../actions";
import { Router, Scene, Reducer, Actions } from "react-native-router-flux";
import * as Constants from "./Constant";
import Icon from "react-native-vector-icons/FontAwesome";
import { Color, globalStyle } from "../style";
import Api from "../libs/api";
import KoiApi from "../libs/koiApi";
import Permissions from "react-native-permissions";
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

const {
  ActivityIndicator,
  AsyncStorage,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
  Platform,
  Alert,
  NetInfo
} = ReactNative;

const RouterWithRedux = connect()(Router);

// Create home menu on navbar
var createRightButton = function() {
  return (
    <TouchableOpacity onPress={() => Actions.home({ type: "reset" })}>
      <View style={{ marginRight: 8 }}>
        <Icon name="home" size={20} color="white" />
      </View>
    </TouchableOpacity>
  );
};

class AppContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasToken: false,
      isLoaded: false
    };
  }

  componentWillMount() {
    this.getSetting();
  }

  componentDidMount() {
    this._trackLocation();


    NetInfo.isConnected.fetch().then(isConnected => {
      // console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      this._handleShowMessage(isConnected);
    });

    NetInfo.isConnected.addEventListener(
      'change',
      this.handleFirstConnectivityChange.bind(this)
    );

  }

  _handleShowMessage = isConnected => {
    if (!isConnected) {
      MessageBarManager.showAlert({
        title: '',
        message: 'Vui lòng kiểm tra kết nối mạng để tiếp tục...',
        alertType: 'error',
        shouldHideAfterDelay: false,
        shouldHideOnTap: false,
        position: 'bottom',
        // See Properties section for full customization
        // Or check `index.ios.js` or `index.android.js` for a complete example
      });
    } else {
      MessageBarManager.hideAlert();
    }
  }

  handleFirstConnectivityChange(isConnected) {
    this._handleShowMessage(isConnected);
    NetInfo.isConnected.removeEventListener(
      'change',
      this.handleFirstConnectivityChange.bind(this)
    );
  }

  _trackLocation = async () => {
    let status = await Permissions.requestPermission("location");
    if (status !== "authorized") {
      Alert.alert(
        'Thông báo',
        'ứng dụng chưa được cấp quyền lấy vị trí người dùng',
        [
          { text: 'Xác nhận', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      )
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.props.setLocation(position);
      },
      (error) => { },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.props.setLocation(position);
      },
      (error) => { },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
  }

  async getSetting() {
    var tokenId = await AsyncStorage.getItem("id_token");
    var user = await AsyncStorage.getItem("user");

    if (tokenId != null && user != null && user.length > 0) {
      user = JSON.parse(user);
      Api.setToken(tokenId).then(item => {
        this.setState({
          ...this.state,
          hasToken: tokenId !== null,
          isLoaded: true
        });
      });

    } else {
      this._getEmployeeInfo();
    }
  }

  _getEmployeeInfo = () => {
    this.props.fetchEmployeeList().then(() => {
      if (
        this.props.employeeList.get("data") != null &&
        this.props.employeeList.get("data").count() > 0
      ) {
        let userLogin = this.props.employeeList
          .get("data")
          .first()
          .toJS();
        AsyncStorage.setItem("user", JSON.stringify(userLogin));
      }
      this.setState({
        ...this.state,
        isLoaded: true
      });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
    NetInfo.isConnected.removeEventListener('change', this.handleFirstConnectivityChange.bind(this));
  }

  render() {
    if (!this.state.isLoaded && !this.props.employeeList.get('isLoading')) {
      return <ActivityIndicator />;
    }

    return (
      <RouterWithRedux
        {...this.props}
        animationStyle={animationStyle}
        duration={0.5}
        navigationBarStyle={styles.navBarLogin}
        titleStyle={styles.navBarTitle}
        barButtonTextStyle={styles.barButtonTextStyle}
        barButtonIconStyle={styles.barButtonIconStyle}
        leftButtonStyle={styles.leftButtonStyle}
        renderRightButton={createRightButton}
        onRight={() => { }}
        drawerImage={require("../../assets/icons/menu_burger_white.png")}
      >
        <Scene key="drawer" component={Constants.NavigationDrawer} open={true}>
          <Scene key="root">
            <Scene
              key="login"
              component={Constants.Login}
              initial={!this.state.hasToken}
              title="Login"
              onRight={null}
              hideNavBar={true}
              renderRightButton={() => {
                return <View />;
              }}
            />
            <Scene
              key="home"
              component={Constants.Home}
              title="Home"
              initial={this.state.hasToken}
            />
            <Scene
              key="employeeList"
              component={Constants.EmployeeList}
              title="Danh sách nhân viên"
            />
            <Scene
              key="employeeMenu"
              component={Constants.EmployeeMenu}
              title="Danh sách nhân viên"
            />
            <Scene
              key="personalInfo"
              component={Constants.PersonalInfo}
              title="Trang cá nhân"
            />
            <Scene
              key="checkInOut"
              component={Constants.CheckInOut}
              title="Check In/Check out"
            />
            <Scene
              key="detailSalary"
              component={Constants.DetailSalary}
              title="Chi tiết bảng lương"
            />
            <Scene
              key="workSheet"
              component={Constants.WorkSheet}
              title="Ca làm việc"
            />
            <Scene
              key="historyCheckIn"
              component={Constants.HistoryCheckIn}
              title="Dữ liệu chấm công"
            />
            <Scene
              key="resultChecking"
              component={Constants.ResultChecking}
              title="Kết quả kiểm tra"
            />
            <Scene
              key="userChecked"
              component={Constants.UserChecked}
              title="Lịch sử check in/out"
            />
          </Scene>
        </Scene>
      </RouterWithRedux>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: Colors.colorPrimary
  },
  navBarLogin: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent"
  },
  navBarTitle: {
    color: "#FFFFFF"
  },
  barButtonTextStyle: {
    color: "#FFFFFF"
  },
  barButtonIconStyle: {
    tintColor: "rgb(255,255,255)"
  }
});

const animationStyle = props => {
  const { layout, position, scene } = props;

  const direction = scene.navigationState && scene.navigationState.direction
    ? scene.navigationState.direction
    : "horizontal";

  const index = scene.index;
  const inputRange = [index - 1, index, index + 1];
  const width = layout.initWidth;
  const height = layout.initHeight;

  const opacity = position.interpolate({
    inputRange,
    //default: outputRange: [1, 1, 0.3],
    outputRange: [1, 1, 0.5]
  });

  const scale = position.interpolate({
    inputRange,
    //default: outputRange: [1, 1, 0.95],
    outputRange: [1, 1, 1]
  });

  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case "horizontal":
      translateX = position.interpolate({
        inputRange,
        //default: outputRange: [width, 0, -10],
        outputRange: [width, 0, 0]
      });
      break;
    case "vertical":
      translateY = position.interpolate({
        inputRange,
        //default: outputRange: [height, 0, -10],
        outputRange: [height, 0, 0]
      });
      break;
  }

  return {
    opacity,
    transform: [{ scale }, { translateX }, { translateY }]
  };
};

class RootComponent extends Component {
  render() {
    return <View style={{ backgroundColor: 'transparent' }}></View>
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(state => {
  return {
    employeeList: state.employeeList,
  };
}, mapDispatchToProps)(AppContainer);
