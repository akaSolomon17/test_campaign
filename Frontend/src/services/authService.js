import axios from "axios";

const BACKEND_DOMAIN = process.env.REACT_APP_API_BASE_URL;
export const authServices = {
  signin: (data) => {
    return axios({
      url: `${BACKEND_DOMAIN}/api/login`,
      method: "POST",
      data,
    });
  },
  getRefreshToken: () => {
    return axios({
      url: `${BACKEND_DOMAIN}/api/refresh_token`,
      method: "POST",
    });
  },
  getUserInfor: (api) => {
    let res = api.get(`/api/user_info`);
    return res;
  },
  getAllUserInfor: (api) => {
    let res = api.get("/api/all_user_info");
    return res;
  },
  updateUser: () => {
    return axios({
      url: `${BACKEND_DOMAIN}/api/update_user`,
      method: "PUT",
    });
  },
  deleteUser: () => {
    return axios({
      url: `${BACKEND_DOMAIN}/api/delete_user`,
      method: "DELETE",
    });
  },
  logout: (access_token) => {
    return axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/api/logout`,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  },
  deleteRefreshToken: (refresh_token) => {
    const refreshToken = {
      refresh_token: refresh_token,
    };
    return axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/api/delete-refresh-token`,
      data: refreshToken,
    });
  },
  refreshAccessToken: () => {
    const refreshToken = {
      refresh_token: localStorage.getItem("refresh_token"),
    };
    return axios({
      method: "POST",
      url: `${BACKEND_DOMAIN}/refresh-token`,
      data: refreshToken,
    });
  },
};
