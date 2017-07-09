/*
  Support get data from server
 */
import ReactNative from "react-native";
import * as UserUtils from "../utils/UserUtils";
import * as LogoutAction from "../actions/logout";

const { AsyncStorage } = ReactNative;

const baseUrl = "http://171.244.21.172:8084";

class Api {
  token = null;

  static headers() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: this.token
    };
  }

  static get(route) {
    return this.xhr(route, null, "GET");
  }

  static put(route, params) {
    return this.xhr(route, params, "PUT");
  }

  static post(route, params) {
    return this.xhr(route, params, "POST");
  }

  static postRaw(route, params) {
    return this.xhr(route, params, "POST", true);
  }

  static delete(route, params) {
    return this.xhr(route, params, "DELETE");
  }

  static setToken(loginToken) {
    return new Promise((resolve, reject) => {
      resolve(loginToken);


    }).then(() => {
      this.token = loginToken;
    });

  }

  static getBaseUrl() {
    return baseUrl;
  }

  static xhr(route, params, verb, raw) {
    const host = baseUrl;
    const url = `${host}${route}`;
    let options = Object.assign(
      { method: verb },
      params && !raw
        ? { body: JSON.stringify(params) }
        : raw ? { body: params } : null
    );
    options.headers = Api.headers();
    return fetch(url, options).then(resp => {
      let json = resp.json();
      if (resp.status == 500 || resp.status == 503 || resp.status == 401) {
        UserUtils.logoutWithoutRedux().then(() => {
          UserUtils.clearData();
        });

        throw "Token expired!";
      } else {
        if (resp.ok) {
          return json;
        }
      }

      return json.then(err => {
        throw err;
      });
    });
  }
}

export default Api;
