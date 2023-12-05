import ACTIONS from "../actions/index";

const initialState = {
  isLoading: false,
};

var loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TURN_ON_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ACTIONS.TURN_OFF_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default loadingReducer;
