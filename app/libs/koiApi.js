/*
  Support get data from server
 */
import ReactNative from 'react-native'

const {
  AsyncStorage,
} = ReactNative

const baseUrl = 'http://checkin.koithe.vn';


class KoiApi {
  token = null;

  static headers() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
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

  static postRaw(route, params) {
    return this.xhr(route, params, 'POST', true);
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

  static xhr(route, params, verb, raw) {
    const host = baseUrl;
    const url = `${host}${route}`;
    let options = Object.assign({ method: verb }, (params && !raw) ?
       { body: JSON.stringify(params) } : raw ?
        { body: params } : null);
    options.headers = KoiApi.headers();
    return fetch(url, options).then(resp => {
      let json = resp.json();
      if (resp.ok) {
        return json;
      }
      return json.then(err => { throw err });
    });
  }
}

export default KoiApi
