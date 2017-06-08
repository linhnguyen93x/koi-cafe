import createReducer from '../libs/createReducer'
import * as types from '../actions/types'
import Immutable, { Map, List, fromJS, Set } from 'immutable'

const initialState = Map({
	data: List([]),
	offset: 0,
	isEnd: false,
	isLoading: false
});

export const employeeList = createReducer(initialState, {
	[types.SET_CHANGE_LOADING](state, action) {
		return state.withMutations( (ctx) => {
			ctx.set('isLoading', true);
		} );
	},
	[types.SET_EMPLOYEE_LIST](state, action) {
		if (action.result.isError) {
			return null;
		}

		let oldList = state.get('data');
		let newList = List(fromJS(action.result.data.DuLieu));
		let returnList = oldList.concat(newList);

		return state.withMutations( (ctx) => {
			ctx.set('data', returnList)
				.set('isEnd', true)
				.set('isLoading', false);
		} );
	}
});
