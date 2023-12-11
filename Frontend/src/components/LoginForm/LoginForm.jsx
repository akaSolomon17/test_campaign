import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";

import "./LoginForm.scss";
import {
  turnOnLoading,
  turnOffLoading,
} from "../../store/actions/loadingActions";
import { loginAction } from "../../store/actions/authActions";

const initialState = {
  email: "",
  password: "",
  err: "",
  success: "",
};

const LoginForm = () => {
  // const [user, setUser] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  // const handleChangeInput = (e) => {
  //   const { name, value } = e.target;
  //   setUser({ ...user, [name]: value, err: "", success: "" });
  // };

  // // catch login button click event generate data sent to login API
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   dispatch(turnOnLoading());
  //   try {

  //   } catch (err) {
  //     dispatch(turnOffLoading());
  //     // err.message && setUser({ ...user, err: err.message, success: "" });
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email must be required")
        .email("Please enter a valid email"),
      password: Yup.string()
        .required("Password must required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values) => {
      dispatch(loginAction(values, navigate));
      formik.resetForm();
    },
  });

  if (currentUser) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="form">
      <form onSubmit={formik.handleSubmit}>
        <label className="title-login">WELCOME</label>
        <div className="input-container">
          <input
            type="email"
            value={formik.values.email}
            id="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            required
            className="input"
          />
          {formik.errors.email && (
            <p className="error-text" style={{ color: "red" }}>
              {formik.errors.email}
            </p>
          )}
        </div>
        <div className="input-container">
          <input
            type="password"
            id="pass"
            name="password"
            value={formik.values.password}
            placeholder="Password"
            onChange={formik.handleChange}
            required
          />
          {formik.errors.password && (
            <p className="error-text" style={{ color: "red" }}>
              {formik.errors.password}
            </p>
          )}
        </div>
        <div className="button-container">
          <button className="login-button" type="submit">
            Login
          </button>
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
