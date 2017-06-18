import React, { Component } from "react";
import { Constants, Location, Permissions } from "expo";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  Animated,
  NativeModules,
  Alert,
  ActivityIndicator
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Colors, globalStyle } from "../style";
import { FontAwesome as Icon } from "@expo/vector-icons";
import * as language from "../language";
import moment from "moment";
import vimoment from "moment/locale/vi";

const { width, height } = Dimensions.get("window");
const deviceLocale = language.getLocale();
const NetworkInfo = NativeModules.NetworkInfo;

class CheckInOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heightMenu: {
        height: null,
        width: null
      },
      time: moment().format("h:mm"),
      errorMessage: null,
      location: null,
      animatedValue: new Animated.Value(0),
      fadeValue: new Animated.Value(1),
      isChecking: false,
      macAddress: null,
      location: null,
      user: null
    };

    this._interval = null;
  }

  async componentWillMount() {
    moment.updateLocale("vi", vimoment);
    let user = JSON.parse(await AsyncStorage.getItem("user"));
    this.setState({user});

    /* actions/checkInOut */
    this.props.getUserOutlet(user.MaCuaHang).then(() => {
      if (!this.props.employeeOutletInfo.get("isError")) {
        this.props.getIpOutlet(this.props.employeeOutletInfo.get("data"));
      }
    });

    // Get Location
    this._getLocationAsync();

    // Get MAC address
    NetworkInfo.getMACAddress(
      err => {
        console.log(err);
      },
      mac => {
        this.setState({
          ...this.state,
          macAddress: mac
        });
      }
    );
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
      maximumAge: 60000
    });
    this.setState({ location });
  };

  onLayout(event) {
    const { x, y, height, width } = event.nativeEvent.layout;

    const newLayout = {
      height: height,
      width: width
    };

    this.setState({ heightMenu: newLayout });
  }

  componentDidMount() {
    Location.watchPositionAsync(
      {
        enableHighAccuracy: false,
        distanceInterval: 10000,
        timeInterval: 2000
      },
      location => {
        console.log(location);
      }
    );

    this._interval = setInterval(
      () => this.setState({ ...this.state, time: moment().format("h:mm") }),
      10000
    );
  }

  _checkIn = () => {
    this.setState({
      ...this.state,
      isChecking: true
    });

    /*Location*/
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._runAnimation();
      // Animated.timing(this.state.animatedValue, {
      //   toValue: 100,
      //   duration: 100
      // }).start();
      /* Get IP address */
      NetworkInfo.getIPAddress(
        err => {
          this.setState({
            ...this.state,
            isChecking: false
          });
          Alert.alert(
            "Thông báo",
            "Không thể lấy địa chỉ IP",
            [
              {
                text: "Xác nhận",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              }
            ],
            { cancelable: true }
          );
        },
        ip => {
          this.setState({
            ...this.state,
            isChecking: false
          });
          this.state.fadeValue.stopAnimation();
          if (!this.props.employeeOutletIps.get("isError")) {
            let ipContains = this.props.employeeOutletIps
              .get("data")
              .filter(item => {
                return item.get("ip") == ip;
              });

            if (ipContains.count() > 0) {
              if (this.state.location != null) {
                console.log(this.state.user.MaNV);
                console.log(Constants.deviceName);
                console.log(this.state.macAddress);
                console.log(
                  this.state.location.coords.latitude +
                    ", " +
                    this.state.location.coords.longitude
                );
              } else {
                Alert.alert(
                  "Thông báo",
                  "Không thể lấy vị trí của bạn. Vui lòng thử lại!",
                  [
                    {
                      text: "Xác nhận",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    }
                  ],
                  { cancelable: true }
                );
              }
            }
          } else {
            Alert.alert(
              "Thông báo",
              "IP check in không hợp lệ. Vui lòng liên hệ quản trị viên!",
              [
                {
                  text: "Xác nhận",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                }
              ],
              { cancelable: false }
            );
          }
        }
      );
    }
  };

  _runAnimation = () => {
    this.state.fadeValue.setValue(1);
    Animated.timing(this.state.fadeValue, {
      toValue: 0.4,
      duration: 1500
    }).start(e => {
      if (this.state.isChecking) {
        this._runAnimation();
      }
    });
  };

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    const borderRadius = this.state.heightMenu.width / 2;
    const checkLayout = {
      borderRadius: borderRadius
    };
    const interpolatedColorAnimation = this.state.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [Colors.colorPrimaryDark, "rgba(51,156,177, 1)"]
    });

    if (this.state.user == null) {
      return <ActivityIndicator />;
    }

    return (
      <Image
        style={[
          styles.container,
          globalStyle.imgContainer,
          globalStyle.mainPaddingTop
        ]}
        source={require("../../assets/backgrounds/main_bg.png")}
        resizeMode={Image.resizeMode.cover}
      >
        {/*Logo Section*/}
        <View style={[styles.contentSection]}>
          <Text style={styles.name}>{this.state.time}</Text>
          <Text style={styles.role}>
            {this.props.employeeOutletInfo.get("data") != null
              ? moment(new Date()).format("ll") +
                  ", " +
                  this.props.employeeOutletInfo.get("data").tencuahang
              : ""}
          </Text>
        </View>
        <View
          style={[styles.menuContainer]}
          onLayout={event => {
            this.onLayout(event);
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: Colors.colorPrimaryDark,
              borderRadius: borderRadius,
              padding: 16
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                this._checkIn();
              }}
            >
              <Animated.View
                style={{
                  backgroundColor: interpolatedColorAnimation,
                  opacity: this.state.fadeValue,
                  width: this.state.heightMenu.width - 36,
                  height: this.state.heightMenu.width - 36,
                  borderRadius: borderRadius,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: 32,
                    fontWeight: "bold"
                  }}
                >
                  CHECK{"\n"}IN
                </Text>
              </Animated.View>
            </TouchableOpacity>

          </View>

        </View>
      </Image>
    );
  }
}

// Css for each view
const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between"
  },
  contentSection: {
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "transparent"
  },
  logo: {
    height: 150,
    width: 150,
    borderRadius: 75,
    resizeMode: "contain"
  },
  name: {
    backgroundColor: "transparent",
    color: "white",
    fontSize: 96,
    fontWeight: "bold"
  },
  role: {
    color: "white",
    fontSize: 16
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 48
  },
  menu: {
    justifyContent: "space-around",
    alignItems: "center",
    width: width / 2 - 28,
    backgroundColor: Colors.colorPrimaryDark,
    margin: 2
  }
});

function mapStateToProps(state) {
  return {
    employeeOutletIps: state.employeeOutletIps,
    employeeOutletInfo: state.employeeOutletInfo
  };
}

export default connect(mapStateToProps)(CheckInOut);
