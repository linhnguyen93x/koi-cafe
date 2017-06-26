import { AsyncStorage } from "react-native";
import { Actions } from 'react-native-router-flux'
import Api from '../libs/api.js'

export const getRole = async () => {
  let user = JSON.parse(await AsyncStorage.getItem("user"));

  return user.ChucVu;
};

export const getUserInfo = async () => {
  let user = JSON.parse(await AsyncStorage.getItem("user"));

  return user;
};

export const clearData = async () => {
  try {
    // clear app key for user
    let keys = ["id_token", "user"];

    AsyncStorage.multiRemove(keys, err => {
      // keys k1 & k2 removed, if they existed
      // do most stuff after removal (if you want)
    });

    await AsyncStorage.clear();
    Actions.login({ type: "reset" });
  } catch (error) {
    console.log("AsyncStorage error: " + error.message);
  }
};

export const logoutWithoutRedux = () => {
  return new Promise((resolve, reject) => {
    resolve();
  }).then(() => {
    Api.get("/API/Logout")
      .then(resp => {
        console.log("Log out ok");
      })
      .catch(ex => {
        console.log(ex);
      });
  });
};
