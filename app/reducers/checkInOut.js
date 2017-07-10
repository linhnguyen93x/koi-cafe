import createReducer from '../libs/createReducer';
import * as types from '../actions/types';
import Immutable, { Map, List, fromJS, Set } from 'immutable';

const initialState = Map({
  data: null,
  isError: false
});

const ipState = Map({
  data: List([]),
  isError: false
});

const statusState = Map({
  isCheckin: null,
  isCheckinMiddle: null
});

export const employeeOutletInfo = createReducer(initialState, {
  [types.SET_EMPLOYEE_OUTLET_INFO](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set('data', action.employeeStore != null ? action.employeeStore : null)
        .set('isError', action.employeeStore == null ? true : false);
    });
  },
  [types.RESET_USER_OUTLET](state, action) {
    return initialState;
  }
});

export const allOutletInfo = createReducer(initialState, {
  [types.SET_ALL_OUTLET_INFO](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set('data', action.result != null ? action.result : null)
        .set('isError', action.result == null ? true : false);
    });
  }
});

export const employeeOutletIps = createReducer(ipState, {
  [types.SET_EMPLOYEE_OUTLET_IP](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set(
          'data',
          action.outletIps != null ? List(fromJS(action.outletIps)) : List([])
        )
        .set('isError', action.outletIps == null ? true : false);
    });
  }
});

export const userCheckedList = createReducer(ipState, {
  [types.SET_CHECK_STATUS_LIST](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set(
          'data',
          action.status != null ? List(fromJS(action.status)) : List([])
        )
        .set('isError', action.status == null ? true : false);
    });
  },
  [types.RESET_USER_CHECKED](state, action) {
    return ipState;
  }
});

export const checkStatus = createReducer(statusState, {
  [types.SET_CHECK_STATUS](state, action) {
    let checkOutStatus = 0,
      checkOutStatusMiddle = 0;

    if (action.status != null) {
      if (action.status.InOutMode == 1 || action.status.InOutMode == 2) {
        checkOutStatus =
          parseInt(action.status.InOutMode) < 2
            ? parseInt(action.status.InOutMode) + 1
            : 1;
      }

      if (
        action.statusMiddle.InOutMode == 3 ||
        action.statusMiddle.InOutMode == 4
      ) {
        checkOutStatusMiddle =
          parseInt(action.statusMiddle.InOutMode) < 4
            ? parseInt(action.statusMiddle.InOutMode) + 1
            : 3;
      }
    }

    return state.withMutations(ctx => {
      ctx
        .set('isCheckin', checkOutStatus)
        .set('isCheckinMiddle', checkOutStatusMiddle);
    });
  },
  [types.CHECK_SERVER_RESPONSE](state, action) {
    if (action.InOutMode == 1 || action.InOutMode == 2) {
      let checkOutStatus = 0;
      if (action.result.hasOwnProperty('error')) {
        if (action.result.error == 'chua checkin') {
          checkOutStatus = 1;
        } else {
          checkOutStatus = 2;
        }
      } else {
        checkOutStatus =
          parseInt(action.InOutMode) < 2 ? parseInt(action.InOutMode) + 1 : 1;
      }

      return state.withMutations(ctx => {
        ctx.set('isCheckin', checkOutStatus);
      });
    } else if (action.InOutMode == 3 || action.InOutMode == 4) {
      let checkOutMiddleStatus = 0;
      if (action.result.hasOwnProperty('error')) {
        if (action.result.error == 'chua checkin giua gio') {
          checkOutMiddleStatus = 3;
        } else {
          checkOutMiddleStatus = 4;
        }
      } else {
        checkOutMiddleStatus =
          parseInt(action.InOutMode) < 4 ? parseInt(action.InOutMode) + 1 : 3;
      }

      return state.withMutations(ctx => {
        ctx.set('isCheckinMiddle', checkOutMiddleStatus);
      });
    }
  }
});

export const checkResponseStatus = createReducer(initialState, {
  [types.CHECK_SERVER_RESPONSE](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set('data', action.result != null ? action.result : null)
        .set(
          'isError',
          action.result == null || action.result.hasOwnProperty('error')
            ? true
            : false
        );
    });
  }
});
