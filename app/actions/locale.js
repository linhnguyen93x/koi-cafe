import * as types from "./types";
import Api from "../libs/api";
import { AsyncStorage } from 'react-native'

export function changeLanguage(value) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      dispatch(bindChangeLanguage(value));
      resolve();
    });
  };
}

export function bindChangeLanguage(value) {
  AsyncStorage.setItem('language', value);

  return {
    type: types.SET_LANGUAGE,
    resp: value
  };
}
