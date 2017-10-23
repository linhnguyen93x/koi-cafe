import React, { Component } from "react";
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
import Icon from "react-native-vector-icons/FontAwesome";
import * as language from "../language";
import moment from "moment";
import DeviceInfo from "react-native-device-info";
import vimoment from "moment/locale/vi";
import Permissions from "react-native-permissions";

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
    this.setState({ user });

    /* actions/checkInOut */
    this.props.getUserOutlet(user.MaCuaHang).then(() => {
      if (!this.props.employeeOutletInfo.get("isError")) {
        this.props.getIpOutlet(this.props.employeeOutletInfo.get("data"));
      } else {
        // Works on both iOS and Android
        Alert.alert(
          language.get("notice"),
          language.get("cannot_get_employee_info"),
          [{ text: language.get("ok"), onPress: () => Actions.pop() }],
          { cancelable: false }
        );
      }
    });

    /* actions/checkInOut */
    this.props.getCheckStatus(
      this.state.user.MaNV,
      moment(new Date()).format("YYYY-MM-DD")
    );

    // Get Location
    if (this.props.locationUser.get("location") != null) {
      this.setState({
        location: this.props.locationUser.get("location")
      });
    } else {
      this._getLocationAsync();
    }

    // Get MAC address
    if (Platform.OS === "ios") {
      NetworkInfo.getMACAddress((error, events) => {
        if (error) {
          console.error(error);
        } else {
          this.setState({
            ...this.state,
            macAddress: events
          });
        }
      });
    } else {
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
  }

  _getLocationAsync = async () => {
    let status = await Permissions.requestPermission("location");
    if (status !== "authorized") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ location: position });
      },
      error => {
        console.log(error);
        Alert.alert(
          language.get("notice"),
          language.get("cannot_get_position_try_again"),
          [
            {
              text: language.get("confirm"),
              onPress: () => Actions.pop(),
              style: "cancel"
            },
            { cancelable: true }
          ]
        );
      }
    );
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
    // Geolocation.watchPosition(
    //   location => {
    //     console.log(location);
    //   },
    //   {
    //     enableHighAccuracy: false,
    //     distanceInterval: 10000,
    //     timeInterval: 2000,
    //     timeout: 10000
    //   }
    // );

    this._interval = setInterval(
      () => this.setState({ ...this.state, time: moment().format("h:mm") }),
      10000
    );
  }

  _checkIn = () => {
    if (this.state.isChecking) {
      Alert.alert(language.get("waiting_system"));
    }

    this.setState({
      ...this.state,
      isChecking: true
    });

    /*Location*/

    this._runAnimation();
    /* Get IP address */
    fetch("http://checkin.koithe.vn/api/ip") //http://ipecho.net/plain
      .then(resp => {
        return resp.text();
      })
      .then(textResponse => {
        let ip = textResponse;

        if (ip != null) {
          Actions.refresh({ title: ip });
          this.setState({
            ...this.state,
            isChecking: false
          });
          if (!this.props.employeeOutletIps.get("isError")) {
            let ipContains = this.props.employeeOutletIps
              .get("data")
              .filter(item => {
                return item.get("ip").trim() == ip.trim();
              });

            if (ipContains.count() > 0) {
              if (this.state.location != null) {
                const submitLocation =
                  this.state.location.coords.latitude +
                  "," +
                  this.state.location.coords.longitude;

                this.props
                  .submitCheckInOut(
                    this.state.user.MaNV,
                    this.props.checkStatus.get("isCheckin") == null ||
                    this.props.checkStatus.get("isCheckin") == 0 ||
                    this.props.checkStatus.get("isCheckin") == 1
                      ? 1
                      : 2,
                    this.state.macAddress,
                    DeviceInfo.getBrand() + " " + DeviceInfo.getModel(),
                    submitLocation
                  )
                  .then(() => {
                    if (this.props.checkResponseStatus.get("isError")) {
                      Alert.alert(
                        language.get("notice"),
                        this.props.checkResponseStatus.get("data").error,
                        [
                          {
                            text: language.get("confirm"),
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          }
                        ],
                        { cancelable: true }
                      );
                    } else {
                      Alert.alert(
                        language.get("check_success"),
                        this.props.checkResponseStatus.get("data").InOutMode ==
                        1
                          ? language.get("check_in_at") +
                            this.props.checkResponseStatus.get("data").Time
                          : language.get("check_out_at") +
                            this.props.checkResponseStatus.get("data").Time,
                        [
                          {
                            text: language.get("confirm"),
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          }
                        ],
                        { cancelable: true }
                      );
                    }
                  });
                this.state.animatedValue.stopAnimation();
                this.state.fadeValue.setValue(1);
                this.state.fadeValue.stopAnimation();
              } else {
                Alert.alert(
                  language.get("notice"),
                  language.get("cannot_get_position_try_again"),
                  [
                    {
                      text: language.get("confirm"),
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { cancelable: true }
                  ]
                );
                this.state.animatedValue.stopAnimation();
                this.state.fadeValue.setValue(1);
                this.state.fadeValue.stopAnimation();
              }
            } else {
              Alert.alert(
                language.get("notice"),
                language.get("request_ip_admin"),
                [
                  {
                    text: language.get("confirm"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  }
                ],
                { cancelable: false }
              );
              this.state.animatedValue.stopAnimation();
              this.state.fadeValue.setValue(1);
              this.state.fadeValue.stopAnimation();
            }
          } else {
            Alert.alert(
              language.get("notice"),
              language.get("ip_not_valid"),
              [
                {
                  text: language.get("confirm"),
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                }
              ],
              { cancelable: false }
            );
          }
        }
      })
      .catch(ex => {
        console.log(ex);
        this.setState({
          ...this.state,
          isChecking: false
        });
        Alert.alert(
          language.get("notice"),
          language.get("cannot_get_ip_address"),
          [
            {
              text: language.get("confirm"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ],
          { cancelable: true }
        );
      });
  };

  _checkInMiddle = () => {
    if (
      this.props.checkStatus.get("isCheckin") == null ||
      this.props.checkStatus.get("isCheckin") == 0 ||
      this.props.checkStatus.get("isCheckin") == 1
    ) {
      Alert.alert("Bạn chưa check in đầu ngày. Vui lòng check in để tiếp tục");
      return;
    }

    if (this.state.isChecking) {
      Alert.alert(language.get("waiting_system"));
    }

    this.setState({
      ...this.state,
      isChecking: true
    });

    /*Location*/

    this._runAnimation();

    /* Get IP address */
    fetch("http://checkin.koithe.vn/api/ip") //http://ipecho.net/plain
      .then(resp => {
        return resp.text();
      })
      .then(textResponse => {
        let ip = textResponse;

        if (ip != null) {
          Actions.refresh({ title: ip });
          this.setState({
            ...this.state,
            isChecking: false
          });
          if (!this.props.employeeOutletIps.get("isError")) {
            let ipContains = this.props.employeeOutletIps
              .get("data")
              .filter(item => {
                return item.get("ip").trim() == ip.trim();
              });

            if (ipContains.count() > 0) {
              if (this.state.location != null) {
                const submitLocation =
                  this.state.location.coords.latitude +
                  "," +
                  this.state.location.coords.longitude;

                this.props
                  .submitCheckInOut(
                    this.state.user.MaNV,
                    this.props.checkStatus.get("isCheckinMiddle") == null ||
                    this.props.checkStatus.get("isCheckinMiddle") == 0 ||
                    this.props.checkStatus.get("isCheckinMiddle") == 3
                      ? 3
                      : 4,
                    this.state.macAddress,
                    DeviceInfo.getBrand() + " " + DeviceInfo.getModel(),
                    submitLocation
                  )
                  .then(() => {
                    if (this.props.checkResponseStatus.get("isError")) {
                      Alert.alert(
                        language.get("notice"),
                        this.props.checkResponseStatus.get("data").error,
                        [
                          {
                            text: language.get("confirm"),
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          }
                        ],
                        { cancelable: true }
                      );
                    } else {
                      Alert.alert(
                        language.get("check_success"),
                        this.props.checkResponseStatus.get("data").InOutMode ==
                        3
                          ? language.get("check_in_middle_success") +
                            this.props.checkResponseStatus.get("data").Time
                          : language.get("check_out_middle_success") +
                            this.props.checkResponseStatus.get("data").Time,
                        [
                          {
                            text: language.get("confirm"),
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          }
                        ],
                        { cancelable: true }
                      );
                    }
                  });
                this.state.animatedValue.stopAnimation();
                this.state.fadeValue.setValue(1);
                this.state.fadeValue.stopAnimation();
              } else {
                Alert.alert(
                  language.get("notice"),
                  language.get("cannot_get_position_try_again"),
                  [
                    {
                      text: language.get("confirm"),
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel"
                    },
                    { cancelable: true }
                  ]
                );
                this.state.animatedValue.stopAnimation();
                this.state.fadeValue.setValue(1);
                this.state.fadeValue.stopAnimation();
              }
            } else {
              Alert.alert(
                language.get("notice"),
                language.get("request_ip_admin"),
                [
                  {
                    text: language.get("confirm"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  }
                ],
                { cancelable: false }
              );
              this.state.animatedValue.stopAnimation();
              this.state.fadeValue.setValue(1);
              this.state.fadeValue.stopAnimation();
            }
          } else {
            Alert.alert(
              language.get("notice"),
              language.get("ip_not_valid")[
                {
                  text: language.get("confirm"),
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                }
              ],
              { cancelable: false }
            );
          }
        }
      })
      .catch(ex => {
        console.log(ex);
        this.setState({
          ...this.state,
          isChecking: false
        });
        Alert.alert(
          language.get("notice"),
          language.get("cannot_get_ip_address"),
          [
            {
              text: language.get("confirm"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ],
          { cancelable: true }
        );
      });
  };

  _runAnimation = () => {
    // this.state.fadeValue.setValue(0.7);
    // Animated.timing(this.state.fadeValue, {
    //   toValue: 0.4,
    //   duration: 1500
    // }).start(e => {
    //   if (this.state.isChecking) {
    //     this._runAnimation();
    //   }
    // });
    Animated.sequence([
      Animated.timing(this.state.fadeValue, {
        toValue: 1,
        duration: 1000,

      }),
      Animated.timing(this.state.fadeValue, {
        toValue: 0.2,
        duration: 1000
      })
    ]).start(() => {
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

    if (
      this.state.user == null ||
      this.props.checkStatus.get("isCheckin") == null
    ) {
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
          <Text style={styles.name}>
            {this.state.time}
          </Text>
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
          <View style={{ alignItems: "center" }}>
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
                    width: this.state.heightMenu.width / 1.5 - 48,
                    height: this.state.heightMenu.width / 1.5 - 48,
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
                    {this.props.checkStatus.get("isCheckin") == null
                      ? ""
                      : this.props.checkStatus.get("isCheckin") == 0 ||
                        this.props.checkStatus.get("isCheckin") == 1
                        ? language.get("check_in")
                        : language.get("check_out")}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "white", paddingTop: 8 }}>
              {language.get("main_check_title")}
            </Text>
          </View>

          {/* Check giữa giờ  */}
          {/* <View style={{ alignItems: "center" }}>
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
                  this._checkInMiddle();
                }}
              >
                <Animated.View
                  style={{
                    backgroundColor: interpolatedColorAnimation,
                    opacity: this.state.fadeValue,
                    width: this.state.heightMenu.width / 2 - 48,
                    height: this.state.heightMenu.width / 2 - 48,
                    borderRadius: borderRadius,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 26,
                      fontWeight: "bold"
                    }}
                  >
                    {this.props.checkStatus.get("isCheckinMiddle") == null
                      ? ""
                      : this.props.checkStatus.get("isCheckinMiddle") == 0 ||
                        this.props.checkStatus.get("isCheckinMiddle") == 3
                        ? language.get("check_in_middle")
                        : language.get("check_out_middle")}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
            <Text style={{ color: "white", paddingTop: 8 }}>
              {language.get("middle_check_title")}
            </Text>
          </View> */}
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
    height: 75,
    width: 75,
    borderRadius: 35,
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
    flexDirection: "row",
    justifyContent: "center",
    // justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 48
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
    employeeOutletInfo: state.employeeOutletInfo,
    checkStatus: state.checkStatus,
    checkResponseStatus: state.checkResponseStatus,
    locationUser: state.locationUser
  };
}

export default connect(mapStateToProps)(CheckInOut);
