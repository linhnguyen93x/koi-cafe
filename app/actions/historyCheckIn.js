import * as types from "./types";
import Api from "../libs/api";

export function getHistoryCheckIn(EmpATIDs, FromDate, ToDate) {
  return (dispatch, getState) => {
    const params = {
      EmpATIDs,
      FromDate,
      ToDate
    };
    return Api.post(`/API/TimeCard/GetTimeCard`, params)
      .then(resp => {
        if (resp != null && resp.DuLieu != null && resp.DuLieu.length > 0) {
          if (resp.DuLieu[0].hasOwnProperty("MaNV")) {
            delete resp.DuLieu[0].MaNV;
          }

          dispatch({
            type: types.SET_HISTORY_CHECKIN_LIST,
            result: resp.DuLieu[0]
          });
        } else {
          dispatch({
            type: types.SET_HISTORY_CHECKIN_LIST,
            result: null
          });
        }
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_HISTORY_CHECKIN_LIST,
          result: null
        });
      });
  };
}

export function resetHistoryCheckIn() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      dispatch({
        type: types.RESET_HISTORY_CHECKIN_LIST
      });
    });
  };
}
