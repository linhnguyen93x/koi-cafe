import { combineReducers } from 'redux'
import * as types from '../actions/types'
import * as routes from './routes'
import * as EmployeeListReducer from './employeeList'
import * as LoginReducer from './login'
import * as CheckInOutReducer from './checkInOut'
import * as DetailSalaryReducer from './detailSalary'
import * as WorkSheetReducer from './workSheet'
import * as HistoryCheckInReducer from './historyCheckIn'
import * as ResultCheckingReducer from './resultChecking'
import * as LocationReducer from './location'

const appReducer = combineReducers(Object.assign(
	routes,
	EmployeeListReducer,
	LoginReducer,
	CheckInOutReducer,
	DetailSalaryReducer,
	WorkSheetReducer,
	HistoryCheckInReducer,
	ResultCheckingReducer,
	LocationReducer
));

const rootReducer = (state, action) => {
	if (action.type === types.USER_LOG_OUT) {
		state = undefined
	}

	return appReducer(state, action)
}

export default rootReducer
