import * as types from "./types";
import Api from "../libs/api";

export function setLocation(location) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      resolve();
    }).then(() => {
      dispatch(bindLocation(location));
    });
  };
}

export function bindLocation(location) {
  return {
    type: types.SET_LOCATION,
    location 
  };
}
