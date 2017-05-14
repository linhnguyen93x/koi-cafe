import { combineReducers } from 'redux'
import * as types from '../actions/types'
import * as NavigationReducer from './navigation'
import * as routes from './routes'

const appReducer = combineReducers(Object.assign(
	routes
));

const rootReducer = (state, action) => {
	if (action.type === types.USER_LOG_OUT) {
		state = undefined
	}

	return appReducer(state, action)
}

export default rootReducer
