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
import { Colors, globalStyle } from "../style";
import { FontAwesome as Icon } from "@expo/vector-icons";
import * as language from "../language";

const { width, height } = Dimensions.get("window");

class PersonalInfo extends Component {
  constructor(props) {
    super(props);
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
                THÔNG TIN
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
                <Text style={{ color: "white" }}>Mã nhân viên:</Text>
                <Text style={{ color: "white" }}>
                  {" "} {this.props.item.get("MaNV")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ color: "white" }}>Giới tính:</Text>
                <Text style={{ color: "white" }}>
                  {" "} {this.props.item.get("GioiTinh")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ color: "white" }}>Ngày sinh:</Text>
                <Text style={{ color: "white" }}>
                  {" "} {this.props.item.get("NgaySinh")}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <Text style={{ color: "white" }}>Ngày vào làm:</Text>
                <Text style={{ color: "white" }}>
                  {" "} {this.props.item.get("NgayVaoLam")}
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
                <Text style={{ color: "white" }}>Chức vụ:</Text>
                <Text style={{ color: "white" }}>
                  {" "} {this.props.item.get("ChucVu")}
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
                <Text style={{ color: "white" }}>Cửa hàng:</Text>
                <Text style={{ color: "white" }}>
                  {" "} {this.props.item.get("CuaHang")}
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
                <Text style={{ color: "white" }}>Địa chỉ:</Text>
                <Text style={{ color: "white" }}>
                  {" "} {this.props.item.get("DiaChi")}
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

export default PersonalInfo;
