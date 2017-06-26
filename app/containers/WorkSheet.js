import React, { Component } from "react";
import ReactNative from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Colors, globalStyle } from "../style";
import Icon from "react-native-vector-icons/FontAwesome";
import * as language from "../language";
import { EmployeeItem, NoData, FieldSet } from "../components";
import moment from "moment";
import { Agenda } from "react-native-calendars";
import Picker from "react-native-picker";

var currentYear = new Date().getFullYear();
const pickerData = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
    currentYear - 4,
    currentYear - 5,
    currentYear - 6,
    currentYear - 7
  ]
];
const {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  TouchableWithoutFeedback
} = ReactNative;

class WorkSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      isLoading: false,
      items: {}
    };
  }

  componentWillMount() {
    this.props.getPaySlip(
      moment(new Date()).subtract(1, "months").format("YYYY-MM")
    );
  }

  loadItems(day) {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (!this.state.items[strTime]) {
          this.state.items[strTime] = [];
          const numItems = Math.floor(Math.random() * 5);
          for (let j = 0; j < numItems; j++) {
            this.state.items[strTime].push({
              name: "Item for " + strTime,
              height: Math.max(50, Math.floor(Math.random() * 150))
            });
          }
        }
      }
      console.log(this.state.items);
      const newItems = {};
      Object.keys(this.state.items).forEach(key => {
        newItems[key] = this.state.items[key];
      });
      this.setState({
        items: newItems
      });
    }, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);
  }

  renderItem(item) {
    return (
      <View style={[styles.item, { height: item.height }]}>
        <Text>{item.name}</Text>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}><Text>This is empty date!</Text></View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  }

  _openDropDown() {
    Picker.init({
      pickerData: pickerData,
      pickerConfirmBtnText: language.get("choose"),
      pickerCancelBtnText: language.get("cancel"),
      pickerTitleText: language.get("choose_a_month"),
      selectedValue: [1, currentYear],
      onPickerConfirm: data => {
        console.log(data);
      },
      onPickerCancel: data => {},
      onPickerSelect: data => {}
    });
    Picker.show();
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
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <View style={styles.picker_container}>
            <TouchableWithoutFeedback onPress={() => this._openDropDown()}>
              <View style={styles.picker}>
                <Text>{language.get("all")}</Text>
                <Icon name="calendar" size={15} color="#036380" />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.picker_container}>
            <TouchableWithoutFeedback onPress={() => this._openDropDown()}>
              <View style={styles.picker}>
                <Text>{language.get("all")}</Text>
                <Icon name="calendar" size={15} color="#036380" />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        {/*Calendar*/}
        <Agenda
          pastScrollRange={5}
          futureScrollRange={6}
          style={{ alignSelf: "stretch", backgroundColor: "transparent" }}
          items={this.state.items}
          loadItemsForMonth={this.loadItems.bind(this)}
          selected={"2017-05-16"}
          renderItem={this.renderItem.bind(this)}
          renderEmptyDate={this.renderEmptyDate.bind(this)}
          rowHasChanged={this.rowHasChanged.bind(this)}
          hideKnob={true}
          // monthFormat={'yyyy'}
          //theme={{calendarBackground: 'red'}}
          //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
        />

      </Image>
    );
  }
}

// Css for each view
const styles = StyleSheet.create({
  imgContainer: {
    width: undefined,
    height: undefined,
    backgroundColor: "transparent"
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  picker_container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 8,
    marginHorizontal: 4
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
    detailSalaryInfo: state.detailSalaryInfo
  };
}

export default connect(mapStateToProps)(WorkSheet);
