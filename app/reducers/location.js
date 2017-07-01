import createReducer from '../libs/createReducer'
import * as types from '../actions/types'
import Immutable, { Map, List, fromJS, Set } from 'immutable'

const initialState = Map({
	location: null
});

export const locationUser = createReducer(initialState, {
	[types.SET_LOCATION](state, action) {
		return state.withMutations((ctx) => {
			ctx.set('location', action.location);
		});
	}
});
