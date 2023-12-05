import React, { useState } from "react";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import "./AccPopup.scss";
import {
  WRONG_CONFIRM_PASSWORD,
  ADD_NEW_ACCOUNT_SUCCESSFULLY,
  ERROR_ADD_NEW_ACCOUNT_FAILED,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  INVALID_PHONE,
} from "../../../containers/alertContainer";
import AccountServices from "../../../services/AccountServices";
import { useSelector } from "react-redux";

const initialState = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  role_id: "",
  address: "",
  phone: "",
  confirm_password: "",
  err: "",
  success: "",
};

const AccPopup = (props) => {
  const token = useSelector((state) => state.token);

  const [formData, setFormData] = useState(initialState);
  const [isDropDetail, setDropDetail] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await AccountServices.postNewAccount(formData, token);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      const phoneRegex = /^\d{10}$/;

      if (!emailRegex.test(formData.email)) {
        alert(INVALID_EMAIL);
        return;
      }

      if (!passwordRegex.test(formData.password)) {
        alert(INVALID_PASSWORD);
        return;
      }

      if (formData.password !== formData.confirm_password) {
        alert(WRONG_CONFIRM_PASSWORD);
        return;
      }

      if (!phoneRegex.test(formData.phone)) {
        alert(INVALID_PHONE);
        return;
      }

      alert(ADD_NEW_ACCOUNT_SUCCESSFULLY);
      closePopup();
    } catch (error) {
      alert(ERROR_ADD_NEW_ACCOUNT_FAILED);
    }
  };

  const closePopup = () => {
    props.changePopup();
  };

  const changeDetailDrop = () => {
    setDropDetail(!isDropDetail);
  };

  return (
    <div className="acc-popup">
      <form onSubmit={handleSubmit} className="acc-popup-inner">
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
          <button type="submit" className="save-btn" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccPopup;
