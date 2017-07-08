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
  TouchableWithoutFeedback
} = ReactNative;

const pickerData = [
  ["Tất cả"]
];

class EmployeeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isLoading: false,
			outlet: "Tất cả"
    };
  }

  componentWillMount() {
    //actions/checkInOut.js
    this.props.getAllOutlet().then( () => {
      if (!this.props.allOutletInfo.get('isError')) {
        console.log('haha');
      }
    });

    // actions/employeeList.js
    this.props.changeLoading().then(() => {
      this.props.fetchEmployeeList();
    });
  }

  _keyExtractor = (item, index) => {
    return item.get("MaNV");
  };

  renderListItem = item => {
    return <EmployeeItem {...this.props} item={item.item} />;
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

  _openDropDown() {
    Picker.init({
      pickerData: pickerData,
      pickerConfirmBtnText: language.get("choose"),
      pickerCancelBtnText: language.get("cancel"),
      pickerTitleText: "Cửa hàng",
      selectedValue: [this.state.outlet],
      onPickerConfirm: data => {
        this.setState({
          outlet: data
        }, () => {
          // this._getPaySlip(this.state.month);
        });
      },
      onPickerCancel: data => {},
      onPickerSelect: data => {}
    });
    Picker.show();
  }

  componentWillUnmount() {
    this.props.resetEmployeeList();
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
        <View style={styles.picker_container}>
          <TouchableWithoutFeedback onPress={() => this._openDropDown()}>
            <View style={styles.picker}>
              <Text>{ this.state.outlet }</Text>
              <Icon name="angle-down" size={15} color="#036380" />
            </View>
          </TouchableWithoutFeedback>
        </View>
        {/*FlatList */}
        <FlatList
          keyExtractor={this._keyExtractor}
          style={[styles.list]}
          data={this.props.employeeList.get("data").toArray()}
          renderItem={this.renderListItem}
          onEndReached={info => this._loadMore(info)}
          initialNumToRender={10}
          getItemLayout={(data, index) => ({
            length: 60,
            offset: 61 * index,
            index
          })}
          ItemSeparatorComponent={SeperatorComponent}
          ListFooterComponent={
            !this.props.employeeList.get("isEnd") ? FooterComponent : null
          }
        />
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
  }
});

function mapStateToProps(state) {
  return {
    employeeList: state.employeeList,
    allOutletInfo: state.allOutletInfo
  };
}

export default connect(mapStateToProps)(EmployeeList);
