import * as types from "./types";
import Api from "../libs/api";

export function getResultChecking(EmpATIDs, Month) {
  return (dispatch, getState) => {
    const params = {
      EmpATIDs,
      Month
    };
    return Api.post(`/API/RatingResult/GetRating`, params)
      .then(resp => {
        if (resp != null && resp.DuLieu != null && resp.DuLieu.length > 0) {
          if (resp.DuLieu[0].hasOwnProperty("MaNV")) {
            delete resp.DuLieu[0].MaNV;
          }

          dispatch({
            type: types.SET_RESULT_CHECKING_LIST,
            result: resp.DuLieu[0]
          });
        } else {
          dispatch({
            type: types.SET_RESULT_CHECKING_LIST,
            result: null
          });
        }
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_RESULT_CHECKING_LIST,
          result: null
        });
      });
  };
}

export function resetResultChecking() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      dispatch({
        type: types.RESET_RESULT_CHECKING_LIST
      });
    });
  };
}
