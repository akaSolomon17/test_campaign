import React, { useRef, useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import "./Campaign.scss";
import CampaignTable from "./CampaignTable/CampaignTable";
import moment from "moment";
import CreateCampaign from "./CreateCampaign/CreateCampaign";

const initialState = {
  user_id: "",
};

const Campaign = () => {
  const searchRef = useRef();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [dataSearch, setDataSearch] = useState({ search: null });
  const [loading, setLoading] = useState(false);
  const [isOpenPopup, setOpenPopup] = useState(false);
  const [isReload, setReload] = useState(true); // set Callback
  const [data, setData] = useState([initialState]);

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

      {data && <CampaignTable data={data} />}
      {!data && <div className="camp-nodata-text">NO DATA</div>}
      {isOpenPopup && <CreateCampaign changePopup={changePopup} />}
    </div>
  );
};

export default Campaign;
