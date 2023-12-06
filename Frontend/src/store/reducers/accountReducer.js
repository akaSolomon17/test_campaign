import {
  FETCH_ACCOUNT_START,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_FAILED,
} from "../types/accountType";

const initialState = {
  listAccounts: [],
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNT_START:
      return {
        // bat loading
        ...state,
      };
    case FETCH_ACCOUNT_SUCCESS:
      return {
        ...state,
        // isLoading: false,
        listAccounts: action.payload,
      };
    case FETCH_ACCOUNT_FAILED:
      return {
        ...state,
        // isLoading: false,
      };
    default:
      return state;
  }
};

export default accountReducer;
