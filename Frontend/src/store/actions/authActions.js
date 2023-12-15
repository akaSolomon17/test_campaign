import { toast } from "react-toastify";
import { authServices } from "../../services/authService";
import {
  LOGIN_ERROR,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "../types/authType";
import { turnOffLoading, turnOnLoading } from "./loadingActions";

// login action
export const loginAction = (loginData, navigate) => {
  return async (dispatch) => {
    dispatch(turnOnLoading());
    try {
      const res = await authServices.signin(loginData);
      console.log("file: authActions.js:17 ~ res:", res.data.msg.errorMessage);
      dispatch(turnOffLoading());

      if (res.data.msg.errorMessage === "Email or password is invalid!") {
        toast.error(res.data.msg.errorMessage);
        dispatch(turnOffLoading());
        return;
      }
      if (res.status === 200) {
        const authInformation = {
          role_id: res.data.user_info.role_id,
          user_id: res.data.user_info.user_id,
          first_name: res.data.user_info.first_name,
          last_name: res.data.user_info.last_name,
          email: res.data.user_info.email,
          avatar: res.data.user_info.avatar,
          access_token: res.data.access_token,
          access_token_exp: res.data.access_exp,
          refresh_token: res.data.refresh_token,
          refresh_token_exp: res.data.refresh_exp,
        };
        dispatch(loginSuccess(authInformation));
        return navigate("/");
      } else {
        dispatch(turnOffLoading());
      }
    } catch (e) {
      dispatch(turnOffLoading());
    }
  };
};

export const loginSuccess = (payload) => {
  return {
    type: LOGIN_SUCCESS,
    payload,
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
      dispatch(logoutSuccess());
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
