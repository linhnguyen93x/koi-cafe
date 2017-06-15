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
import { connect } from "react-redux";
import { Colors, globalStyle } from "../style";
import { FontAwesome as Icon } from "@expo/vector-icons";
import * as language from "../language";
import moment from "moment";
import vimoment from "moment/locale/vi";

const { width, height } = Dimensions.get("window");
const deviceLocale = language.getLocale();

class CheckInOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heightMenu: {
        height: null,
        width: null
      },
      time: moment().format("h:mm")
    };

    this._interval = null;
  }

  async componentWillMount() {
    moment.updateLocale("vi", vimoment);
    let user = JSON.parse(await AsyncStorage.getItem("user"));

    /* actions/checkInOut */
    this.props.getUserOutlet(user.MaCuaHang).then(() => {
      if (!this.props.employeeOutletInfo.get("isError")) {
        this.props.getIpOutlet(this.props.employeeOutletInfo.get("data"));
      }
    });
  }

  onLayout(event) {
    const { x, y, height, width } = event.nativeEvent.layout;

    const newLayout = {
      height: height,
      width: width
    };

    this.setState({ heightMenu: newLayout });
  }

  componentDidMount() {
    this._interval = setInterval(
      () => this.setState({ ...this.state, time: moment().format("h:mm") }),
      10000
    );
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  render() {
    const borderRadius = this.state.heightMenu.width / 2;
    const checkLayout = {
      borderRadius: borderRadius
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
            <View
              style={{
                backgroundColor: Colors.colorPrimaryDark,
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
            </View>

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
