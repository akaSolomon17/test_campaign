import React, { useRef, useState, useEffect } from "react";
import useAxios from "../../utils/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import "react-pagination-js/dist/styles.css";
import "./Account.scss";
import AccTable from "./AccountTable/AccTable";
import AccPopup from "./AccountPopup/AccPopup";

import { fetchListAccountAction } from "../../store/actions/accountAction";
import ReactPaginate from "react-paginate";

const Account = () => {
  const typingTimeoutRef = useRef(null);
  const api = useAxios();
  const dispatch = useDispatch();

  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isReload, setReload] = useState(true); // set Callback
  const [pageNumber, setPageNumber] = useState(1);
  const [keyWord, setkeyWord] = useState("ALL");

  const listAccounts = useSelector((state) => state.account.listAccounts);
  const totalRecords = useSelector((state) => state.account.totalRecords);
  const pageCount = Math.ceil(totalRecords / 3);

  const handlePageClick = (event) => {
    setPageNumber(event.selected + 1);
  };

  const handleChangeSearchByKeyWord = (e) => {
    const value = e.target.value;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      // setSearchInfo({ ...searchInfo, key_word: value });
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
  const setPageNumberDefault = () => {
    setPageNumber(1);
    dispatch(
      fetchListAccountAction(
        {
          key_word: keyWord,
          page_number: pageNumber,
        },
        api
      )
    );
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
          {/* <CSVLink
            // data={listAccounts}
            headers={headerExport}
            filename="accounts.csv"
          >
            <button className="acc-export-btn acc-button">Export CSV</button>
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
      {isOpenPopup && (
        <AccPopup
          changePopup={changePopup}
          keyWord={keyWord}
          pageNumber={pageNumber}
        />
      )}
      {listAccounts && totalRecords > 3 && (
        <ReactPaginate
          previousLabel={"◀️"}
          nextLabel={"▶️"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination justify-content-center"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      )}
    </div>
  );
};

export default Account;
