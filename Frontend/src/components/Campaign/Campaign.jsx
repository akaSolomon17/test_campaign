import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./Campaign.scss";

import moment from "moment";
import { CSVLink } from "react-csv";

import CampaignTable from "./CampaignTable/CampaignTable";
import CreateCampaign from "./CreateCampaign/CreateCampaign";
import { fetchListCampaignAction } from "../../store/actions/campaignActions";
import useAxios from "../../utils/useAxios";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const Campaign = () => {
  const searchRef = useRef();
  const [searchInfo, setSearchInfo] = useState({
    key_word: "",
    page_number: 1,
    start_time: "",
    end_time: "",
  });
  const handleChangeSearchByKeyWord = (e) => {
    const value = e.target.value;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setSearchInfo({ ...searchInfo, key_word: value });
    }, 600);
  };
  const handleChangeSearchByStartTime = (e) => {
    if (
      searchInfo.end_time !== "" &&
      searchInfo.end_time < e.target.value.replace("T", " ")
    ) {
      toast.error("End time cannot be before start time");
    } else {
      setSearchInfo({
        ...searchInfo,
        start_time: e.target.value.replace("T", " "),
      });
    }
  };
  const handleChangeSearchByEndTime = (e) => {
    if (
      searchInfo.start_time !== "" &&
      searchInfo.start_time > e.target.value.replace("T", " ")
    ) {
      toast.error("End time cannot be before start time");
    } else {
      setSearchInfo({
        ...searchInfo,
        end_time: e.target.value.replace("T", " "),
      });
    }
  };
  const typingTimeoutRef = useRef(null);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [dataSearch, setDataSearch] = useState({ search: null });

  const [loading, setLoading] = useState(false);

  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isReload, setReload] = useState(true); // set Callback

  const [data, setData] = useState([]);

  const api = useAxios();
  const dispatch = useDispatch();
  const listCampaigns = useSelector((state) => state.campaign.listCampaigns);

  const { err, success } = data;

  useEffect(() => {
    const currentMoment = moment();
    const formatCurrentDate = currentMoment.format("YYYY-MM-DDTHH:mm");

    setStartTime(formatCurrentDate);
    setEndTime(formatCurrentDate);
  }, [setStartTime, setEndTime]);

  function changePopup() {
    setOpenPopup(!isOpenPopup);
    setReload(!isReload);
  }

  function handleSearch() {
    let search = searchRef.current.value;
    setDataSearch({ search: search });
    setReload(!isReload);
  }

  function handleStartTimeChange(event) {
    const selectedStartTime = event.target.value;
    const currentMoment = moment();
    const minDateTime = currentMoment.format("YYYY-MM-DDTHH:mm");

    if (moment(selectedStartTime).isBefore(minDateTime)) {
      return;
    }

    if (moment(selectedStartTime).isAfter(endTime)) {
      return;
    }

    setStartTime(selectedStartTime);
  }
  function handleEndTimeChange(event) {
    const selectedEndTime = event.target.value;
    const minDateTime = moment(startTime)
      .add(1, "days")
      .format("YYYY-MM-DDTHH:mm");

    if (moment(selectedEndTime).isBefore(minDateTime)) {
      return;
    }

    if (moment(selectedEndTime).isBefore(startTime)) {
      return;
    }

    setEndTime(selectedEndTime);
  }

  //dispatch to fetch all Campaigns
  // useEffect(() => {
  //   // dispatch(fetchListCampaignAction(api));

  // }, []);
  useEffect(() => {
    dispatch(
      fetchListCampaignAction(
        searchInfo.key_word,
        searchInfo.page_number,
        searchInfo.start_time,
        searchInfo.end_time
      )
    );
  }, [searchInfo]);

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
          <input
            type="text"
            id="search-bar"
            onBlur={handleSearch}
            ref={searchRef}
            placeholder="Search"
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
        <CampaignTable listCampaigns={listCampaigns} />
      ) : (
        <div className="camp-nodata-text">NO DATA</div>
      )}
      {isOpenPopup && <CreateCampaign changePopup={changePopup} />}
      <div className="page-navigation">
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          // pageCount={pageCount}
          // onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          renderOnZeroPageCount={null}
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
      </div>
    </div>
  );
};

export default Campaign;
