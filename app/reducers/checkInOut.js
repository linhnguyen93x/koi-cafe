import createReducer from "../libs/createReducer";
import * as types from "../actions/types";
import Immutable, { Map, List, fromJS, Set } from "immutable";

const initialState = Map({
  data: null,
  isError: false
});

const ipState = Map({
  data: List([]),
  isError: false
});

const statusState = Map({
  isCheckin: null
});

export const employeeOutletInfo = createReducer(initialState, {
  [types.SET_EMPLOYEE_OUTLET_INFO](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set("data", action.employeeStore != null ? action.employeeStore : null)
        .set("isError", action.employeeStore == null ? true : false);
    });
  }
});

export const employeeOutletIps = createReducer(ipState, {
  [types.SET_EMPLOYEE_OUTLET_IP](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set(
          "data",
          action.outletIps != null ? List(fromJS(action.outletIps)) : List([])
        )
        .set("isError", action.outletIps == null ? true : false);
    });
  }
});

export const checkStatus = createReducer(statusState, {
  [types.SET_CHECK_STATUS](state, action) {
    let checkOutStatus = 0;
    if (action.status == null) {
      checkOutStatus = 0;
    } else {
      checkOutStatus = parseInt(action.status.InOutMode) < 2
        ? (parseInt(action.status.InOutMode) + 1)
        : 1;
    }

    return state.withMutations(ctx => {
      ctx.set("isCheckin", checkOutStatus);
    });
  },
  [types.CHECK_SERVER_RESPONSE](state, action) {
    let checkOutStatus = 0;
    if (action.result.hasOwnProperty("error")) {
      if (action.result.error == "chua checkin") {
        checkOutStatus = 1;
      } else {
        checkOutStatus = 2;
      }
    } else {
      checkOutStatus = parseInt(action.InOutMode) < 2
        ? parseInt(action.InOutMode) + 1
        : 1;
    }

    return state.withMutations(ctx => {
      ctx.set("isCheckin", checkOutStatus);
    });
  }
});

export const checkResponseStatus = createReducer(initialState, {
  [types.CHECK_SERVER_RESPONSE](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set("data", action.result != null ? action.result : null)
        .set(
          "isError",
          action.result == null || action.result.hasOwnProperty("error")
            ? true
            : false
        );
    });
  }
});
