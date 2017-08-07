import React, { Component } from "react";
import ReactNative from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Colors, globalStyle } from "../style";
import Icon from "react-native-vector-icons/FontAwesome";
import * as language from "../language";
import { EmployeeItem, NoData } from "../components";
import Picker from "react-native-picker";

const {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AsyncStorage
} = ReactNative;

class OutletList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isLoading: false,
      workSheet: language.get("all"),
      employeeData: null
    };
  }

  componentWillMount() {
    // actions/checkInOut.js
    this.props.getAllOutlet();
  }

  _keyExtractor = (item, index) => {
    return item.get("id");
  };

  renderListItem = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() =>
          Actions.employeeList({
            filter: item.item.get("macuahang")
          })}
      >
        <View style={styles.childContainer}>
          <Image
            style={styles.image}
            source={require('../../assets/icons/koi_logo.png')}
            resizeMode="cover"
          />
          <Text style={styles.name}>
            {item.item.get("tencuahang")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  _loadMore(info) {
    // if (this.props.outletList.get('offset') != -1) {
    // 	this.props.fetchOutletList(
    // 		null, null, 20, this.props.outletList.get('offset') + 1, null);
    // }
  }

  _search() {
    // 	this.setState({
    // 		...this.state,
    // 		isLoading: true
    // 	});
    // 	this.props.fetchOutletList(
    // 		null, null, 20, 0, this.state.search).then( () => {
    // 		this.setState({
    // 		...this.state,
    // 		isLoading: false
    // 	});
    // } );
  }

  componentWillUnmount() {
    // this.props.resetEmployeeList();
  }

  render() {
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
        {/* <View style={styles.picker_container}>
          <TouchableWithoutFeedback onPress={() => this._openDropDown()}>
            <View style={styles.picker}>
              <Text>
                {this.state.workSheet}
              </Text>
              <Icon name="angle-down" size={15} color="#036380" />
            </View>
          </TouchableWithoutFeedback>
        </View> */}
        {/*FlatList */}
        {this.state.isLoading
          ? <ActivityIndicator size="large" />
          : <FlatList
              keyExtractor={this._keyExtractor}
              style={[styles.list]}
              data={this.props.allOutletInfo.get("data").toArray()}
              renderItem={this.renderListItem}
              // onEndReached={info => this._loadMore(info)}
              initialNumToRender={20}
              getItemLayout={(data, index) => ({
                length: 60,
                offset: 61 * index,
                index
              })}
              // ItemSeparatorComponent={SeperatorComponent}
              // ListFooterComponent={
              //   !this.props.employeeList.get("isEnd") ? FooterComponent : null
              // }
            />}
      </Image>
    );
  }
}

class FooterComponent extends React.PureComponent {
  render() {
    return <ActivityIndicator size="large" />;
  }
}

class SeperatorComponent extends React.PureComponent {
  render() {
    return <View style={styles.divider} />;
  }
}

// Css for each view
const styles = StyleSheet.create({
  imgContainer: {
    width: undefined,
    height: undefined,
    backgroundColor: "transparent"
  },
  divider: {
    borderWidth: 0.2,
    borderColor: "#DDDDDD",
    alignSelf: "stretch"
  },
  picker_container: {
    height: 40,
    alignSelf: "stretch",
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 48
  },
  picker: {
    flexDirection: "row",
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8
  },
  childContainer: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  name: {
    flex: 1,
    color: "white",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    backgroundColor: "transparent"
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
});

function mapStateToProps(state) {
  return {
    employeeList: state.employeeList,
    allPosition: state.allPosition,
    allOutletInfo: state.allOutletInfo
  };
}

export default connect(mapStateToProps)(OutletList);
