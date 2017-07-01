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

export function getCheckStatus(maNV, date) {
  return (dispatch, getState) => {
    return KoiApi.get(`/api/getchamcong?from=${date}&to=${date}`)
    .then(resp => {
      if (resp != null && resp.length > 0) {
        let userIp = resp.filter(el => {
            return maNV == el.UserID;
          });
      
        dispatch({
          type: types.SET_CHECK_STATUS,
          status: resp.length > 0 ? resp[0] : null
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

export function getUserChecked(maNV, date) {
  return (dispatch, getState) => {
    return KoiApi.get(`/api/getchamcong?from=${date}&to=${date}`)
    .then(resp => {
      if (resp != null && resp.length > 0) {
        let userIp = resp.filter(el => {
            return maNV == el.UserID;
          });
        dispatch({
          type: types.SET_CHECK_STATUS_LIST,
          status: userIp.length > 0 ? userIp : null
        });
      } else {
        dispatch({
          type: types.SET_CHECK_STATUS_LIST,
          status: null
        });
      }
    })
    .catch(ex => {
      console.log(ex);
      dispatch({
        type: types.SET_CHECK_STATUS_LIST,
        status: null
      });
    });
  };
}


export function submitCheckInOut(UserId, InOutMode, MacAddress, OS, Location) {
  return (dispatch, getState) => {
    const params = {
      UserID: UserId,
      InOutMode,
      MacAddress,
      OS,
      Location
    }

    return KoiApi.postJson(`/api/postcheckinout`, params)
    .then(resp => {
      dispatch({
        type: types.CHECK_SERVER_RESPONSE,
        result: resp,
        InOutMode
      })
      // console.log(resp);
      // if (resp.hasOwnProperty('error')) {
      //   console.log(resp.error);
      // }
    })
    .catch(ex => {
      console.log(ex);
      dispatch({
        type: types.CHECK_SERVER_RESPONSE,
        result: null,
        InOutMode
      })
    });
  }
}

export function resetUserChecked() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      dispatch({
        type: types.RESET_USER_CHECKED
      });
    });
  };
}