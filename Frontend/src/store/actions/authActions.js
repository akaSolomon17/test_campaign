// import { checkAccessToken } from "../../helpers/checkEXPToken";
import { getDateTime } from "../../utils/checkEXPToken";
import { authServices } from "../../services/authService";
import {
  LOGIN_ERROR,
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  GET_USER,
  GET_ALL_USERS,
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

// Lấy bên redux
export const fetchUser = async (token) => {
  const res = await AccountServices.searchAccount({
    headers: { Authorization: token },
  });
  return res;
};

export const dispatchGetUser = (res) => {
  return {
    type: GET_USER,
    payload: {
      user: res.data,
      isAdmin: res.data.role_id === "ADMIN" ? true : false,
    },
  };
};
export const fetchAllUsers = async (token) => {
  const res = await AccountServices.getAllAccount({
    headers: { Authorization: token },
  });
  return res;
};

export const dispatchGetAllUsers = (res) => {
  return {
    type: GET_ALL_USERS,
    payload: res.data,
  };
};
//

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
