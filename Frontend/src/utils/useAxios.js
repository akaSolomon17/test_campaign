import axios from "axios";
// import { getDateTime } from "../helpers/checkEXPToken";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../store/actions/authActions";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../store/actions/authActions";
const baseURL = process.env.REACT_APP_API_BASE_URL;
const useAxios = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const currentTime = new Date();
  const access_exp = new Date(currentUser.access_token_exp * 1000);
  const refresh_exp = new Date(currentUser.refresh_token_exp * 1000);
  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `${currentUser?.access_token}` },
  });

  axiosInstance.interceptors.request.use(
    async (req) => {
      if (access_exp <= currentTime) {
        if (refresh_exp > currentTime) {
          const resRefreshToken = await axios.post(
            `${baseURL}/api/refresh_token`,
            { refresh_token: currentUser.refresh_token }
          );

          const refreshUser = {
            ...currentUser,
            access_token: resRefreshToken.data.new_acc_token,
            access_token_exp: resRefreshToken.data.access_token_exp,
          };

          dispatch(loginSuccess(refreshUser));
          req.headers.Authorization = `${resRefreshToken.data.new_acc_token}`;

          return req;
        } else {
          dispatch(logoutAction(currentUser, navigate));
          return req;
        }
      } else {
        return req;
      }
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return axiosInstance;
};
export default useAxios;
