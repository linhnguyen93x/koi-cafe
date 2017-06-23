import * as types from "./types";
import Api from "../libs/api";

export function logout() {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      Api.get("/API/Logout").then(resp => {
				console.log("Log out ok")
			}).catch(ex => {
				console.log(ex);
			});
      dispatch(bindActionLogout());
    });
  };
}

export function bindActionLogout() {
  return {
    type: types.USER_LOG_OUT
  };
}
