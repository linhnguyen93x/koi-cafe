import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Colors, globalStyle } from "../style";
import { FontAwesome as Icon } from "@expo/vector-icons";
import * as language from "../language";

const { width, height } = Dimensions.get("window");

class EmployeeMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heightMenu: {
        height: null
      }
    };
  }

  onLayout(event) {
    const { x, y, height, width } = event.nativeEvent.layout;

    const newLayout = {
      height: height / 2 - 4
    };

    this.setState({ heightMenu: newLayout });
  }

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
          <Image
            source={{
              uri:
                "https://s-media-cache-ak0.pinimg.com/236x/2e/56/a1/2e56a1d72c817e63bb74f6cb1b7636eb.jpg"
            }}
            style={styles.logo}
          />
          <Text style={styles.name}>
            {this.props.item.get("HoTen").toUpperCase()}
          </Text>
          <Text style={styles.role}>{this.props.item.get("ChucVu")}</Text>
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
              <Image
                style={icon}
                source={require("../../assets/icons/request_off.png")}
                resizeMode="cover"
              />
              <Text style={styles.role}>{language.get("info")}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
            <View style={[styles.menu, this.state.heightMenu]}>
              <Image
                style={icon}
                source={require("../../assets/icons/view_list.png")}
                resizeMode="cover"
              />
              <Text style={styles.role}>{language.get("total_work_hour")}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              Actions.detailSalary({item: this.props.item});
            }}
          >
            <View style={[styles.menu, this.state.heightMenu]}>
              <Image
                style={icon}
                source={require("../../assets/icons/update_ip.png")}
                resizeMode="cover"
              />
              <Text style={styles.role}>{language.get("detail_salary")}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
            <View style={[styles.menu, this.state.heightMenu]}>
              <Image
                style={icon}
                source={require("../../assets/icons/request_leave.png")}
                resizeMode="cover"
              />
              <Text style={styles.role}>{language.get("detail_salary")}</Text>
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
    resizeMode: "contain"
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

export default EmployeeMenu;
