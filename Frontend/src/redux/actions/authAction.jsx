import AccountServices from "../../services/AccountServices";
import ACTIONS from "./index";

export const dispatchLogin = () => {
  return {
    type: ACTIONS.LOGIN,
  };
};

export const fetchUser = async (token) => {
  const res = await AccountServices.searchAccount({
    headers: { Authorization: token },
  });
  return res;
};

export const dispatchGetUser = (res) => {
  return {
    type: ACTIONS.GET_USER,
    payload: {
      user: res.data,
      isAdmin: res.data.role_id === "ADMIN" ? true : false,
    },
  };
};

export const logout = () => ({
  type: ACTIONS.LOGOUT,
});
