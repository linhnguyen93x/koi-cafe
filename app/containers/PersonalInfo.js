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
    backgroundColor: 'rgba(68, 56, 40, 0.8)',
    alignSelf: "stretch",
    paddingVertical: 8,
    paddingHorizontal: 4
  },
  headTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: 'bold',
    opacity: .8

  }
});

export default PersonalInfo;
