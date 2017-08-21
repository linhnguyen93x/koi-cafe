import createReducer from "../libs/createReducer";
import * as types from "../actions/types";
import Immutable, { Map, List, fromJS, Set } from "immutable";

const initialState = Map({
  data: List([]),
  offset: 0,
  isEnd: false,
  isLoading: false
});

const initialPositionState = Map({
  data: null,
  isError: false
});

export const employeeList = createReducer(initialState, {
  [types.SET_CHANGE_LOADING](state, action) {
    return state.withMutations(ctx => {
      ctx.set("isLoading", true);
    });
  },
  [types.SET_EMPLOYEE_LIST](state, action) {
    let returnList = List([]);

    if (!action.result.isError) {
      // let oldList = state.get('data');
      let oldList = List([]);
      let newList = List(fromJS(action.result.data.DuLieu));
      returnList = oldList.concat(newList);
    }

    return state.withMutations(ctx => {
      ctx.set("data", returnList).set("isEnd", true).set("isLoading", false);
    });
  },
  [types.RESET_EMPLOYEE_LIST](state, action) {
    return initialState;
  }
});

export const allPosition = createReducer(initialPositionState, {
  [types.SET_ALL_POSITION](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set("data", action.result != null ? action.result : null)
        .set("isError", action.result == null ? true : false);
    });
  }
});

export const avatar = createReducer(initialPositionState, {
  [types.FETCH_AVATAR](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set(
          "data",
          action.result != null && action.result.KetQua != null
            ? action.result.KetQua
            : null
        )
        .set("isError", action.result == null ? true : false);
    });
  },
  [types.SET_AVATAR](state, action) {
    return state.withMutations(ctx => {
      ctx
        .set(
          "data",
          action.result != null && action.result.image != null
            ? action.result.image
            : null
        )
        .set("isError", action.result == null ? true : false);
    });
  }
});
