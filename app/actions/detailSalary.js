import * as types from "./types";
import Api from "../libs/api";

export function getPaySlip(time) {
  return (dispatch, getState) => {
    const params = {
      Month: time
    };
    return Api.post(`/API/PaySlip/GetPaySlip`, params)
      .then(resp => {
        dispatch({
          type: types.SET_DETAIL_SALARY_INFO,
          result: resp
        });
        console.log(resp);
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_DETAIL_SALARY_INFO,
          result: null
        });
      });
  };
}

export function setLoginSuccess({ customer }) {
  return {
    type: types.LOGIN_SUCCESS,
    customer
  };
}

export function setLoginFail() {
  return {
    type: types.LOGIN_FAIL
  };
}
