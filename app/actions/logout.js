import * as types from './types'
import Api from '../libs/api'

export function logout() {
	return (dispatch, getState) => {


        return new Promise( (resolve, reject) => {
        	resolve();
        }).then(() => {
        	 dispatch(bindActionLogout());
        });
    };
}

export function bindActionLogout() {
	return {
		type: types.USER_LOG_OUT,
	}
}
