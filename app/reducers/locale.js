import createReducer from '../libs/createReducer'
import * as types from '../actions/types'
import Immutable, { Map, List, fromJS, Set } from 'immutable'
import * as language from '../language'

const initialState = Map({
	value: language.getLocale()
});

export const locale = createReducer(initialState, {
	[types.SET_LANGUAGE](state, action) {
    language.setLocale(action.resp);

		return state.withMutations((ctx) => {
			ctx.set('value', action.resp);
		});
	}
});
