import { GET_USER, GET_ALL_USERS } from "../types/authType";
const initialState = {
  currentUser: [],
  token: null,
  isAdmin: false,
  isLogged: false,
  error: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAdmin: action.payload.isAdmin,
      };
      switch (action.type) {
        case GET_ALL_USERS:
          return action.payload;
        default:
          return state;
      }
  }
};
