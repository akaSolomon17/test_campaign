import React, { useRef, useState, useEffect } from "react";
import AccTable from "./AccountTable/AccTable";
import AccPopup from "./AccountPopup/AccPopup";
import "./Account.scss";

import { useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import {
  fetchAllUsers,
  dispatchGetAllUsers,
} from "../../redux/actions/usersAction";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/Notification/Notification";

const initialState = {
  user_id: "",
  username: "",
  email: "",
  address: "",
  phone: "",
  role: "",
  action: "",
  err: "",
  success: "",
};

const Account = () => {
  const searchRef = useRef();

  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);

  const { isAdmin } = auth;
  const [data, setData] = useState([initialState]);
  const { err, success } = data;

  const [dataSearch, setDataSearch] = useState({ search: null });
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isReload, setReload] = useState(true); // set Callback

  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllUsers(token).then((res) => {
      dispatch(dispatchGetAllUsers(res));
      setData([res.data]);
    });
  }, [token, dispatch]);

  function changePopup() {
    setOpenPopup(!isOpenPopup);
    setReload(!isReload);
  }

  function handleSearch() {
    let search = searchRef.current.value;
    setDataSearch({ search: search });
    setReload(!isReload);
  }

  return (
    <div className="account">
      {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
      <div className="acc-filter-bar">
        <div className="acc-search-container">
          <input
            type="text"
            id="search-bar"
            onBlur={handleSearch}
            ref={searchRef}
            placeholder="Search"
          />
        </div>
        <div className="acc-func-btn">
          <CSVLink className="acc-export-btn acc-button" data={data}>
            Export CSV
          </CSVLink>
          <button className="acc-create-btn acc-button" onClick={changePopup}>
            Create Account
          </button>
        </div>
      </div>
      {data && <AccTable data={data[0].users} />}
      {!data && <div className="acc-nodata-text">NO DATA</div>}
      {isOpenPopup && <AccPopup changePopup={changePopup} />}
    </div>
  );
};

export default Account;
