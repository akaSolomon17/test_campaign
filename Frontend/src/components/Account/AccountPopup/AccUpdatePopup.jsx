import React, { useRef, useState } from "react";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import "./AccPopup.scss";
import AccountServices from "../../../services/AccountServices";
import { useSelector } from "react-redux";

const AccPopup = (props) => {
  const token = useSelector((state) => state.token);
  const [isDropDetail, setDropDetail] = useState(true);
  const [user, setUser] = useState({
    firstname: props.record ? props.record.first_name : "",
    email: props.record ? props.record.email : "",
    phone: props.record ? props.record.phone : "",
    address: props.record ? props.record.address : "",
    role: props.record ? props.record.role_id : "",
    lastname: props.record ? props.record.last_name : "",
    // id: props.record ? props.record.user_id : "",
  });

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

  const emailRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const roleRef = useRef();
  const addressRef = useRef();
  const phoneRef = useRef();
  const idRef = useRef();

  const closePopup = () => {
    props.onClose();
  };

  const changeDetailDrop = () => {
    setDropDetail(!isDropDetail);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const email = emailRef.current.value;
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const role = roleRef.current.value;
    const address = addressRef.current.value;
    const phone = phoneRef.current.value;
    // const id = idRef.current.value;
    const dataAcc = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      role: parseInt(role),
      address: address,
      phone: phone,
    };
    try {
      const res = await AccountServices.updateAccount(dataAcc, token);
      console.log(res);
      alert("UPDATE ACCOUNT SUCCESSFULLY!");
      closePopup();
    } catch (error) {
      alert("UPDATE ACCOUNT FAILED!");
    }
  }

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
            <input ref={idRef} value={user.id} type="hidden" name="name" />
          </div>
          <div className="acc-text-input-update">
            Email:
            <input
              ref={emailRef}
              readOnly={true}
              value={user.email}
              type="text"
              name="name"
            />
          </div>
          <div className="acc-text-input-update">
            First name:
            <input
              ref={firstNameRef}
              value={user.firstname}
              onChange={handleFirstNameChange}
              type="text"
              name="name"
            />
          </div>
          <div className="acc-text-input-update">
            Last name:
            <input
              ref={lastNameRef}
              value={user.lastname}
              onChange={handleLastNameChange}
              type="text"
              name="name"
            />
          </div>
          <div className="role-acc">
            Role:
            <select
              ref={roleRef}
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
              ref={addressRef}
              value={user.address}
              onChange={handleAddressChange}
              type="text"
              name="name"
            />
          </div>
          <div className="acc-text-input-update">
            Phone:
            <input
              ref={phoneRef}
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

export default AccPopup;
