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

/**
 * [getAllOutlet Get all outlet use for dropdown]
 * @return {[type]} [description]
 */
export function getAllOutlet() {
  return (dispatch, getState) => {
    return KoiApi.get(`/api/getcuahang`)
      .then(resp => {
        if (resp != null && resp.length > 0) {
          dispatch({
            type: types.SET_ALL_OUTLET_INFO,
            result: resp.length > 0 ? resp : null
          });
        } else {
          dispatch({
            type: types.SET_ALL_OUTLET_INFO,
            result: null
          });
        }
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_ALL_OUTLET_INFO,
          result: null
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
            return (
              maNV == el.UserID && (el.InOutMode == 1 || el.InOutMode == 2)
            );
          });

          let checkMiddle = resp.filter(el => {
            return (
              maNV == el.UserID && (el.InOutMode == 3 || el.InOutMode == 4)
            );
          });

          dispatch({
            type: types.SET_CHECK_STATUS,
            status:
              userIp.length > 0
                ? userIp[0]
                : {
                    id: undefined,
                    UserID: undefined,
                    Time: undefined,
                    InOutMode: 0,
                    MacAddress: undefined,
                    OS: undefined,
                    Location: undefined
                  },
            statusMiddle:
              checkMiddle.length > 0
                ? checkMiddle[0]
                : {
                    id: undefined,
                    UserID: undefined,
                    Time: undefined,
                    InOutMode: 0,
                    MacAddress: undefined,
                    OS: undefined,
                    Location: undefined
                  }
          });
        } else {
          dispatch({
            type: types.SET_CHECK_STATUS,
            status: {
              id: undefined,
              UserID: undefined,
              Time: undefined,
              InOutMode: 0,
              MacAddress: undefined,
              OS: undefined,
              Location: undefined
            },
            statusMiddle: {
              id: undefined,
              UserID: undefined,
              Time: undefined,
              InOutMode: 0,
              MacAddress: undefined,
              OS: undefined,
              Location: undefined
            }
          });
        }
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_CHECK_STATUS,
          status: null,
          statusMiddle: null
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
    };

    return KoiApi.postJson(`/api/postcheckinout`, params)
      .then(resp => {
        dispatch({
          type: types.CHECK_SERVER_RESPONSE,
          result: resp,
          InOutMode
        });
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
        });
      });
  };
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

export function resetUserOutlet() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      dispatch({
        type: types.RESET_USER_OUTLET
      });
    });
  };
}
