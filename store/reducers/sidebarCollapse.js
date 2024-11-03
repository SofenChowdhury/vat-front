import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../components/services/Utilities";

const initialState = {
  isCollapse: true,
};


const setCollapse = (state, action) => {
  return updateObject(state, {
    isCollapse: action.isCollapse,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIDEBAR_COLLPASE:
      return setCollapse(state, action);
    default:
      return state;
  }
};

export default reducer;
