import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../components/services/Utilities";

const initialState = {
  message: null,
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    message: null,
  });
};

const authValidation = (state, action) => {
  return updateObject(state, {
    message: action.message,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_VALIDATION:
      return authValidation(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    default:
      return state;
  }
};

export default reducer;
