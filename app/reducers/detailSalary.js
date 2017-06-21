import createReducer from "../libs/createReducer";
import * as types from "../actions/types";
import Immutable, { Map, List, fromJS, Set } from "immutable";

const initialState = Map({
  data: null
});

export const detailSalaryInfo = createReducer(initialState, {
  [types.SET_DETAIL_SALARY_INFO](state, action) {
    return state.withMutations(ctx => {
      ctx.set(
        "data",
        action.result != null && action.result.DuLieu != null
          ? action.result.DuLieu[0]
          : null
      );
    });
  }
});
