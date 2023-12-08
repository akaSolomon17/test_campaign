import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useAxios from "../../../utils/useAxios";

import { useFormik } from "formik";
import * as Yup from "yup";

import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import "./AccPopup.scss";

import { createAccountAction } from "../../../store/actions/accountAction";

const initialState = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  role_id: "ADMIN",
  address: "",
  phone: "",
  confirm_password: "",
  err: "",
  success: "",
};

const AccPopup = (props) => {
  const api = useAxios();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialState);
  const [isDropDetail, setDropDetail] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role_id: "",
      address: "",
      phone: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email must be required")
        .email("Please enter a valid email"),
      password: Yup.string()
        .required("Password must required")
        .min(6, "Password must be at least 6 characters"),
      first_name: Yup.string().required(),
      last_name: Yup.string().required(),
      role_id: Yup.string().required(),
      address: Yup.string().required(),
      phone: Yup.string().required(),
      confirm_password: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      if (values.role_id === "") {
        values.role_id = "1";
      }
      let formData = new FormData();
      formData.append("name", values.name);
      formData.append("name", values.name);
      formData.append("name", values.name);
      formData.append("name", values.name);
      formData.append("name", values.name);

      dispatch(createAccountAction(formData, api));
      formik.resetForm();
      closePopup();
    },
  });

  const closePopup = () => {
    props.changePopup();
  };

  const changeDetailDrop = () => {
    setDropDetail(!isDropDetail);
  };

  return (
    <div className="acc-popup">
      <form onSubmit={formik.handleSubmit} className="acc-popup-inner">
        <div className="acc-title-pop">
          Create Account
          <div className="underline"></div>
          <button className="acc-close-btn" onClick={closePopup}>
            <AiOutlineClose
              className={`${isDropDetail ? "" : "dropped-icon"}`}
            />
          </button>
        </div>
        <div className="acc-title" onClick={changeDetailDrop}>
          Detail
          <AiOutlineDown className="drop-btn" />
        </div>
        <div className={`${"detail"} ${isDropDetail ? "" : "acc-dropped"}`}>
          <div className="acc-text-input">
            Email:
            <input
              value={formData.email}
              onChange={handleChange}
              type="text"
              name="email"
            />
          </div>
          <div className="acc-text-input">
            First name:
            <input
              value={formData.first_name}
              onChange={handleChange}
              type="text"
              name="first_name"
            />
          </div>
          <div className="acc-text-input">
            Last name:
            <input
              value={formData.last_name}
              onChange={handleChange}
              type="text"
              name="last_name"
            />
          </div>
          <div className="role-acc">
            Role:
            <select
              value={formData.role_id ? formData.role_id : "1"}
              onChange={handleChange}
              className="role-select"
              name="role_id"
            >
              <option value="1">ADMIN</option>
              <option value="2">DAC</option>
              <option value="3">ADVERTISER</option>
            </select>
          </div>
          <div className="acc-text-input">
            Address:
            <input
              value={formData.address}
              onChange={handleChange}
              type="text"
              name="address"
            />
          </div>
          <div className="acc-text-input">
            Phone:
            <input
              value={formData.phone}
              onChange={handleChange}
              type="text"
              name="phone"
            />
          </div>
          <div className="acc-text-input">
            Password:
            <input
              value={formData.password}
              onChange={handleChange}
              type="password"
              name="password"
            />
          </div>
          <div className="acc-text-input">
            Confirm password:
            <input
              value={formData.confirm_password}
              onChange={handleChange}
              type="password"
              name="confirm_password"
            />
          </div>
        </div>

        <div className="acc-footer-pop">
          <div className="underline"></div>
          <button className="cancel-btn" onClick={closePopup}>
            Cancel
          </button>
          <button
            type="submit"
            className="save-btn"
            onClick={formik.handleSubmit}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccPopup;
