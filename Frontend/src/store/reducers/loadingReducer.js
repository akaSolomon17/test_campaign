import { TURN_ON_LOADING, TURN_OFF_LOADING } from "../types/loadingType";

const initialState = {
  isLoading: false,
};

var loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case TURN_ON_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case TURN_OFF_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default loadingReducer;
