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

class CheckInOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heightMenu: {
        height: null,
        width: null
      }
    };
  }

  onLayout(event) {
    const { x, y, height, width } = event.nativeEvent.layout;

    const newLayout = {
      height: height,
      width: width
    };

    this.setState({ heightMenu: newLayout });
  }

  render() {
    const borderRadius = this.state.heightMenu.width <=
      this.state.heightMenu.height
      ? this.state.heightMenu.width / 2
      : this.state.heightMenu.height / 2;
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
          <Image
            source={{
              uri:
                "https://s-media-cache-ak0.pinimg.com/236x/2e/56/a1/2e56a1d72c817e63bb74f6cb1b7636eb.jpg"
            }}
            style={styles.logo}
          />
          <Text style={styles.name}>Đồng hồ</Text>
          <Text style={styles.role}>Thông tin</Text>
        </View>
        <View
          style={[styles.menuContainer, checkLayout]}
          onLayout={event => {
            this.onLayout(event);
          }}
        >

          <View
            style={{
              backgroundColor: Colors.colorPrimaryDark,
              width: this.state.heightMenu.width - 36,
              height: this.state.heightMenu.height - 36,
              borderRadius: borderRadius,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 20,
                fontWeight: 'bold'
              }}
            >
              CHECK IN
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
    justifyContent: "center",
    alignItems: "center",
    margin: 48,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.colorPrimaryDark
  },
  menu: {
    justifyContent: "space-around",
    alignItems: "center",
    width: width / 2 - 28,
    backgroundColor: Colors.colorPrimaryDark,
    margin: 2
  }
});

export default CheckInOut;
