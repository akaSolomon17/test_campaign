import { accountServices } from "../../services/accountService";
import {
  FETCH_ACCOUNT_FAILED,
  FETCH_ACCOUNT_SUCCESS,
  FETCH_ACCOUNT_START,
  CREATE_ACCOUNT_FAILED,
  CREATE_ACCOUNT_SUCCESS,
  CREATE_ACCOUNT_START,
  DELETE_ACCOUNT_FAILED,
  DELETE_ACCOUNT_START,
  DELETE_ACCOUNT_SUCCESS,
  UPDATE_ACCOUNT_FAILED,
  UPDATE_ACCOUNT_START,
  UPDATE_ACCOUNT_SUCCESS,
} from "../types/accountType";

// fetch List Account Action
export const fetchListAccountAction = (api) => {
  return async (dispatch) => {
    dispatch(fetchListAccountStart());
    try {
      const res = await accountServices.fetchListAccount(api);
      if (res.status === 200) {
        dispatch(fetchListAccountSuccess(res.data.users));
      } else {
        dispatch(fetchListAccountFailed());
      }
    } catch (e) {
      dispatch(fetchListAccountFailed());
    }
  };
};
export const fetchListAccountStart = () => {
  return {
    type: FETCH_ACCOUNT_START,
  };
};
export const fetchListAccountSuccess = (payload) => {
  return {
    type: FETCH_ACCOUNT_SUCCESS,
    payload,
  };
};
export const fetchListAccountFailed = () => {
  return {
    type: FETCH_ACCOUNT_FAILED,
  };
};

// create Account Action
export const createAccountAction = (formData, api) => {
  return async (dispatch) => {
    dispatch(createAccountStart());
    try {
      const res = await accountServices.createAccount(formData, api);
      if (res.status === 200) {
        dispatch(fetchListAccountAction(api));
      } else {
        dispatch(createAccountFailed());
      }
    } catch (e) {
      dispatch(createAccountFailed());
    }
  };
};
export const createAccountStart = () => {
  return {
    type: CREATE_ACCOUNT_START,
  };
};
export const createAccountSuccess = (payload) => {
  return {
    type: CREATE_ACCOUNT_SUCCESS,
    payload,
  };
};
export const createAccountFailed = () => {
  return {
    type: CREATE_ACCOUNT_FAILED,
  };
};

// delete Account Action
export const deleteAccountAction = (accountId, api) => {
  return async (dispatch) => {
    dispatch(deleteAccountStart());
    try {
      const res = await accountServices.deleteAccount(accountId, api);
      if (res.status === 200) {
        dispatch(fetchListAccountAction(api));
      } else {
        dispatch(deleteAccountFailed());
      }
    } catch (e) {
      dispatch(deleteAccountFailed());
    }
  };
};
export const deleteAccountStart = () => {
  return {
    type: DELETE_ACCOUNT_START,
  };
};
export const deleteAccountSuccess = (payload) => {
  return {
    type: DELETE_ACCOUNT_SUCCESS,
    payload,
  };
};
export const deleteAccountFailed = () => {
  return {
    type: DELETE_ACCOUNT_FAILED,
  };
};

// update Account Action
export const updateAccountAction = (dataAcc, api) => {
  return async (dispatch) => {
    dispatch(updateAccountStart());
    try {
      const res = await accountServices.updateAccount(dataAcc, api);
      // if (res.status === 200) {
      //   dispatch(fetchListAccountAction(api));
      // } else {
      //   dispatch(updateAccountFailed());
      // }
    } catch (e) {
      dispatch(updateAccountFailed());
    }
  };
};
export const updateAccountStart = () => {
  return {
    type: UPDATE_ACCOUNT_START,
  };
};
export const updateAccountSuccess = (payload) => {
  return {
    type: UPDATE_ACCOUNT_SUCCESS,
    payload,
  };
};
export const updateAccountFailed = () => {
  return {
    type: UPDATE_ACCOUNT_FAILED,
  };
};
