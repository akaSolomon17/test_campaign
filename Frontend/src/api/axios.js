import axios from "axios";
// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import AccountServices from "../services/AccountServices";
// import {
//   dispatchLogin,
//   fetchUser,
//   dispatchGetUser,
// } from "../redux/actions/authAction";

const buildApi = () => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return instance;
};

const api = buildApi();
export default api;
