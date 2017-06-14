import React, { Component } from "react";
import ReactNative from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import * as language from "../language";
import { Colors, globalStyle } from "../style";
import Api from "../libs/api";
import KoiApi from "../libs/koiApi";

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
  Alert
} = ReactNative;

class SubmitLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmit: false,
      username: null,
      password: null,
      buttonText: "Đăng nhập"
    };
  }

  componenDidMount() {}

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.error("AsyncStorage error: " + error.message);
    }
  }

  userLogin() {
    if (!this.state.username || !this.state.password) {
      Alert.alert("Đăng nhập thất bại!", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    // Call Api... actions/login.js
    this.setState({ buttonText: "Đang kết nối..." });
    this.props.login(this.state.username, this.state.password).then(() => {
      if (!this.props.loginFail) {
        AsyncStorage.setItem(
          "id_token",
          this.props.info.token_type + " " + this.props.info.access_token
        ).then(() => {
          Api.setToken(
            this.props.info.token_type + " " + this.props.info.access_token
          );
          KoiApi.setToken(
            this.props.info.token_type + " " + this.props.info.access_token
          );

          this.props.fetchEmployeeList().then(() => {
            if (
              this.props.employeeList.get("data") != null &&
              this.props.employeeList.get("data").count() > 0
            ) {
              let userLogin = this.props.employeeList
                .get("data")
                .first()
                .toJS();
              AsyncStorage.setItem("user", JSON.stringify(userLogin));
              Actions.home({ type: "reset" });
            } else {
              Actions.logout();
            }
          });
        });

        // Alert.alert('Login Success!', 'Click the button to get a Chuck Norris quote!');
      } else {
        this.setState({ buttonText: "Đăng nhập" });
        Alert.alert("Đăng nhập thất bại!", "Vui lòng đăng nhập lại");
      }
    });
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.inputWrap}>
          <TextInput
            placeholder={language.get("username")}
            style={styles.input}
            underlineColorAndroid="white"
            returnKeyType="next"
            value={this.state.username}
            onSubmitEditing={() => this.passwordInput.focus()}
            selectTextOnFocus={true}
            onChangeText={username => this.setState({ username })}
          />
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            placeholder={language.get("password")}
            secureTextEntry
            style={styles.input}
            underlineColorAndroid="white"
            returnKeyType="go"
            value={this.state.password}
            selectTextOnFocus={true}
            ref={input => (this.passwordInput = input)}
            onChangeText={password => this.setState({ password })}
          />
        </View>
        <TouchableOpacity activeOpacity={0.5} onPress={() => {}}>
          <Text style={styles.forgetPassword}>
            {language.get("forget_password")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.userLogin.bind(this)}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>{this.state.buttonText}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

// Css for each view
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 16,
    alignSelf: "stretch",
    paddingHorizontal: 36
  },
  inputWrap: {
    flexDirection: "row",
    marginVertical: 4,
    marginHorizontal: 20,
    height: 40,
    backgroundColor: "transparent"
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    color: "white"
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    marginVertical: 24,
    marginHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50
  },
  buttonText: {
    color: Colors.button_text_color,
    fontSize: 16
  },
  forgetPassword: {
    color: Colors.text_secondary,
    alignSelf: "flex-end",
    paddingVertical: 8,
    fontSize: 12
  }
});

function mapStateToProps(state) {
  return {
    employeeList: state.employeeList,
    info: state.info,
    loginFail: state.loginFail
  };
}

export default connect(mapStateToProps)(SubmitLogin);
