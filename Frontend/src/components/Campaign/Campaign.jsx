import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";

import "./Campaign.scss";

import moment from "moment";
import { CSVLink } from "react-csv";

import CampaignTable from "./CampaignTable/CampaignTable";
import CreateCampaign from "./CreateCampaign/CreateCampaign";
import { fetchListCampaignAction } from "../../store/actions/campaignActions";
import useAxios from "../../utils/useAxios";
import ReactPaginate from "react-paginate";
import { addDays, format } from "date-fns";

const Campaign = () => {
  const typingTimeoutRef = useRef(null);
  const currentMoment = moment();

  // const [startTime, setStartTime] = useState(
  //   format(new Date(), "yyyy-MM-dd HH:mm:ss")
  // );
  // const [endTime, setEndTime] = useState(
  //   format(addDays(new Date(), 1), "yyyy-MM-dd HH:mm:ss")
  // );
  const [startTime, setStartTime] = useState("2023-01-01 23:59:59");
  const [endTime, setEndTime] = useState("2023-12-11 00:07:55");
  const [pageNumber, setPageNumber] = useState(1);
  const [keyWord, setkeyWord] = useState("ALL");

  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isReload, setReload] = useState(true); // set Callback

  const [data, setData] = useState([]);

  const api = useAxios();
  const dispatch = useDispatch();
  const listCampaigns = useSelector((state) => state.campaign.listCampaigns);
  console.log(
    "🚀 ~ file: Campaign.jsx:41 ~ Campaign ~ listCampaigns:",
    listCampaigns
  );
  const totalRecords = useSelector((state) => state.campaign.totalRecords);
  const pageCount = Math.ceil(totalRecords / 3);
  const handlePageClick = (event) => {
    setPageNumber(event.selected + 1);
  };

  const { err, success } = data;

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
  // const handleChangeSearchByStartTime = (e) => {
  //   if (
  //     searchInfo.end_time !== "" &&
  //     searchInfo.end_time < e.target.value.replace("T", " ")
  //   ) {
  //     toast.error("End time cannot be before start time");
  //   } else {
  //     setSearchInfo({
  //       ...searchInfo,
  //       start_time: e.target.value.replace("T", " "),
  //     });
  //   }
  // };
  // const handleChangeSearchByEndTime = (e) => {
  //   if (
  //     searchInfo.start_time !== "" &&
  //     searchInfo.start_time > e.target.value.replace("T", " ")
  //   ) {
  //     toast.error("End time cannot be before start time");
  //   } else {
  //     setSearchInfo({
  //       ...searchInfo,
  //       end_time: e.target.value.replace("T", " "),
  //     });
  //   }
  // };

  function changePopup() {
    setOpenPopup(!isOpenPopup);
    setReload(!isReload);
  }

  function handleStartTimeChange(event) {
    const selectedStartTime = event.target.value;
    const currentMoment = moment();
    // const minDateTime = currentMoment.format("YYYY-MM-DDTHH:mm:ss");

    // if (moment(selectedStartTime).isBefore(minDateTime)) {
    //   return;
    // }

    if (moment(selectedStartTime).isAfter(endTime)) {
      return;
    }

    // Format the date using moment before setting it
    setStartTime(moment(selectedStartTime).format("YYYY-MM-DD HH:mm:ss"));
  }

  function handleEndTimeChange(event) {
    const selectedEndTime = event.target.value;
    const minDateTime = moment(startTime)
      .add(1, "days")
      .format("YYYY-MM-DDTHH:mm:ss");

    if (moment(selectedEndTime).isBefore(minDateTime)) {
      return;
    }

    if (moment(selectedEndTime).isBefore(startTime)) {
      return;
    }

    // Format the date using moment before setting it
    setEndTime(moment(selectedEndTime).format("YYYY-MM-DDTHH:mm:ss"));
  }

  useEffect(() => {
    dispatch(
      fetchListCampaignAction(
        {
          key_word: keyWord,
          page_number: pageNumber,
          start_time: startTime,
          end_time: endTime,
        },
        api
      )
    );
  }, [pageNumber, keyWord]);
  const setPageNumberDefault = () => {
    setPageNumber(1);
    dispatch(
      fetchListCampaignAction(
        {
          key_word: keyWord,
          page_number: pageNumber,
          start_time: startTime,
          end_time: endTime,
        },
        api
      )
    );
  };

  return (
    <div className="campaign-grid">
      {/* {err && showErrMsg(err)}
      {success && showSuccessMsg(success)}
      {loading && <h3>Loading.....</h3>} */}

      <div className="camp-filter-bar">
        <div className="camp-datetime">
          <div className="starttime-container">
            <label htmlFor="startDateTimePicker">Start Time:</label>
            <input
              type="datetime-local"
              id="startDateTimePicker"
              name="startDateTimePicker"
              value={startTime}
              onChange={handleStartTimeChange}
            ></input>
          </div>
          <div className="endtime-container">
            <label htmlFor="endDateTimePicker">End Time:</label>
            <input
              className="endtime"
              type="datetime-local"
              id="endDateTimePicker"
              name="endDateTimePicker"
              value={endTime}
              onChange={handleEndTimeChange}
            ></input>
          </div>
        </div>
        <div className="camp-search-container">
          {/* <input
            type="text"
            id="search-bar"
            onBlur={handleSearch}
            ref={searchRef}
            placeholder="Search"
          /> */}
          <input
            type="search"
            placeholder="Search"
            id="search-bar"
            onInput={(e) => handleChangeSearchByKeyWord(e)}
          />
          <div className="camp-func-btn-container">
            <CSVLink
              type="button"
              className="camp-export-btn camp-button"
              data={data}
            >
              Export CSV
            </CSVLink>
            <button
              className="camp-create-btn camp-button"
              onClick={changePopup}
            >
              Create Campaign
            </button>
          </div>
        </div>
      </div>

      {listCampaigns && listCampaigns.length > 0 ? (
        <CampaignTable
          listCampaigns={listCampaigns}
          startTime={startTime}
          endTime={endTime}
          keyWord={keyWord}
          pageNumber={pageNumber}
          setPageNumberDefault={setPageNumberDefault}
        />
      ) : (
        <div className="camp-nodata-text">NO CAMPAIGN FOUND</div>
      )}
      {isOpenPopup && (
        <CreateCampaign
          changePopup={changePopup}
          startTime={startTime}
          endTime={endTime}
          keyWord={keyWord}
          pageNumber={pageNumber}
        />
      )}
      {listCampaigns && totalRecords > 3 && (
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

export default Campaign;
