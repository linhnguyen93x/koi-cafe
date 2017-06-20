import * as types from "./types";
import KoiApi from "../libs/koiApi";

export function getUserOutlet(userCode) {
  return (dispatch, getState) => {
    return KoiApi.get(`/api/getcuahang`)
      .then(resp => {
        if (resp != null && resp.length > 0) {
          let employeeStore = resp.filter(el => {
            return userCode == el.macuahang;
          });
          dispatch({
            type: types.SET_EMPLOYEE_OUTLET_INFO,
            employeeStore: employeeStore.length > 0 ? employeeStore[0] : null
          });
        } else {
          dispatch({
            type: types.SET_EMPLOYEE_OUTLET_INFO,
            employeeStore: null
          });
        }
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_EMPLOYEE_OUTLET_INFO,
          employeeStore: null
        });
      });
  };
}

export function getIpOutlet(outletInfo) {
  return (dispatch, getState) => {
    return KoiApi.get(`/api/getip`)
      .then(resp => {
        if (resp != null && resp.length > 0) {
          let outletIps = resp.filter(el => {
            return outletInfo.id == el.id_cuahang;
          });
          dispatch({
            type: types.SET_EMPLOYEE_OUTLET_IP,
            outletIps: outletIps.length > 0 ? outletIps : null
          });
        } else {
          dispatch({
            type: types.SET_EMPLOYEE_OUTLET_IP,
            outletIps: null
          });
        }
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_EMPLOYEE_OUTLET_IP,
          outletIps: null
        });
      });
  };
}

export function getCheckStatus(date) {
  return (dispatch, getState) => {
    return KoiApi.get(`/hrkoi/api/getchamcong?from=${date}&to=${date}`)
    .then(resp => {
      if (resp != null) {
        dispatch({
          type: types.SET_CHECK_STATUS,
          status: resp[0]
        });
      } else {
        dispatch({
          type: types.SET_CHECK_STATUS,
          status: null
        });
      }
    })
    .catch(ex => {
      console.log(ex);
      dispatch({
        type: types.SET_CHECK_STATUS,
        status: null
      });
    });
  };
}

export function submitCheckInOut(UserId, InOutletMode, MacAdress, OS, Location) {
  return (dispatch, getState) => {
    const params = [
      `UserID=${UserId}`,
      `InOutletMode=${InOutletMode}`,
      `MacAdress=${MacAdress}`,
      `OS=${OS}`,
      `Location=${Location}`
    ].join('&');

    return KoiApi.postRaw(`/api/postcheckinout`, params)
    .then(resp => {
      console.log(resp);
      if (resp.hasOwnProperty('error')) {
        console.log(resp.error);
      }
    })
    .catch(ex => {
      console.log(ex);
    });
  }
}
