import * as types from './types'
import Api from '../libs/api'


export function fetchEmployeeList() {
	return (dispatch, getState) => {

		return Api.post(`/API/Employee/GetEmployee`).then(resp => {
			const result = {
				data: resp
			}

			dispatch(bindEmployeeList(result));
		}).catch(ex => {
			console.log(ex);
			const result = {
				isError: true
			}

			dispatch(bindEmployeeList(result));
		});
	}
}

export function bindEmployeeList(result) {
	return {
		type: types.SET_EMPLOYEE_LIST,
		result
	}
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
    }
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