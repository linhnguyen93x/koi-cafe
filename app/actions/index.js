import * as EmployeeListActions from './employeeList'
import * as LoginActions from './login'
import * as LogoutActions from './logout'
import * as CheckInOutActions from './checkInOut'
import * as DetailSalaryActions from './detailSalary'
import * as WorkSheetActions from './workSheet'
import * as HistoryCheckInActions from './historyCheckIn'
import * as ResultCheckingActions from './resultChecking'
import * as LocationActions from './location'
import * as LocaleActions from './locale'

export const ActionCreators = Object.assign({},
	EmployeeListActions,
	LoginActions,
	LogoutActions,
	CheckInOutActions,
	DetailSalaryActions,
	WorkSheetActions,
	HistoryCheckInActions,
	ResultCheckingActions,
	LocationActions,
	LocaleActions
);
