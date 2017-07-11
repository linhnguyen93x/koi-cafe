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

var currentYear = new Date().getFullYear();
const pickerData = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
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
  ScrollView,
  TouchableWithoutFeedback,
  Linking,
  Platform
} = ReactNative;

class UserChecked extends Component {
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

  _searchData = async () => {
    let user = this.props.item;

    if (user != null) {
      this.setState({
        isLoading: true
      });
      // actions/checkInOut.js
      this.props
        .getUserChecked(user.get('MaNV'), this.state.fromDate)
        .then(() => {
          this.setState({
            isLoading: false,
            items:
              this.props.userCheckedList.get('data') != null
                ? this.props.userCheckedList.get('data')
                : {}
          });
        });
    }
  };

  _openUrl = item => {
    const scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    const prefix = Platform.OS === 'ios' ? '' : '?q=' + item.get('Location');
    const location = scheme + item.get('Location') + prefix;

    Linking.openURL(location);
  };

  componentWillUnmount() {
    this.props.resetUserChecked();
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
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 4,
            backgroundColor: 'transparent'
          }}
        >
          <View style={styles.picker_container}>
            <DatePicker
              style={{ width: 200, backgroundColor: 'white' }}
              date={this.state.fromDate}
              mode="date"
              maxDate={moment(new Date()).format('YYYY-MM-DD')}
              androidMode="spinner"
              placeholder={language.get('month')}
              format="YYYY-MM-DD"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                },
                dateText: {
                  paddingRight: 6
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={date => {
                this.setState({ fromDate: date });
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
          : this.props.userCheckedList.get('data').count() > 0
            ? <ScrollView style={{ marginVertical: 4, alignSelf: 'stretch' }}>
                {this.props.userCheckedList.get('data').toArray().map(item => {
                  return (
                    <View key={item.get('id')}>
                      <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                          {item.get('InOutMode') == 1
                            ? 'Check In'
                            : item.get('InOutMode') == 3
                              ? 'Check In - Middle'
                              : item.get('InOutMode') == 4
                                ? 'Check out - Middle'
                                : 'Check Out'}
                        </Text>
                      </View>

                      <View style={styles.container}>
                        <Text style={styles.textColor}>
                          {language.get('time')}
                          <Text style={styles.textColorBlue}>
                            {moment(item.get('Time')).format(
                              'DD/MM/YYYY H:mm:ss'
                            )}
                          </Text>
                        </Text>
                        <Text style={styles.textColor}>
                          {language.get('mac_address')}
                          <Text style={styles.textColorBlue}>
                            {item.get('MacAddress')}
                          </Text>
                        </Text>
                        <Text
                          style={[styles.textColor, { paddingHorizontal: 8 }]}
                        >
                          {language.get('os')}
                          <Text style={styles.textColorBlue}>
                            {item.get('OS')}
                          </Text>
                        </Text>
                        <Text style={styles.textColor}>
                          {language.get('location')}
                          {item.get('Location') != null
                            ? <Text style={styles.textColorBlue}>
                                {item.get('Location')}
                              </Text>
                            : null}
                        </Text>
                        <TouchableOpacity
                          activtyOpacity={0.5}
                          onPress={() => this._openUrl(item)}
                        >
                          <View
                            style={{
                              borderBottomWidth: 1,
                              borderColor: 'white'
                            }}
                          >
                            <Text style={{ color: 'white' }}>
                              <Icon name="map" size={15} color="white" />{' '}
                              {language.get('view_location')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            : <Text style={{ color: 'white' }}>
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
    backgroundColor: 'transparent',
    alignItems: 'center'
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
    alignSelf: 'stretch',
    backgroundColor: 'transparent',

    marginTop: 8,
    marginHorizontal: 4
  },
  picker: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  container: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',

    borderWidth: 1,
    borderColor: 'white',
    marginVertical: 8,
    marginHorizontal: 4,
    zIndex: 0
  },
  titleContainer: {
    position: 'absolute',
    top: -2,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    zIndex: 1,
    backgroundColor: 'black'
  },
  textItemValue: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    alignSelf: 'stretch',
    backgroundColor: Colors.colorPrimaryDark
  },
  textColor: {
    color: 'white'
  },
  textColorBlue: {
    color: Colors.colorPrimary
  }
});

function mapStateToProps(state) {
  return {
    userCheckedList: state.userCheckedList
  };
}

export default connect(mapStateToProps)(UserChecked);
