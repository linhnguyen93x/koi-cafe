import createReducer from '../libs/createReducer'
import * as types from '../actions/types'

export const info = createReducer({}, {
	[types.LOGIN_SUCCESS](state, action) {
		let newState = action.customer;

		return newState;
	}
});

export const loginFail = createReducer({}, {
	[types.LOGIN_FAIL](state, action) {
		let newState = true;
		return newState;
	},
	[types.LOGIN_SUCCESS](state, action) {
		let newState = false;
		return newState;
	}
});
