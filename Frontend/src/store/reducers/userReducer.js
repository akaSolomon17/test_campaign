import { GET_ALL_USERS } from "../types/authType";
const initialState = {
  currentUser: [],

  error: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USERS:
      return action.payload;
    default:
      return state;
  }
};

export default userReducer;
