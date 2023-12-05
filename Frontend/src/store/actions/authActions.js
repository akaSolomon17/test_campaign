// import { checkAccessToken } from "../../helpers/checkEXPToken";
import { getDateTime } from "../../utils/checkEXPToken";
import { authServices } from "../../services/authService";
import {
  LOGIN_ERROR,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
} from "../types/authType";
import AccountServices from "../../services/AccountServices";

// login action
export const loginAction = (loginData, navigate) => {
  return async (dispatch) => {
    try {
      const res = await authServices.signin(loginData);
      if (res.status === 200) {
        const resToken = await AccountServices.getAccessToken();
        const resUserInfo = await AccountServices.searchAccount({
          headers: { Authorization: resToken.data.access_token },
        });

        const authInformation = {
          first_name: resUserInfo.data.first_name,
          last_name: resUserInfo.data.last_name,
          email: resUserInfo.data.email,
          avatar: resUserInfo.data.avatar,
          access_token: resToken.data.access_token,
          access_token_exp: resToken.data.accessTokenEXP,
          refresh_token: resToken.data.refresh_token,
          refresh_token_exp: resToken.data.refreshTokenEXP,
        };
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
      console.log("current user loggout: ", currentUser);
      if (currentUser.access_token_exp > getDateTime()) {
        await authServices.logout(
          currentUser.refresh_token,
          currentUser.access_token
        );
        await authServices.deleteRefreshToken(currentUser.refresh_token);
        localStorage.clear();
        dispatch(logoutSuccess());
        navigate("/login");
      } else {
        await authServices.deleteRefreshToken(currentUser.refresh_token);
        localStorage.clear();
        dispatch(logoutSuccess());
        navigate("/login");
      }
    } catch (e) {}
  };
};
export const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};
