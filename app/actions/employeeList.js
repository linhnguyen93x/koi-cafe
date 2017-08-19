import * as types from "./types";
import Api from "../libs/api";
import KoiApi from "../libs/koiApi";
import * as language from "../language";

export function fetchEmployeeList() {
  return (dispatch, getState) => {
    return Api.post(`/API/Employee/GetEmployee`)
      .then(resp => {
        const result = {
          data: resp
        };

        dispatch(bindEmployeeList(result));
      })
      .catch(ex => {
        console.log(ex);
        const result = {
          isError: true
        };

        dispatch(bindEmployeeList(result));
      });
  };
}

export function uploadAvatar(maNV, avatar) {
  return (dispatch, getState) => {
    const params = {
      UserID: maNV,
      image: avatar
    };

    return KoiApi.postJson(`/api/postavatar`, params)
      .then(resp => {
        if (!resp.hasOwnProperty("error")) {
          dispatch({
            type: types.SET_AVATAR,
            result: resp,
            isError: false
          });
        } else {
          dispatch({
            type: types.SET_AVATAR,
            result: resp.error,
            isError: true
          });
        }
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_AVATAR,
          result: "Upload avatar failed",
          isError: true
        });
      });
  };
}

export function getAvatar(userID) {
  return (dispatch, getState) => {
    const params = {
      UserID: userID
    };
    return Api.post(`/api/checkimage`, params)
      .then(resp => {
        dispatch({
          type: types.SET_AVATAR,
          result: resp
        });
        console.log(resp);
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_AVATAR,
          result: null
        });
      });
  };
}

export function getAllPosition(token) {
  return (dispatch, getState) => {
    const params = {
      token: token
    };

    return KoiApi.postJson(`/api/layloainhanvien`, params)
      .then(resp => {
        if (resp != null && resp.length > 0) {
          dispatch({
            type: types.SET_ALL_POSITION,
            result: resp.length > 0 ? resp : null
          });
        } else {
          dispatch({
            type: types.SET_ALL_POSITION,
            result: null
          });
        }
      })
      .catch(ex => {
        console.log(ex);
        dispatch({
          type: types.SET_ALL_POSITION,
          result: null
        });
      });
  };
}

export function bindEmployeeList(result) {
  return {
    type: types.SET_EMPLOYEE_LIST,
    result
  };
}

export function filterEmployeeByCat(data, search, byMaCuaHang) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      let newData;

      if (search == language.get("all")) {
        newData = data;
      } else {
        newData = data.filter(item => {
          if (byMaCuaHang) {
            return search == item.get("MaCuaHang");
          } else {
            return search == item.get("LoaiNhanVien");
          }
        });
      }

      dispatch(bindEmployeeList({ data: { DuLieu: newData } }));

      resolve();
    });
  };
}

// Change indicator loading
export function changeLoading() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      dispatch(setChangeLoading());
    });
  };
}

export function setChangeLoading() {
  return {
    type: types.SET_CHANGE_LOADING
  };
}

export function resetEmployeeList() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      dispatch({
        type: types.RESET_EMPLOYEE_LIST
      });
    });
  };
}
