import { combineReducers } from 'redux'
import * as types from '../actions/types'
import * as NavigationReducer from './navigation'
import * as routes from './routes'
import * as EmployeeListReducer from './employeeList'
import * as LoginReducer from './login'
import * as CheckInOutReducer from './checkInOut'

const appReducer = combineReducers(Object.assign(
	routes,
	EmployeeListReducer,
	LoginReducer,
	CheckInOutReducer
));

const rootReducer = (state, action) => {
	if (action.type === types.USER_LOG_OUT) {
		state = undefined
	}

	return appReducer(state, action)
}

export default rootReducer
