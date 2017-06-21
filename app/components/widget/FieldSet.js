import React, { Component } from "react";
import ReactNative from "react-native";
import { Actions } from "react-native-router-flux";
import { Colors, globalStyle } from "../../style";
import * as language from "../../language";
import { FontAwesome as Icon } from "@expo/vector-icons";

const {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} = ReactNative;

const { width, height } = Dimensions.get("window");

class FieldSet extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const largeStyle = this.props.size != null && this.props.size == "large"
      ? { fontSize: 24 }
      : null;
    const largeWidth = this.props.size != null && this.props.size == "large"
      ? { width: width / 2 - 4 }
      : { width: width / 3 - 4 };

    return (
      <View style={{ marginVertical: 4 }}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{this.props.label.toUpperCase()}</Text>
        </View>

        <View style={styles.container}>
          {this.props.data.map((item, index) => {
            return (
              <View key={index} style={[styles.item, largeWidth]}>
                <Text style={styles.textItem}>{item.title}</Text>
                <Text style={[styles.textItemValue, largeStyle]}>
                  {item.value}
                </Text>
              </View>
            );
          })}

        </View>

      </View>
    );
  }
}

// Css for each view
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 8,
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "white",
    marginVertical: 8,
    marginHorizontal: 4,
    zIndex: 0
  },
  titleContainer: {
    position: "absolute",
    top: -2,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    zIndex: 1,
    backgroundColor: "black"
  },
  item: {
    width: width / 3 - 4,
    height: 60,
    alignItems: "center",
    paddingHorizontal: 2
  },
  textItem: {
    textAlign: "center",
    color: "white"
  },
  textItemValue: {
    textAlign: "center",
    color: "white",
    fontSize: 14,
    alignSelf: "stretch",
    backgroundColor: Colors.colorPrimaryDark
  }
});

export default FieldSet;
