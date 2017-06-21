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
    return state.withMutations(ctx => {
      ctx.set(
        "isCheckin",
        action.status == null ? 0 : action.status.InOutletMode
      );
    });
  },
  [types.CHECK_SERVER_RESPONSE](state, action) {
    return state.withMutations(ctx => {
      ctx.set(
        "isCheckin",
        action.result.hasOwnProperty("error")
          ? action.InOutletMode
          : action.InOutletMode != 2
            ? parseInt(action.InOutletMode) + 1
            : action.InOutletMode
      );
    });
  }
});

export const checkResponseStatus = createReducer(initialState, {
  [types.CHECK_SERVER_RESPONSE](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set("data", action.result != null ? action.result : null)
        .set("isError", action.result.hasOwnProperty("error") ? true : false);
    });
  }
});
