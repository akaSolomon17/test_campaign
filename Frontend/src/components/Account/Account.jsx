import React, { useRef, useState, useEffect } from "react";
import AccTable from "./AccountTable/AccTable";
import AccPopup from "./AccountPopup/AccPopup";
import "./Account.scss";
import { useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import {
  showErrMsg,
  showSuccessMsg,
} from "../../utils/Notification/Notification";
import { fetchListAccountAction } from "../../store/actions/accountAction";
import useAxios from "../../utils/useAxios";

// const initialState = {
//   user_id: "",
//   username: "",
//   email: "",
//   address: "",
//   phone: "",
//   role: "",
//   action: "",
//   err: "",
//   success: "",
// };

const Account = () => {
  const searchRef = useRef();
  // const auth = useSelector((state) => state.auth.currentUser);
  // const token = useSelector((state) => state.token);

  // const { isAdmin } = auth;
  // const { err, success } = data;

  const [dataSearch, setDataSearch] = useState({ search: null });
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isReload, setReload] = useState(true); // set Callback

  const dispatch = useDispatch();
  const api = useAxios();
  const listAccounts = useSelector((state) => state.account.listAccounts);

  useEffect(() => {
    dispatch(fetchListAccountAction(api));
  }, []);

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
      {/* {err && showErrMsg(err)} */}
      {/* {success && showSuccessMsg(success)} */}
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
          {/* <CSVLink className="acc-export-btn acc-button" data={listAccounts}>
            Export CSV
          </CSVLink> */}
          <button className="acc-create-btn acc-button" onClick={changePopup}>
            Create Account
          </button>
        </div>
      </div>
      {listAccounts && listAccounts.length > 0 ? (
        <AccTable listAccounts={listAccounts} />
      ) : (
        <div className="acc-nodata-text">NO DATA</div>
      )}
      {isOpenPopup && <AccPopup changePopup={changePopup} />}
    </div>
    // <div>account</div>
  );
};

export default Account;
