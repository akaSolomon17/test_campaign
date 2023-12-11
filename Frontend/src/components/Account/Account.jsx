import React, { useRef, useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import "./Account.scss";
import AccTable from "./AccountTable/AccTable";
import AccPopup from "./AccountPopup/AccPopup";

import { fetchListAccountAction } from "../../store/actions/accountAction";
import Pagination from "react-pagination-library";
import "react-pagination-library/build/css/index.css";

const Account = () => {
  const typingTimeoutRef = useRef(null);
  const api = useAxios();
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isReload, setReload] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [keyWord, setkeyWord] = useState("ALL");
  const dispatch = useDispatch();
  const listAccounts = useSelector((state) => state.account.listAccounts);
  const totalRecords = useSelector((state) => state.account.totalRecords);
  const pageCount = Math.ceil(totalRecords / 3);

  const handlePageClick = (event) => {
    setPageNumber(event);
  };

  const handleChangeSearchByKeyWord = (e) => {
    const value = e.target.value;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setkeyWord(value);
    }, 600);
  };

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
    dispatch(
      fetchListAccountAction(
        {
          key_word: keyWord,
          page_number: pageNumber,
        },
        api
      )
    );
  }, [pageNumber, keyWord]);
  const handleChangeCurrentPage = () => {
    setPageNumber(1);
  };

  function changePopup() {
    setOpenPopup(!isOpenPopup);
    setReload(!isReload);
  }

  return (
    <div className="account">
      <div className="acc-filter-bar">
        <div className="acc-search-container">
          <input
            type="text"
            id="search-bar"
            onInput={(e) => handleChangeSearchByKeyWord(e)}
            placeholder="Search"
          />
        </div>
        <div className="acc-func-btn">
          {listAccounts && (
            <CSVLink
              data={listAccounts}
              headers={headerExport}
              filename="accounts.csv"
            >
              <button className="acc-export-btn acc-button">Export CSV</button>
            </CSVLink>
          )}
          <button className="acc-create-btn acc-button" onClick={changePopup}>
            Create Account
          </button>
        </div>
      </div>
      {listAccounts && listAccounts.length > 0 ? (
        <AccTable
          listAccounts={listAccounts}
          keyWord={keyWord}
          pageNumber={pageNumber}
          handleChangeCurrentPage={handleChangeCurrentPage}
        />
      ) : (
        <div className="acc-nodata-text">NO DATA</div>
      )}
      {isOpenPopup && (
        <AccPopup
          changePopup={changePopup}
          keyWord={keyWord}
          pageNumber={pageNumber}
        />
      )}
      {listAccounts && totalRecords > 3 && (
        <Pagination
          currentPage={pageNumber}
          totalPages={pageCount}
          changeCurrentPage={handlePageClick}
          theme="square-fill"
        />
      )}
    </div>
  );
};

export default Account;
