import React, { Component } from 'react';
import ReactNative, { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { Colors, globalStyle } from '../style';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as language from '../language';
import { EmployeeItem, NoData, FieldSet } from '../components';
import moment from 'moment';
import { Agenda } from 'react-native-calendars';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';

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
      search: '',
      isLoading: false,
      items: {},
      fromDate: null,
      toDate: null
    };
  }

  componentWillMount() {}

  loadItems(day) {
    setTimeout(() => {
      for (
        let i = 1;
        i < Object.keys(this.props.workSheetList.get('data')).length;
        i++
      ) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);
        if (this.state.items[strTime]) {
          // for (let j = 0; j < this.state.items[strTime].length; j++) {
          //   this.state.items[strTime][j].name = "Item for " + strTime;
          // }
        } else {
          this.state.items[strTime] = [];
        }
      }

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
        <Text>
          {item.name}
        </Text>
        <Text>
          {language.get('from') + ' ' + item.Tu} -{' '}
          {language.get('to') + ' ' + item.Den}
        </Text>
      </View>
    );
  }

  renderEmptyDate() {
    return (
      <View style={styles.emptyDate}>
        <Text>
          {language.get('no_data')}
        </Text>
      </View>
    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  _openDropDown() {
    Picker.init({
      pickerData: pickerData,
      pickerConfirmBtnText: language.get('choose'),
      pickerCancelBtnText: language.get('cancel'),
      pickerTitleText: language.get('choose_a_month'),
      selectedValue: [1, currentYear],
      onPickerConfirm: data => {
        console.log(data);
      },
      onPickerCancel: data => {},
      onPickerSelect: data => {}
    });
    Picker.show();
  }

  _searchData = async () => {
    let user = JSON.parse(await AsyncStorage.getItem('user'));

    if (user != null) {
      this.setState({
        isLoading: true
      });
      this.props
        .getWorksheet(
          [{ EmpATID: user.MaNV }],
          this.state.fromDate,
          this.state.toDate
        )
        .then(() => {
          this.setState({
            isLoading: false,
            items:
              this.props.workSheetList.get('data') != null
                ? this.props.workSheetList.get('data')
                : {}
          });
        });
    }
  };

  componentWillUnmount() {
    this.props.resetWorkSheet();
  }

  render() {
    return (
      <Image
        style={[
          styles.imgContainer,
          globalStyle.container,
          globalStyle.mainPaddingTop
        ]}
        source={require('../../assets/backgrounds/main_bg.png')}
        resizeMode={Image.resizeMode.cover}
      >
        <View style={{ flexDirection: 'row', marginBottom: 4 }}>
          <View style={styles.picker_container}>
            <DatePicker
              style={{ width: 200 }}
              date={this.state.fromDate}
              mode="date"
              // maxDate={moment(new Date()).format("YYYY-MM-DD")}
              androidMode="spinner"
              placeholder={language.get('from_date')}
              format="YYYY-MM-DD"
             confirmBtnText={language.get('confirm')}
              cancelBtnText={language.get('cancel')}
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 0
                },
                dateText: {
                  paddingRight: 60
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => {
                this.setState({ fromDate: date });
              }}
            />
          </View>
          <View style={styles.picker_container}>
            <DatePicker
              style={{ width: 200 }}
              date={this.state.toDate}
              mode="date"
              androidMode="spinner"
              placeholder={language.get('to_date')}
              format="YYYY-MM-DD"
              // maxDate={moment(new Date()).format("YYYY-MM-DD")}
              confirmBtnText={language.get('confirm')}
              cancelBtnText={language.get('cancel')}
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 0,
                  paddingHorizontal: 0
                },
                dateText: {
                  paddingRight: 60
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => {
                this.setState({ toDate: date });
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              this._searchData();
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 8,
                backgroundColor: 'white',
                marginTop: 8
              }}
            >
              <Icon name="search" size={20} color="blue" />
            </View>
          </TouchableOpacity>
        </View>

        {this.state.isLoading
          ? <ActivityIndicator />
          : this.props.workSheetList.get('data') != null
            ? <Agenda
                style={{ alignSelf: 'stretch', backgroundColor: 'transparent' }}
                items={this.state.items}
                loadItemsForMonth={this.loadItems.bind(this)}
                selected={Object.keys(this.props.workSheetList.get('data'))[0]}
                renderItem={this.renderItem.bind(this)}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
                hideKnob={false}

                // monthFormat={'yyyy'}
                //theme={{calendarBackground: 'red'}}
                //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
              />
            : <Text
                style={{
                  color: 'white',
                  backgroundColor: 'transparent',
                  textAlign: 'center'
                }}
              >
                {language.get('no_data')}
              </Text>}
      </Image>
    );
  }
}

// Css for each view
const styles = StyleSheet.create({
  imgContainer: {
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent'
  },
  item: {
    backgroundColor: 'white',
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
    backgroundColor: 'white',

    marginTop: 8,
    marginHorizontal: 4
  },
  picker: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8
  }
});

function mapStateToProps(state) {
  return {
    workSheetList: state.workSheetList
  };
}

export default connect(mapStateToProps)(WorkSheet);
