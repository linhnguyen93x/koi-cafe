import createReducer from "../libs/createReducer";
import * as types from "../actions/types";
import Immutable, { Map, List, fromJS, Set } from "immutable";

const initialState = Map({
  data: null,
  isError: false
});

export const workSheetList = createReducer(initialState, {
  [types.SET_WORK_SHEET_LIST](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set("data", action.result)
        .set("isError", action.result == null ? true : false);
    });
  },
  [types.RESET_WORK_SHEET_LIST](state, action) {
    return initialState;
  }
});
