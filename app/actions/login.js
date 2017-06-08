import * as types from './types'
import Api from '../libs/api'


export function login(username, password) {
    return (dispatch, getState) => {
        const params = [
            `grant_type=password`,
            `username=${encodeURIComponent(username)}`,
            `password=${encodeURIComponent(password)}`
        ].join('&')
        return Api.postRaw(`/API/Login`, params).then(resp => {
            dispatch(setLoginSuccess({ customer: resp }));
        }).catch((ex) => {
            dispatch(setLoginFail());
            console.log(ex);
        });
    };
}

export function setLoginSuccess({ customer }) {
    return {
        type: types.LOGIN_SUCCESS,
        customer
    }
}

export function setLoginFail() {
    return {
        type: types.LOGIN_FAIL,
    }
}
