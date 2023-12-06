import { authServices } from "../../services/authService";
import {
  LOGIN_ERROR,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "../types/authType";

// login action
export const loginAction = (loginData, navigate) => {
  return async (dispatch) => {
    dispatch(loginStart());
    try {
      const res = await authServices.signin(loginData);
      if (res.status === 200) {
        const authInformation = {
          first_name: res.data.user_info.first_name,
          last_name: res.data.user_info.last_name,
          email: res.data.user_info.email,
          avatar: res.data.user_info.avatar,
          access_token: res.data.access_token,
          access_token_exp: res.data.access_exp,
          refresh_token: res.data.refresh_token,
          refresh_token_exp: res.data.refresh_exp,
        };
        console.log(
          "file: authActions.js:30 ~ authInformation:",
          authInformation
        );
        dispatch(loginSuccess(authInformation));
        return navigate("/");
      } else {
        alert(res.data.message);
        dispatch(loginFailed());
      }
    } catch (e) {
      dispatch(loginFailed());
    }
  };
};
export const loginStart = () => {
  return {
    type: LOGIN_START,
  };
};
export const loginSuccess = (payload) => {
  return {
    type: LOGIN_SUCCESS,
    payload,
  };
};
export const loginFailed = () => {
  return {
    type: LOGIN_ERROR,
  };
};
// logout
export const logoutAction = (currentUser, navigate) => {
  return async (dispatch) => {
    try {
      // if (currentUser.access_token_exp > getDateTime()) {
      //   await authServices.logout(
      //     currentUser.refresh_token,
      //     currentUser.access_token
      //   );
      //   await authServices.deleteRefreshToken(currentUser.refresh_token);
      //   localStorage.clear();
      //   dispatch(logoutSuccess());
      //   navigate("/login");
      // } else {
      //   await authServices.deleteRefreshToken(currentUser.refresh_token);
      //   localStorage.clear();
      //   dispatch(logoutSuccess());
      //   navigate("/login");
      // }
      // Xử lí logic logout gọi api logout xóa in4 user trên db
      localStorage.clear();
      navigate("/login");
    } catch (e) {}
  };
};
export const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};
