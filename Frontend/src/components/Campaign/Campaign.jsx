import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "react-pagination-library";
import "react-pagination-library/build/css/index.css";
import "./Campaign.scss";
import moment from "moment";
import { CSVLink } from "react-csv";
import CampaignTable from "./CampaignTable/CampaignTable";
import CreateCampaign from "./CreateCampaign/CreateCampaign";
import { fetchListCampaignAction } from "../../store/actions/campaignActions";
import useAxios from "../../utils/useAxios";

const Campaign = () => {
  const typingTimeoutRef = useRef(null);
  const [startTime, setStartTime] = useState("2023-01-01 23:59:59");
  const [endTime, setEndTime] = useState("2023-12-12 23:59:59");
  const [pageNumber, setPageNumber] = useState(1);
  const [keyWord, setkeyWord] = useState("ALL");
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isReload, setReload] = useState(true); // set Callback
  const api = useAxios();
  const dispatch = useDispatch();
  const listCampaigns = useSelector((state) => state.campaign.listCampaigns);

  const totalRecords = useSelector((state) => state.campaign.totalRecords);
  const pageCount = Math.ceil(totalRecords / 3);

  // const headerExport = [
  //   { label: "Name", key: "name" },
  //   { label: "Status", key: "status" },
  //   { label: "Used Amount", key: "used_amount" },
  //   { label: "Usage Rate", key: "usage_rate" },
  //   { label: "Budget", key: "budget" },
  //   { label: "Bid amount", key: "bid_amount" },
  //   { label: "Start date", key: "start_date" },
  //   { label: "End date", key: "end_date" },
  //   { label: "Description", key: "description" },
  //   { label: "Final url", key: "final_url" },
  //   { label: "Title", key: "title" },
  //   { label: "Banner", key: "banner" },
  // ];

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

  function changePopup() {
    setOpenPopup(!isOpenPopup);
    setReload(!isReload);
  }

  function handleStartTimeChange(event) {
    const selectedStartTime = event.target.value;
    if (moment(selectedStartTime).isAfter(endTime)) {
      return;
    }
    setStartTime(moment(selectedStartTime).format("YYYY-MM-DD HH:mm:ss"));
  }

  function handleEndTimeChange(event) {
    const selectedEndTime = event.target.value;
    const minDateTime = moment(startTime)
      .add(1, "days")
      .format("YYYY-MM-DD HH:mm:ss");
    if (moment(selectedEndTime).isBefore(minDateTime)) {
      return;
    }
    if (moment(selectedEndTime).isBefore(startTime)) {
      return;
    }
    setEndTime(moment(selectedEndTime).format("YYYY-MM-DD HH:mm:ss"));
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
  }, [pageNumber, keyWord, startTime, endTime]);

  const handleChangeCurrentPage = () => {
    setPageNumber(1);
  };

  return (
    <div className="campaign-grid">
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
              data={Array.isArray(listCampaigns) ? listCampaigns : []}
              filename="campaigns.csv"
              // headers={headerExport}
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
          handleChangeCurrentPage={handleChangeCurrentPage}
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
        <Pagination
          // key={pageNumber}
          currentPage={pageNumber}
          totalPages={pageCount}
          changeCurrentPage={handlePageClick}
          theme="square-fill"
        />
      )}
    </div>
  );
};

export default Campaign;
