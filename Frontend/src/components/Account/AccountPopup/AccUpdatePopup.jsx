import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import "./AccPopup.scss";

import useAxios from "../../../utils/useAxios";
import { updateAccountAction } from "../../../store/actions/accountAction";

const AccUpdatePopup = (props) => {
  const initialState = {
    firstname: props.record ? props.record.first_name : "",
    email: props.record ? props.record.email : "",
    phone: props.record ? props.record.phone : "",
    address: props.record ? props.record.address : "",
    role_id: props.record ? props.record.role_id : "1",
    lastname: props.record ? props.record.last_name : "",
    user_id: props.record ? props.record.user_id : "",
  };

  const api = useAxios();
  const dispatch = useDispatch();

  const [user, setUser] = useState(initialState);
  const [isDropDetail, setDropDetail] = useState(true);

  const handlePhoneChange = (event) => {
    setUser((prevUser) => ({ ...prevUser, phone: event.target.value }));
  };

  const handleFirstNameChange = (event) => {
    setUser((prevUser) => ({ ...prevUser, firstname: event.target.value }));
  };

  const handleLastNameChange = (event) => {
    setUser((prevUser) => ({ ...prevUser, lastname: event.target.value }));
  };

  const handleAddressChange = (event) => {
    setUser((prevUser) => ({ ...prevUser, address: event.target.value }));
  };

  const handleRoleChange = (event) => {
    setUser((prevUser) => ({ ...prevUser, role: event.target.value }));
  };

  const closePopup = () => {
    props.onClose();
  };

  const changeDetailDrop = () => {
    setDropDetail(!isDropDetail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        user_id: user.user_id,
        first_name: user.firstname,
        last_name: user.lastname,
        role_id: user.role_id,
        address: user.address,
        phone: user.phone,
      };

      dispatch(updateAccountAction(updateData, api));
      closePopup();
    } catch (error) {
      console.log(error);
    }

    // try {
    //   const res = await AccountServices.updateAccount(dataAcc, token);
    //   console.log(res);
    //   alert("UPDATE ACCOUNT SUCCESSFULLY!");
    //   closePopup();
    // } catch (error) {
    //   alert("UPDATE ACCOUNT FAILED!");
    // }
  };

  return (
    <div className="acc-popup">
      <div className="acc-popup-inner">
        <div className="acc-title-pop">
          Edit Account
          <div className="underline"></div>
          <button className="acc-close-btn" onClick={props.onClose}>
            <AiOutlineClose
              className={`${isDropDetail ? "" : "dropped-icon"}`}
            />
          </button>
        </div>
        <div className="acc-title" onClick={changeDetailDrop}>
          Detail
          <AiOutlineDown className="drop-btn" />
        </div>
        <div
          className={`${"detail-update"} ${isDropDetail ? "" : "acc-dropped"}`}
        >
          <div className="acc-text-input-update">
            Email:
            <input
              // ref={emailRef}
              readOnly={true}
              value={user.email}
              type="text"
              name="name"
            />
          </div>
          <div className="acc-text-input-update">
            First name:
            <input
              value={user.firstname}
              onChange={handleFirstNameChange}
              type="text"
              name="name"
            />
          </div>
          <div className="acc-text-input-update">
            Last name:
            <input
              value={user.lastname}
              onChange={handleLastNameChange}
              type="text"
              name="name"
            />
          </div>
          <div className="role-acc">
            Role:
            <select
              value={user.role_id}
              onChange={handleRoleChange}
              className="role-select"
              name="status"
            >
              <option value="1">ADMIN</option>
              <option value="2">DAC</option>
              <option value="3">ADVERTISER</option>
            </select>
          </div>
          <div className="acc-text-input-update">
            Address:
            <input
              value={user.address}
              onChange={handleAddressChange}
              type="text"
              name="name"
            />
          </div>
          <div className="acc-text-input-update">
            Phone:
            <input
              value={user.phone}
              onChange={handlePhoneChange}
              type="text"
              name="name"
            />
          </div>
        </div>

        <div className="acc-footer-pop">
          <div className="underline"></div>
          <button className="cancel-btn" onClick={props.onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSubmit}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccUpdatePopup;
