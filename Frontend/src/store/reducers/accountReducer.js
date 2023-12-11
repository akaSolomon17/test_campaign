import {
  FETCH_ACCOUNT_START,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_FAILED,
} from "../types/accountType";

const initialState = {
  listAccounts: [],
  totalRecords: 0,
  isLoading: false,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNT_START:
      return {
        // bat loading
        ...state,
        isLoading: true,
      };
    case FETCH_ACCOUNT_SUCCESS:
      console.log(action.payload[0]);
      return {
        ...state,
        isLoading: false,
        listAccounts: action.payload[0],
        totalRecords: action.payload.total_records,
      };
    case FETCH_ACCOUNT_FAILED:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default accountReducer;
