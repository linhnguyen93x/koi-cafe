import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  NativeModules,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
// import Immutable, { fromJS } from "immutable";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import { Colors, globalStyle } from "../style";
import Icon from "react-native-vector-icons/FontAwesome";
import * as language from "../language";
import * as AppConstants from "../utils/AppConstans";
import RNRestart from "react-native-restart";
import Picker from "react-native-picker";
import Immutable, { fromJS } from 'immutable'

const pickerData = new Array(language.get("all"));
let mapOfPickerData = new Map();
mapOfPickerData.set(language.get("all"), "All");

const NetworkInfo = NativeModules.NetworkInfo;

var _notificationSubscription;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: "",
      user: null,
      checkInOutIcon: null,
      clockIcon: null,
      moneyIcon: null,
      listIcon: null,
      userIcon: null,
      tryTime: 0,
      outlet: language.get("all")
    };
  }

  componentWillMount() {
    // actions/checkInOut.js
    // this.props.getAllOutlet().then(() => {
    //   if (!this.props.allOutletInfo.get("isError")) {
    //     this.props.allOutletInfo.get("data").forEach(item => {
    //       pickerData.push(item.tencuahang);
    //       mapOfPickerData.set(item.tencuahang, item.macuahang);
    //     });
    //   }
    // });
    this._getEmployeeInfo();
    this._bindHomeIcon();
//        AsyncStorage.getItem("user").then(resp => {
//           let user = JSON.parse(resp);
//           this.setState({
//             user: user
//           });
//        if(this.state.user != null){
//          this.props.getAvatar(this.state.user.MaNV).then(() => {
//           if (!this.props.avatar.get("isError")) {
//             console.log("TestAvt" + this.props.avatar.get("data"));
//           this.setState(
//             {
//               user: {
//                 ...this.state.user,
//                 HinhAnh: this.props.avatar.get("data")
//               }
//             },
//             () => {
//               AsyncStorage.mergeItem(
//                 "user",
//                 JSON.stringify(this.state.user),
//                 () => {
//                   AsyncStorage.getItem("user", (err, result) => {
//                     console.log(result);
//                   });
//                 }
//               );
//             }
//           );
//               }
//       });
//      }
//      });
  }

  _getEmployeeInfo = async () => {
    let user = JSON.parse(await AsyncStorage.getItem("user"));

    if (user != null) {
      this.setState({
        ...this.state,
        user
      });
    } else {
      this.props.fetchEmployeeList().then(() => {
        if (
          this.props.employeeList.get("data") != null &&
          this.props.employeeList.get("data").count() > 0
        ) {
          let userLogin = this.props.employeeList.get("data").first().toJS();
          AsyncStorage.setItem("user", JSON.stringify(userLogin)).then(() => {
            this._getUser();
          });
        } else {
          this.setState({
            tryTime: this.state.tryTime + 1
          });
          if (this.state.tryTime > 2) {
            Actions.logout();
          } else {
            this._getEmployeeInfo();
          }
        }
      });
    }
  
  };

  componentDidMount() {
    // fetch("https://ifcfg.me/ip")
    //   .then(resp => {
    //     return resp.text();
    //   })
    //   .then(textResponse => {
    //     let ip = textResponse;
    //     if (ip != null) {
    //       Actions.refresh({ title: ip });
    //     }
    //   })
    //   .catch(ex => {
    //     console.log(ex);
    //   });
  }

  _bindHomeIcon = () => {
    Icon.getImageSource("calendar-check-o", 15, "white").then(source =>
      this.setState({ checkInOutIcon: source })
    );
    Icon.getImageSource("clock-o", 15, "white").then(source =>
      this.setState({ clockIcon: source })
    );
    Icon.getImageSource("calculator", 15, "white").then(source =>
      this.setState({ moneyIcon: source })
    );
    Icon.getImageSource("list", 15, "white").then(source =>
      this.setState({ listIcon: source })
    );
    Icon.getImageSource("user", 15, "white").then(source =>
      this.setState({ userIcon: source })
    );
  };

  async getExternalIp() {}

  _getUser = async () => {
    let user = JSON.parse(await AsyncStorage.getItem("user"));

    this.setState({
      ...this.state,
      user
    });
  };

  _bindViewRole = () => {
    let functionByRole = [
      {
        key: 0,
        text: language.get("checkIn_checkOut"),
        image: this.state.checkInOutIcon,
        type: "checkInOut"
      },
      {
        key: 1,
        text: language.get("work_sheet"),
        image: this.state.clockIcon,
        type: "workSheet"
      },
      {
        key: 2,
        text: language.get("detail_salary"),
        image: this.state.moneyIcon,
        type: "detailSalary"
      },
      {
        key: 4,
        text: language.get("user_profile"),
        image: this.state.userIcon,
        type: "userInfo"
      },
      {
        key: 3,
        text: language.get("view_list_employee"),
        image: this.state.listIcon,
        type: "listEmployee"
      },

      // {
      //   key: 3,
      //   text: language.get("employee_info"),
      //   image: require("../../assets/icons/view_list.png"),
      //   type: "employeeInfo"
      // }
    ];
    return functionByRole;
  };

  _openDropDown() {
    Picker.init({
      pickerData: pickerData,
      pickerConfirmBtnText: language.get("choose"),
      pickerCancelBtnText: language.get("cancel"),
      pickerTitleText: language.get("store"),
      selectedValue: [this.state.outlet],
      onPickerConfirm: data => {
        this.setState(
          {
            outlet: data[0]
          },
          () => {
            Actions.employeeList({
              filter: mapOfPickerData.get(this.state.outlet.toString())
            });
            // this.props
            //   .filterEmployeeByCat(
            //     this.state.employeeData,
            //     mapOfPickerData.get(this.state.outlet.toString())
            //   )
            //   .then(() => {
            //     this.setState({
            //       isLoading: false
            //     });
            //   });
          }
        );
      },
      onPickerCancel: data => {},
      onPickerSelect: data => {}
    });
    Picker.show();
  }

  _itemSelected = type => {
    switch (type) {
      case "listEmployee":
        Actions.outletList();
        // this._openDropDown();

        break;
      case "checkInOut":
        Actions.checkInOut();
        // this.props.changeLanguage('vi').then(() => {
        //   RNRestart.Restart();
        // });

        break;
      case "employeeInfo":
        Actions.employeeMenu({
          title: this.state.user.HoTen,
          item: Map(this.state.user)
        });
        break;
      case "workSheet":
        Actions.workSheet();
        break;
      case "detailSalary":
        Actions.detailSalary();

        break;
      case "userInfo":
        Actions.employeeMenu({ item: fromJS(this.state.user) });

        break;
      default:
    }
  };

  render() {
    if (this.state.user == null) {
      return (
        <Image
          style={[
            styles.imgContainer,
            globalStyle.container,
            globalStyle.mainPaddingTop,
            {
              justifyContent: "flex-start",
              alignItems: "center"
            }
          ]}
          source={require("../../assets/backgrounds/main_bg.png")}
          resizeMode={Image.resizeMode.cover}
        >
          <ActivityIndicator size="large" />
          <Text style={{ color: "white" }}>
            {language.get("getting_employee_info")}{" "}
            {this.state.tryTime > 0 ? `(${this.state.tryTime})` : ""}
          </Text>
        </Image>
      );
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
    width: 20,
    height: 20
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

function mapStateToProps(state) {
  return {
    employeeList: state.employeeList,
    allOutletInfo: state.allOutletInfo,
    avatar : state.avatar
  };
}

export default connect(mapStateToProps)(Home);
