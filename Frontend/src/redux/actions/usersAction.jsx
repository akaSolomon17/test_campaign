import AccountServices from "../../services/AccountServices";
import ACTIONS from "./index";

export const fetchAllUsers = async (token) => {
  const res = await AccountServices.getAllAccount({
    headers: { Authorization: token },
  });
  return res;
};

export const dispatchGetAllUsers = (res) => {
  return {
    type: ACTIONS.GET_ALL_USERS,
    payload: res.data,
  };
};
