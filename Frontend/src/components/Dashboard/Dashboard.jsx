import React, { useRef, useState, useEffect } from "react";
import moment from "moment";

import "./Dashboard.scss";
import DashboardTable from "./DashboardTable/DashboardTable";

const Dashboard = (props) => {
  const searchRef = useRef();
  const [dataSearch, setDataSearch] = useState({ search: null });
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isReload, setReload] = useState(true); // set Callback
  const [data, setData] = useState([]);

  useEffect(() => {
    const currentMoment = moment();
    const formatCurrentDate = currentMoment.format("YYYY-MM-DDTHH:mm");

    setStartTime(formatCurrentDate);
    setEndTime(formatCurrentDate);
  }, [setStartTime, setEndTime]);

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
    <div className="dash-grid">
      {/* {err && showErrMsg(err)}
  {success && showSuccessMsg(success)}
  {loading && <h3>Loading.....</h3>} */}

      <div className="dash-filter-bar">
        <div className="dash-search-container">
          <input
            type="text"
            id="search-bar"
            onBlur={handleSearch}
            ref={searchRef}
            placeholder="Search"
          />
          <label id="label-start-time" htmlFor="startDateTimePicker">
            Start Time:
          </label>
          <input
            type="datetime-local"
            id="startDateTimePicker"
            name="startDateTimePicker"
            value={startTime}
            onChange={handleStartTimeChange}
          ></input>
          <label id="label-end-time" htmlFor="endDateTimePicker">
            End Time:
          </label>
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
      {data && <DashboardTable data={data} />}
    </div>
  );
};

export default Dashboard;
