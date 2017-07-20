import React, { Component } from 'react';
import ReactNative from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import * as language from '../language';
import { Colors, globalStyle } from '../style';
import Api from '../libs/api';
import KoiApi from '../libs/koiApi';
import Picker from 'react-native-picker';
import RNRestart from 'react-native-restart';

// All Component react for render view
const {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert,
  TouchableWithoutFeedback
} = ReactNative;

const pickerData = ['vi', 'zh'];

class SubmitLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmit: false,
      username: null,
      password: null,
      buttonText: language.get('login'),
      language: pickerData[0]
    };
  }

  async componentWillMount() {
    let language = await AsyncStorage.getItem('language');
    if (language != null) {
      this.setState({
        language: language
      });
    }
  }

  componenDidMount() {}

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  userLogin() {
    if (!this.state.username || !this.state.password) {
      Alert.alert(language.get('login_fail_miss_info'));
      return;
    }

    // Call Api... actions/login.js
    this.setState({ buttonText: language.get('connecting') });
    this.props.login(this.state.username, this.state.password).then(() => {
      if (!this.props.loginFail) {
        AsyncStorage.setItem(
          'id_token',
          this.props.info.token_type + ' ' + this.props.info.access_token
        ).then(() => {
          Api.setToken(
            this.props.info.token_type + ' ' + this.props.info.access_token
          ).then(() => {
            Actions.home({ type: 'reset' });
          });
        });

        // KoiApi.setToken(
        //   this.props.info.token_type + " " + this.props.info.access_token
        // );

        // Alert.alert('Login Success!', 'Click the button to get a Chuck Norris quote!');
      } else {
        this.setState({ buttonText: language.get('login') });
        Alert.alert(language.get('login_fail_try_again'));
      }
    });
  }

  _openDropDown() {
    Picker.init({
      pickerData: pickerData,
      pickerConfirmBtnText: language.get('choose'),
      pickerCancelBtnText: language.get('cancel'),
      pickerTitleText: language.get('choose_language'),
      selectedValue: [this.state.language],
      onPickerConfirm: data => {
        this.setState(
          {
            language: data[0]
          },
          () => {
            this.props.changeLanguage(data[0]).then(() => {
              RNRestart.Restart();
            });
          }
        );
      },
      onPickerCancel: data => {},
      onPickerSelect: data => {}
    });
    Picker.show();
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.picker_container}>
          <TouchableWithoutFeedback onPress={() => this._openDropDown()}>
            <View style={styles.picker}>
              <Text>
                {language.get('language') + ': ' + this.state.language}
              </Text>
              {/* <Icon name="calendar" size={15} color="#036380" /> */}
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            placeholder={language.get('username')}
            placeholderTextColor="white"
            style={styles.input}
            underlineColorAndroid="transparent"
            returnKeyType="next"
            value={this.state.username}
            onSubmitEditing={() => this.passwordInput.focus()}
            selectTextOnFocus={true}
            onChangeText={username => this.setState({ username })}
          />
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            placeholder={language.get('password')}
            placeholderTextColor="white"
            secureTextEntry
            style={styles.input}
            underlineColorAndroid="transparent"
            returnKeyType="go"
            value={this.state.password}
            selectTextOnFocus={true}
            ref={input => (this.passwordInput = input)}
            onChangeText={password => this.setState({ password })}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.userLogin.bind(this)}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              {this.state.buttonText}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

// Css for each view
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 3,
    alignSelf: 'stretch',
    paddingHorizontal: 36
  },
  inputWrap: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 20,
    height: 40,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderColor: 'white'
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: 'white'
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    marginBottom: 24,
    marginTop: 5,
    marginHorizontal: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  },
  buttonText: {
    color: Colors.button_text_color,
    fontSize: 16
  },
  forgetPassword: {
    color: Colors.text_secondary,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    fontSize: 12
  },
  picker_container: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 48
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
    info: state.info,
    loginFail: state.loginFail
  };
}

export default connect(mapStateToProps)(SubmitLogin);
