import { toast } from "react-toastify";
import { accountServices } from "../../services/accountService";
import {
  FETCH_ACCOUNT_SUCCESS,
  CREATE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_SUCCESS,
} from "../types/accountType";
import { turnOffLoading, turnOnLoading } from "./loadingActions";

// fetch List Account Action
export const fetchListAccountAction = (initInfo, api) => {
  return async (dispatch) => {
    try {
      dispatch(turnOnLoading());
      const res = await accountServices.fetchListAccount(initInfo, api);
      dispatch(turnOffLoading());
      if (res.status === 200) {
        dispatch(fetchListAccountSuccess(res.data.user_list));
      }
    } catch (e) {
      console.log(e);
      dispatch(turnOffLoading());
    }
  };
};

export const fetchListAccountSuccess = (payload) => {
  return {
    type: FETCH_ACCOUNT_SUCCESS,
    payload,
  };
};

// create Account Action
export const createAccountAction = (formData, fetchForData, api) => {
  return async (dispatch) => {
    try {
      dispatch(turnOnLoading());
      const res = await accountServices.createAccount(formData, api);
      dispatch(turnOffLoading());
      if (res.status === 200) {
        dispatch(fetchListAccountAction(fetchForData, api));
        toast.success("Create Account Successffuly!");
      }
    } catch (e) {
      console.log(e);
      dispatch(turnOffLoading());
    }
  };
};
export const createAccountSuccess = (payload) => {
  return {
    type: CREATE_ACCOUNT_SUCCESS,
    payload,
  };
};

// delete Account Action
export const deleteAccountAction = (accountId, api) => {
  return async (dispatch) => {
    try {
      dispatch(turnOnLoading());
      const res = await accountServices.deleteAccount(accountId, api);
      dispatch(turnOffLoading());
      if (res.status === 200) {
        toast.success("Delete account successfully!");
        dispatch(fetchListAccountAction(api));
      } else {
        dispatch(turnOffLoading());
      }
    } catch (e) {
      console.log(e);
      dispatch(turnOffLoading());
    }
  };
};

export const deleteAccountSuccess = (payload) => {
  return {
    type: DELETE_ACCOUNT_SUCCESS,
    payload,
  };
};

// update Account Action
export const updateAccountAction = (dataAcc, api) => {
  return async (dispatch) => {
    try {
      dispatch(turnOnLoading());
      const res = await accountServices.updateAccount(dataAcc, api);
      dispatch(turnOffLoading());
      if (res.status === 200) {
        toast.success("Updated account successfully!");
        dispatch(fetchListAccountAction(api));
      } else {
        dispatch(turnOffLoading());
      }
    } catch (e) {
      console.log(e);
      dispatch(turnOffLoading());
    }
  };
};

export const updateAccountSuccess = (payload) => {
  return {
    type: UPDATE_ACCOUNT_SUCCESS,
    payload,
  };
};
