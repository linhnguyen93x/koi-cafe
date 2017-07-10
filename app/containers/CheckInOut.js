import React, { Component } from 'react';
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
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Colors, globalStyle } from '../style';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as language from '../language';
import moment from 'moment';
import DeviceInfo from 'react-native-device-info';
import vimoment from 'moment/locale/vi';
import Permissions from 'react-native-permissions';

const { width, height } = Dimensions.get('window');
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
      time: moment().format('h:mm'),
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
    moment.updateLocale('vi', vimoment);
    let user = JSON.parse(await AsyncStorage.getItem('user'));
    this.setState({ user });

    /* actions/checkInOut */
    this.props.getUserOutlet(user.MaCuaHang).then(() => {
      if (!this.props.employeeOutletInfo.get('isError')) {
        this.props.getIpOutlet(this.props.employeeOutletInfo.get('data'));
      } else {
        // Works on both iOS and Android
        Alert.alert(
          'Thông báo',
          'Không thể lấy thông tin cửa hàng. Vui lòng liên hệ quản trị viên!',
          [{ text: 'OK', onPress: () => Actions.pop() }],
          { cancelable: false }
        );
      }
    });

    /* actions/checkInOut */
    this.props.getCheckStatus(
      this.state.user.MaNV,
      moment(new Date()).format('YYYY-MM-DD')
    );

    // Get Location
    if (this.props.locationUser.get('location') != null) {
      this.setState({
        location: this.props.locationUser.get('location')
      });
    } else {
      this._getLocationAsync();
    }

    // Get MAC address
    if (Platform.OS === 'ios') {
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
    let status = await Permissions.requestPermission('location');
    if (status !== 'authorized') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      });
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({ location: position });
      },
      error => {
        console.log(error);
        Alert.alert(
          'Thông báo',
          'Không thể lấy vị trí của bạn. Vui lòng thử lại!',
          [
            {
              text: 'Xác nhận',
              onPress: () => Actions.pop(),
              style: 'cancel'
            },
            { cancelable: true }
          ]
        );
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
        timeout: 20000
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
      () => this.setState({ ...this.state, time: moment().format('h:mm') }),
      10000
    );
  }

  _checkIn = () => {
    if (this.state.isChecking) {
      Alert.alert('Hệ thống đang xử lý, vui lòng đợi trong giây lát...');
    }

    this.setState({
      ...this.state,
      isChecking: true
    });

    /*Location*/

    this._runAnimation();
    /* Get IP address */
    fetch('http://checkin.koithe.vn/api/ip') //http://ipecho.net/plain
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
          if (!this.props.employeeOutletIps.get('isError')) {
            let ipContains = this.props.employeeOutletIps
              .get('data')
              .filter(item => {
                return item.get('ip').trim() == ip.trim();
              });

            if (ipContains.count() > 0) {
              if (this.state.location != null) {
                const submitLocation =
                  this.state.location.coords.latitude +
                  ',' +
                  this.state.location.coords.longitude;

                this.props
                  .submitCheckInOut(
                    this.state.user.MaNV,
                    this.props.checkStatus.get('isCheckin') == null ||
                    this.props.checkStatus.get('isCheckin') == 0 ||
                    this.props.checkStatus.get('isCheckin') == 1
                      ? 1
                      : 2,
                    this.state.macAddress,
                    DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel(),
                    submitLocation
                  )
                  .then(() => {
                    if (this.props.checkResponseStatus.get('isError')) {
                      Alert.alert(
                        'Thông báo',
                        this.props.checkResponseStatus.get('data').error,
                        [
                          {
                            text: 'Xác nhận',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                          }
                        ],
                        { cancelable: true }
                      );
                    } else {
                      Alert.alert(
                        'Check thành công',
                        this.props.checkResponseStatus.get('data').InOutMode ==
                        1
                          ? 'Check in lúc ' +
                            this.props.checkResponseStatus.get('data').Time
                          : 'Check out lúc ' +
                            this.props.checkResponseStatus.get('data').Time,
                        [
                          {
                            text: 'Xác nhận',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
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
                  'Thông báo',
                  'Không thể lấy vị trí của bạn. Vui lòng thử lại!',
                  [
                    {
                      text: 'Xác nhận',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel'
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
                'Thông báo',
                'IP của bạn chưa được cấp quyền Check. Vui lòng liên hệ quản trị viên!',
                [
                  {
                    text: 'Xác nhận',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
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
              'Thông báo',
              'IP check in không hợp lệ. Vui lòng liên hệ quản trị viên!',
              [
                {
                  text: 'Xác nhận',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
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
          'Thông báo',
          'Không thể lấy địa chỉ IP',
          [
            {
              text: 'Xác nhận',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            }
          ],
          { cancelable: true }
        );
      });
  };

  _checkInMiddle = () => {
    if (this.state.isChecking) {
      Alert.alert('Hệ thống đang xử lý, vui lòng đợi trong giây lát...');
    }

    this.setState({
      ...this.state,
      isChecking: true
    });

    /*Location*/

    this._runAnimation();
    /* Get IP address */
    fetch('http://checkin.koithe.vn/api/ip') //http://ipecho.net/plain
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
          if (!this.props.employeeOutletIps.get('isError')) {
            let ipContains = this.props.employeeOutletIps
              .get('data')
              .filter(item => {
                return item.get('ip').trim() == ip.trim();
              });

            if (ipContains.count() > 0) {
              if (this.state.location != null) {
                const submitLocation =
                  this.state.location.coords.latitude +
                  ',' +
                  this.state.location.coords.longitude;

                this.props
                  .submitCheckInOut(
                    this.state.user.MaNV,
                    this.props.checkStatus.get('isCheckinMiddle') == null ||
                    this.props.checkStatus.get('isCheckinMiddle') == 0 ||
                    this.props.checkStatus.get('isCheckinMiddle') == 3
                      ? 3
                      : 4,
                    this.state.macAddress,
                    DeviceInfo.getBrand() + ' ' + DeviceInfo.getModel(),
                    submitLocation
                  )
                  .then(() => {
                    if (this.props.checkResponseStatus.get('isError')) {
                      Alert.alert(
                        'Thông báo',
                        this.props.checkResponseStatus.get('data').error,
                        [
                          {
                            text: 'Xác nhận',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
                          }
                        ],
                        { cancelable: true }
                      );
                    } else {
                      Alert.alert(
                        'Check thành công',
                        this.props.checkResponseStatus.get('data').InOutMode ==
                        1
                          ? 'Check in giữa giờ lúc ' +
                            this.props.checkResponseStatus.get('data').Time
                          : 'Check out giữa giờ lúc ' +
                            this.props.checkResponseStatus.get('data').Time,
                        [
                          {
                            text: 'Xác nhận',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel'
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
                  'Thông báo',
                  'Không thể lấy vị trí của bạn. Vui lòng thử lại!',
                  [
                    {
                      text: 'Xác nhận',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel'
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
                'Thông báo',
                'IP của bạn chưa được cấp quyền Check. Vui lòng liên hệ quản trị viên!',
                [
                  {
                    text: 'Xác nhận',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
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
              'Thông báo',
              'IP check in không hợp lệ. Vui lòng liên hệ quản trị viên!',
              [
                {
                  text: 'Xác nhận',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
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
          'Thông báo',
          'Không thể lấy địa chỉ IP',
          [
            {
              text: 'Xác nhận',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel'
            }
          ],
          { cancelable: true }
        );
      });
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
      outputRange: [Colors.colorPrimaryDark, 'rgba(51,156,177, 1)']
    });

    if (
      this.state.user == null ||
      this.props.checkStatus.get('isCheckin') == null ||
      this.state.location == null
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
        source={require('../../assets/backgrounds/main_bg.png')}
        resizeMode={Image.resizeMode.cover}
      >
        {/*Logo Section*/}
        <View style={[styles.contentSection]}>
          <Text style={styles.name}>
            {this.state.time}
          </Text>
          <Text style={styles.role}>
            {this.props.employeeOutletInfo.get('data') != null
              ? moment(new Date()).format('ll') +
                ', ' +
                this.props.employeeOutletInfo.get('data').tencuahang
              : ''}
          </Text>
        </View>
        <View
          style={[styles.menuContainer]}
          onLayout={event => {
            this.onLayout(event);
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
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
                    width: this.state.heightMenu.width / 2 - 48,
                    height: this.state.heightMenu.width / 2 - 48,
                    borderRadius: borderRadius,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 32,
                      fontWeight: 'bold'
                    }}
                  >
                    {this.props.checkStatus.get('isCheckin') == null
                      ? ''
                      : this.props.checkStatus.get('isCheckin') == 0 ||
                        this.props.checkStatus.get('isCheckin') == 1
                        ? 'CHECK\nIN'
                        : 'CHECK\nOUT'}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
            <Text style={{ color: 'white', paddingTop: 8 }}>
              CHECK ĐẦU NGÀY
            </Text>
          </View>

          {/* Check giữa giờ  */}
          <View style={{ alignItems: 'center' }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
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
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 32,
                      fontWeight: 'bold'
                    }}
                  >
                    {this.props.checkStatus.get('isCheckinMiddle') == null
                      ? ''
                      : this.props.checkStatus.get('isCheckinMiddle') == 0 ||
                        this.props.checkStatus.get('isCheckinMiddle') == 3
                        ? 'CHECK\nIN'
                        : 'CHECK\nOUT'}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
            <Text style={{ color: 'white', paddingTop: 8 }}>
              CHECK GIỮA NGÀY
            </Text>
          </View>
        </View>
      </Image>
    );
  }
}

// Css for each view
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between'
  },
  contentSection: {
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'transparent'
  },
  logo: {
    height: 75,
    width: 75,
    borderRadius: 35,
    resizeMode: 'contain'
  },
  name: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 96,
    fontWeight: 'bold'
  },
  role: {
    color: 'white',
    fontSize: 16
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 48
  },
  menu: {
    justifyContent: 'space-around',
    alignItems: 'center',
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
