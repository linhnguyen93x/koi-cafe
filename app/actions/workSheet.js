import * as types from "./types";
import Api from "../libs/api";

export function getWorksheet(EmpATIDs, FromDate, ToDate) {
  return (dispatch, getState) => {
    const params = {
      EmpATIDs,
      FromDate,
      ToDate
    };
    return Api.post(`/API/Roaster/GetRoaster`, params)
      .then(resp => {
        if (resp != null && resp.DuLieu != null && resp.DuLieu.length > 0) {
          if (resp.DuLieu[0].hasOwnProperty("MaNV")) {
            delete resp.DuLieu[0].MaNV;
          }

          dispatch({
            type: types.SET_WORK_SHEET_LIST,
            result: resp.DuLieu[0]
          });
        } else {
          dispatch({
            type: types.SET_WORK_SHEET_LIST,
            result: null
          });
        }
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_WORK_SHEET_LIST,
          result: null
        });
      });
  };
}

export function resetWorkSheet() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      dispatch({
        type: types.RESET_WORK_SHEET_LIST
      });
    });
  };
}
