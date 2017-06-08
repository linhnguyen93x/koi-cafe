import * as EmployeeListActions from './employeeList'
import * as LoginActions from './login'
import * as LogoutActions from './logout'

export const ActionCreators = Object.assign({}, 
	EmployeeListActions,
	LoginActions,
	LogoutActions
);