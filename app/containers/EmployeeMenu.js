import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Colors, globalStyle } from "../style";
import Icon from "react-native-vector-icons/FontAwesome";
import * as language from "../language";
import PhotoUpload from "react-native-photo-upload";
import { connect } from "react-redux";

const { width, height } = Dimensions.get("window");

class EmployeeMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heightMenu: {
        height: null
      },
      customerIcon: null,
      user: null
    };
  }
  
  componentWillMount() {
     AsyncStorage.getItem("user").then(resp => {
          let user = JSON.parse(resp);
          this.setState({
            user: user
          });
         });
  
    
    if(this.props.item.get("MaNV") != null){
        this.props.getAvatar(this.props.item.get("MaNV")).then(() => {
          if (!this.props.avatar.get("isError")) {
          this.setState(
            {
              user: {
                ...this.state.user,
                HinhAnh: this.props.avatar.get("data")
              }
            },
            () => {
              AsyncStorage.mergeItem(
                "user",
                JSON.stringify(this.state.user),
                () => {
                  AsyncStorage.getItem("user", (err, result) => {
                    console.log(result);
                  });
                }
              );
            }
          );
        }
      });
    }
    
    Icon.getImageSource("user-o", 30, "white").then(source =>
      this.setState({ customerIcon: source })
    );
  }

  onLayout(event) {
    const { x, y, height, width } = event.nativeEvent.layout;

    const newLayout = {
      height: height / 2 - 4
    };

    this.setState({ heightMenu: newLayout });
  }

  uploadAvatar = avatar => {
    if (avatar) {
      this.props.uploadAvatar(this.state.user.MaNV, avatar).then(() => {
        if (!this.props.avatar.get("isError")) {
          console.log("url:" + this.props.avatar.get("data"));
          this.setState(
            {
              user: {
                ...this.state.user,
                HinhAnh: this.props.avatar.get("data")
              }
            },
            () => {
              AsyncStorage.mergeItem(
                "user",
                JSON.stringify(this.state.user),
                () => {
                  AsyncStorage.getItem("user", (err, result) => {
                    console.log(result);
                  });
                }
              );
            }
          );
        }
      });
      console.log("Image base64 string: ", avatar);
    }
  };

  render() {
    const icon = {
      width: this.state.heightMenu.height / 1.5,
      height: this.state.heightMenu.height / 1.5
    };

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
          {this.state.user != null &&
          this.props.item.get("MaNV") == this.state.user.MaNV
            ? <View style={{ width: 150, height: 150 }}>
                <PhotoUpload
                  onPhotoSelect={avatar => {
                    this.uploadAvatar(avatar);
                  }}
                >
                  <Image
                    source={{
                      uri:
                        this.state.user != null &&
                        this.state.user.HinhAnh != null &&
                        this.state.user.HinhAnh.length > 0
                          ? this.state.user.HinhAnh
                          : "https://cdn2.iconfinder.com/data/icons/network-and-communication-13/28/9_user_profie_avatar_male_upload-2-512.png"
                    }}
                    resizeMode="cover"
                    style={styles.logo}
                  />
                </PhotoUpload>
              </View>
            : <Image
                source={{
                  uri:  this.state.user != null &&
                        this.state.user.HinhAnh != null &&
                        this.state.user.HinhAnh.length > 0
                          ? this.state.user.HinhAnh
                          : 'http://www.limestone.edu/sites/default/files/user.png'
                }}
                style={styles.logo}
                resizeMode="cover"
              />}

          <Text style={styles.name}>
            {this.props.item.get("HoTen").toUpperCase()}
          </Text>
          <Text style={styles.role}>
            {this.props.item.get("ChucVu")}
          </Text>
        </View>
        <View
          style={styles.menuContainer}
          onLayout={event => {
            this.onLayout(event);
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              Actions.personalInfo({ item: this.props.item });
            }}
          >
            <View style={[styles.menu, this.state.heightMenu]}>
              <Icon
                name="user"
                size={this.state.heightMenu.height / 2}
                color="white"
              />
              <Text style={styles.role}>
                {language.get("info")}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              Actions.historyCheckIn({ item: this.props.item });
            }}
          >
            <View style={[styles.menu, this.state.heightMenu]}>
              <Icon
                name="clock-o"
                size={this.state.heightMenu.height / 2}
                color="white"
              />
              <Text style={styles.role}>
                {language.get("total_work_hour")}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              Actions.userChecked({ item: this.props.item });
            }}
          >
            <View style={[styles.menu, this.state.heightMenu]}>
              <Icon
                name="calendar-check-o"
                size={this.state.heightMenu.height / 2}
                color="white"
              />
              <Text style={styles.role}>
                {language.get("history_check_in")}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              Actions.resultChecking({ item: this.props.item });
            }}
          >
            <View style={[styles.menu, this.state.heightMenu]}>
              <Icon
                name="thumbs-o-up"
                size={this.state.heightMenu.height / 2}
                color="white"
              />
              <Text style={styles.role}>
                {language.get("result_checking")}
              </Text>
            </View>
          </TouchableOpacity>
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
    backgroundColor: "transparent"
  },
  logo: {
    height: 150,
    width: 150,
    borderRadius: 75,
    paddingVertical: 30
  },
  name: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    paddingVertical: 6
  },
  role: {
    color: "white",
    fontSize: 12
  },
  menuContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 24,
    backgroundColor: "transparent",
    marginTop: 16,
    marginBottom: 32
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
    avatar: state.avatar
  };
}

export default connect(mapStateToProps)(EmployeeMenu);
