/*
  Support get data from server
 */
import ReactNative from "react-native";

const { AsyncStorage } = ReactNative;

const baseUrl = "http://checkin.koithe.vn";

class KoiApi {
  token = null;

  static headers() {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNmNGI4ZjliN2IwMjg1NGQ2MDk4MThkZjJlYzliMjFmNjMxNzYzYjY2MjY4Y2JmZWNjMDk1MDdiZDUwMWQzY2ZkZTc2MTY5NWQ3MDYxMjBlIn0.eyJhdWQiOiIzIiwianRpIjoiY2Y0YjhmOWI3YjAyODU0ZDYwOTgxOGRmMmVjOWIyMWY2MzE3NjNiNjYyNjhjYmZlY2MwOTUwN2JkNTAxZDNjZmRlNzYxNjk1ZDcwNjEyMGUiLCJpYXQiOjE0OTcwNjI4NzksIm5iZiI6MTQ5NzA2Mjg3OSwiZXhwIjoxNTI4NTk4ODc5LCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.nUOaTDkh8LYHmI5pjEZA31jfqDfctrkyTKuItD1kMw2882T88xnOysDfYbIWyTKQIMt2Wuovoff66ENDUbgXy2xYHrtpWptSVACR1ZAhbk-ZDuTeKXZIU8-6f_OiH04Q14Y9zonrZRFNawF8uCwVVOP94Z2pbSK3txlxZgXfvx0sqFuR4nxN2YK-cDsCHHn6tojq7GksSVpcAdfm08HeGR8gGsb6042f_RtXfImosxFtMAm4Xcphx_4uY3tyX3mZ5Rv6y_WsE9tnoCMfHmnFc7k9GqsikmcrN5hkGQ2FC-NdpJxiIrnuGDjbqAdKrRiYoMc-dn-Spcy3aVQ7_jqPTWJCdSqkX07jnPauT9zDQo8ITjD2_ORSEqvtunQDEPrpprM4jv793qTnate2qwdaw5oeZh4inw7fuURge7ZAYZ6PJC3gTz7vOeDBAGDQmfn5pIt-AEZnBEHwr54EMRSeuI3K8ZZgS0_p6RK1gitsKIPZa9ZP2ib1VkTw6wcGe5blEYJUI8otfop6zsjk_zs-XKqc3BgguYJd-lTin8VCdzMjFXN-6IScqhyy1vtqUZydoBxgeksZSpxFSivrogHJ7LDflNQSFK6CWB8QDagwnraG0gXiB8iseXL9_DB4ZSORc0RzSa2Uo17sHKz8PmPh_kbFJXw8pXxzInMwdzPXRdE"
    };
  }

  static jsonHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImNmNGI4ZjliN2IwMjg1NGQ2MDk4MThkZjJlYzliMjFmNjMxNzYzYjY2MjY4Y2JmZWNjMDk1MDdiZDUwMWQzY2ZkZTc2MTY5NWQ3MDYxMjBlIn0.eyJhdWQiOiIzIiwianRpIjoiY2Y0YjhmOWI3YjAyODU0ZDYwOTgxOGRmMmVjOWIyMWY2MzE3NjNiNjYyNjhjYmZlY2MwOTUwN2JkNTAxZDNjZmRlNzYxNjk1ZDcwNjEyMGUiLCJpYXQiOjE0OTcwNjI4NzksIm5iZiI6MTQ5NzA2Mjg3OSwiZXhwIjoxNTI4NTk4ODc5LCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.nUOaTDkh8LYHmI5pjEZA31jfqDfctrkyTKuItD1kMw2882T88xnOysDfYbIWyTKQIMt2Wuovoff66ENDUbgXy2xYHrtpWptSVACR1ZAhbk-ZDuTeKXZIU8-6f_OiH04Q14Y9zonrZRFNawF8uCwVVOP94Z2pbSK3txlxZgXfvx0sqFuR4nxN2YK-cDsCHHn6tojq7GksSVpcAdfm08HeGR8gGsb6042f_RtXfImosxFtMAm4Xcphx_4uY3tyX3mZ5Rv6y_WsE9tnoCMfHmnFc7k9GqsikmcrN5hkGQ2FC-NdpJxiIrnuGDjbqAdKrRiYoMc-dn-Spcy3aVQ7_jqPTWJCdSqkX07jnPauT9zDQo8ITjD2_ORSEqvtunQDEPrpprM4jv793qTnate2qwdaw5oeZh4inw7fuURge7ZAYZ6PJC3gTz7vOeDBAGDQmfn5pIt-AEZnBEHwr54EMRSeuI3K8ZZgS0_p6RK1gitsKIPZa9ZP2ib1VkTw6wcGe5blEYJUI8otfop6zsjk_zs-XKqc3BgguYJd-lTin8VCdzMjFXN-6IScqhyy1vtqUZydoBxgeksZSpxFSivrogHJ7LDflNQSFK6CWB8QDagwnraG0gXiB8iseXL9_DB4ZSORc0RzSa2Uo17sHKz8PmPh_kbFJXw8pXxzInMwdzPXRdE"
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

  static postJson(route, params) {
    return this.xhrJson(route, params, "POST");
  }

  static postRaw(route, params) {
    return this.xhr(route, params, "POST", true);
  }

  static delete(route, params) {
    return this.xhr(route, params, "DELETE");
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
    let options = Object.assign(
      { method: verb },
      params && !raw
        ? { body: JSON.stringify(params) }
        : raw ? { body: params } : null
    );
    options.headers = KoiApi.headers();
    return fetch(url, options).then(resp => {
      let json = resp.json();
      if (resp.ok) {
        return json;
      }
      return json.then(err => {
        throw err;
      });
    });
  }

  static xhrJson(route, params, verb, raw) {
    const host = baseUrl;
    const url = `${host}${route}`;
    let options = Object.assign(
      { method: verb },
      { body: JSON.stringify(params) }
    );
    options.headers = KoiApi.jsonHeaders();
    return fetch(url, options).then(resp => {
      let json = resp.json();
      if (resp.ok) {
        return json;
      }
      return json.then(err => {
        throw err;
      });
    });
  }
}

export default KoiApi;
