import React, { useRef, useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";

import "./Account.scss";
import AccTable from "./AccountTable/AccTable";
import AccPopup from "./AccountPopup/AccPopup";

import { fetchListAccountAction } from "../../store/actions/accountAction";

const Account = () => {
  const searchRef = useRef();

  const [dataSearch, setDataSearch] = useState({ search: null });
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isReload, setReload] = useState(true); // set Callback

  const dispatch = useDispatch();
  const api = useAxios();
  const listAccounts = useSelector((state) => state.account.listAccounts);

  const headerExport = [
    { label: "Role", key: "role_id" },
    { label: "ID", key: "user_id" },
    { label: "First Name", key: "first_name" },
    { label: "Last Name", key: "last_name" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
    { label: "Phone Number", key: "phone" },
    { label: "Avatar", key: "avatar" },
    { label: "create_at", key: "create_at" },
    { label: "update_at", key: "update_at" },
  ];

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
          <CSVLink
            data={listAccounts}
            headers={headerExport}
            filename="accounts.csv"
          >
            <button className="acc-export-btn acc-button">Export CSV</button>
          </CSVLink>
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
  );
};

export default Account;
