import React, { useState } from "react";
import { useDispatch } from "react-redux";

import "./LoginForm.scss";

import { useNavigate } from "react-router-dom";
import { dispatchLogin } from "../../redux/actions/authAction";
import {
  turnOnLoading,
  turnOffLoading,
} from "../../redux/actions/loadingAction";

import AccountServices from "../../services/AccountServices";

import {
  showSuccessMsg,
  showErrMsg,
} from "../../utils/Notification/Notification";

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

const LoginForm = () => {
  const [user, setUser] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, password, err, success } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value, err: "", success: "" });
  };

  // catch login button click event generate data sent to login API
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(turnOnLoading());
    try {
      const res = await AccountServices.userLogin({
        email,
        password,
      });

      setUser({ ...user, err: "", success: res.data.msg });

      localStorage.setItem("firstLogin", true);

      dispatch(dispatchLogin());
      dispatch(turnOffLoading());
      navigate("/");
    } catch (err) {
      dispatch(turnOffLoading());
      err.message && setUser({ ...user, err: err.message, success: "" });
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <label className="title-login">WELCOME</label>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}

        <div className="input-container">
          <input
            type="email"
            value={email}
            id="email"
            name="email"
            placeholder="Email"
            onChange={handleChangeInput}
            required
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            value={password}
            id="pass"
            name="password"
            onChange={handleChangeInput}
            placeholder="Password"
            required
          />
        </div>
        <div className="button-container">
          <button className="login-button" type="submit">
            Login
          </button>
          .
        </div>
        <div className="extension-login">
          <button className="login-facebook">Facebook</button>
          <button className="login-gmail">Google</button>
        </div>
      </form>
    </div>
  );
};
export default LoginForm;
