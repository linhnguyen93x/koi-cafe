import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Colors, globalStyle } from "../style";
import Icon from "react-native-vector-icons/FontAwesome";
import * as language from "../language";
import moment from "moment";

const { width, height } = Dimensions.get("window");

class PersonalInfo extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    /* actions/checkInOut */
    this.props.getUserOutlet(this.props.item.get("MaCuaHang"));
  }

  componentWillUnmount() {
    this.props.resetUserOutlet();
  }

  render() {
    return (
      <Image
        style={[globalStyle.imgContainer, globalStyle.mainPaddingTop]}
        source={require("../../assets/backgrounds/main_bg.png")}
        resizeMode={Image.resizeMode.cover}
      >
        <ScrollView style={{ alignSelf: "stretch" }}>
          <View style={styles.container}>
            <Text style={styles.name}>
              {this.props.item.get("HoTen").toUpperCase()}
            </Text>
            <View style={styles.headTitleContainer}>
              <Text style={styles.headTitle}>
                <Icon
                  name="caret-right"
                  size={15}
                  color={Colors.colorPrimaryDark}
                />{" "}
                {language.get("info").toUpperCase()}
              </Text>
            </View>
            <View style={styles.bodyInfo}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ color: "white" }}>
                  {language.get("employee_code_label")}
                </Text>
                <Text style={{ color: "white" }}>
                  {" "}
                   {this.props.item.get("MaNV")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ color: "white" }}>{language.get("gender")}</Text>
                <Text style={{ color: "white" }}>
                  {" "}
                   {this.props.item.get("GioiTinh")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ color: "white" }}>
                  {language.get("birthdate_label")}
                </Text>
                <Text style={{ color: "white" }}>
                  {" "}
                  {" "}
                  {moment(this.props.item.get("NgaySinh")).format("DD-MM-YYYY")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ color: "white" }}>
                  {language.get("date_start_work")}
                </Text>
                <Text style={{ color: "white" }}>
                  {" "}
                  {" "}
                  {moment(this.props.item.get("NgayVaoLam")).format(
                    "DD-MM-YYYY"
                  )}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 4
                }}
              >
                <Text style={{ color: "white" }}>
                  {language.get("position_label")}
                </Text>
                <Text style={{ color: "white" }}>
                  {" "}
                   {this.props.item.get("ChucVu")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 4
                }}
              >
                <Text style={{ color: "white" }}>
                  {language.get("store_label")}
                </Text>
                <Text style={{ color: "white" }}>
                  {" "}
                  {" "}
                  {this.props.employeeOutletInfo.get("data") != null
                    ? this.props.employeeOutletInfo.get("data").tencuahang
                    : ""}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 4
                }}
              >
                <Text style={{ color: "white" }}>
                  {language.get("address_label")}
                </Text>
                <Text style={{ color: "white" }}>
                  {" "}
                   {this.props.item.get("DiaChi")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 4
                }}
              >
                <Text style={{ color: "white" }}>
                  {language.get("bhxh_label")}
                </Text>
                <Text style={{ color: "white" }}>
                  {" "}
                   {this.props.item.get("BHXH")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom: 4
                }}
              >
                <Text style={{ color: "white" }}>
                  {language.get("cmnd")}
                </Text>
                <Text style={{ color: "white" }}>
                  {" "}
                   {this.props.item.get("CMND")}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </Image>
    );
  }
}

// Css for each view
const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: 24
  },
  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8
  },
  headTitleContainer: {
    backgroundColor: "rgba(68, 56, 40, 0.8)",
    alignSelf: "stretch",
    paddingVertical: 8,
    paddingHorizontal: 4
  },
  headTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0.8
  },
  bodyInfo: {
    alignSelf: "stretch",
    padding: 4
  }
});

function mapStateToProps(state) {
  return {
    employeeOutletInfo: state.employeeOutletInfo
  };
}

export default connect(mapStateToProps)(PersonalInfo);
