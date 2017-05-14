/*
  Support get data from server
 */
import ReactNative from 'react-native'

const {
  AsyncStorage,
} = ReactNative

const baseUrl = 'http://eshopper.fcv-etools.com';


class Api {
  token = null;


  static headers() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'appVersion': '1.0',
      'Authorization': this.token,
    }
  }

  static get(route) {
    return this.xhr(route, null, 'GET');
  }

  static put(route, params) {
    return this.xhr(route, params, 'PUT');
  }

  static post(route, params) {
    return this.xhr(route, params, 'POST');
  }

  static delete(route, params) {
    return this.xhr(route, params, 'DELETE');
  }

  static setToken(loginToken) {
    this.token = loginToken;
  }

  static getBaseUrl() {
    return baseUrl;
  }

  static xhr(route, params, verb) {
    const host = baseUrl;
    const url = `${host}${route}`;
    let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null);
    options.headers = Api.headers();
    return fetch(url, options).then(resp => {
      let json = resp.json();
      if (resp.ok) {
        return json;
      }
      return json.then(err => { throw err });
    });
  }
}

export default Api