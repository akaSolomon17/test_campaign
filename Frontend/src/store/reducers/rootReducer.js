import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import accountReducer from "./accountReducer.js";
import loadingReducer from "./loadingReducer.js";

const rootReducer = combineReducers({
  auth: authReducer,
  account: accountReducer,
  loading: loadingReducer,
});

export default rootReducer;
