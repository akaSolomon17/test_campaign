import ACTIONS from "../actions";

const initialState = {
  user: [],
  isLogged: false,
  isAdmin: false,
};

var authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        isLogged: true,
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        token: null,
        isLogged: false,
      };
    case ACTIONS.GET_USER:
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAdmin: action.payload.isAdmin,
      };
    default:
      return state;
  }
};

export default authReducer;
