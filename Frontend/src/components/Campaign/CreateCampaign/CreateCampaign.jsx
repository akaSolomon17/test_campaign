import React, { useState, useEffect } from "react";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import moment from "moment";
import "./CreateCampaign.scss";
import AccountServices from "../../../services/AccountServices";
import { useSelector } from "react-redux";

const CreateCampaign = (props) => {
  const token = useSelector((state) => state.token);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [formData, setFormData] = useState("");
  const [isDropDetail, setDropDetail] = useState(true);

  useEffect(() => {
    const currentMoment = moment();
    const formatCurrentDate = currentMoment.format("YYYY-MM-DDTHH:mm");

    setStartTime(formatCurrentDate);
    setEndTime(formatCurrentDate);
  }, [setStartTime, setEndTime]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const closePopup = () => {
    props.changePopup();
  };

  const changeDetailDrop = () => {
    setDropDetail(!isDropDetail);
  };

  function handleStartTimeChange(event) {
    setStartTime(event.target.value);
  }

  function handleEndTimeChange(event) {
    setEndTime(event.target.value);
  }

  return (
    <div className="camp-popup">
      <form onSubmit={handleSubmit} className="camp-popup-inner">
        <div className="camp-title-pop">
          Create Campaign
          <div className="underline"></div>
          <button className="camp-close-btn" onClick={closePopup}>
            <AiOutlineClose
              className={`${isDropDetail ? "" : "dropped-icon"}`}
            />
          </button>
        </div>
        <div className="camp-title" onClick={changeDetailDrop}>
          Detail
          <AiOutlineDown className="drop-btn" />
        </div>
        <div className={`${"mg-right"} ${isDropDetail ? "" : "camp-dropped"}`}>
          <div className="camp-text-input">
            Name:
            <input
              value={formData.name}
              onChange={handleChange}
              type="text"
              name="name"
            />
          </div>
          <div className="status-camp">
            User status:
            <select
              value={formData.user_status ? formData.user_status : "1"}
              onChange={handleChange}
              className="status-select"
              name="status"
            >
              <option value="1">ACTIVE</option>
              <option value="2">INACTIVE</option>
            </select>
          </div>
        </div>
        <div className="camp-title" onClick={changeDetailDrop}>
          Schedule
          <AiOutlineDown className="drop-btn" />
        </div>
        <div className={`${"mg-right"} ${isDropDetail ? "" : "camp-dropped"}`}>
          <div className="camp-schedule-input">
            Schedule:
            <div className="camp-starttime-container">
              <label htmlFor="startDateTimePicker">Start Time: </label>
              <input
                type="datetime-local"
                id="startDateTimePicker"
                name="startDateTimePicker"
                value={startTime}
                onChange={handleStartTimeChange}
              ></input>
            </div>
            <div className="camp-endtime-container">
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
        </div>

        <div className="camp-title" onClick={changeDetailDrop}>
          Budget
          <AiOutlineDown className="drop-btn" />
        </div>
        <div className={`${"mg-right"} ${isDropDetail ? "" : "camp-dropped"}`}>
          <div className="camp-text-input">
            Budget:
            <input
              value={formData.address}
              onChange={handleChange}
              type="text"
              name="budget"
            />
          </div>
        </div>

        <div className="camp-title" onClick={changeDetailDrop}>
          Bidding
          <AiOutlineDown className="drop-btn" />
        </div>
        <div className={`${"mg-right"} ${isDropDetail ? "" : "camp-dropped"}`}>
          <div className="camp-text-input">
            Bid Amount:
            <input
              value={formData.address}
              onChange={handleChange}
              type="text"
              name="budget"
            />
          </div>
        </div>
        <div className="camp-title" onClick={changeDetailDrop}>
          Creative
          <AiOutlineDown className="drop-btn" />
        </div>
        <div className={`${"mg-right"} ${isDropDetail ? "" : "camp-dropped"}`}>
          <div className="camp-text-input">
            Title:
            <input
              value={formData.address}
              onChange={handleChange}
              type="text"
              name="budget"
            />
          </div>
          <div className="camp-text-input">
            Description:
            <input
              value={formData.address}
              onChange={handleChange}
              type="text"
              name="description"
            />
          </div>
          <div className="camp-text-input">
            Creative preview:
            <img
              className="preview-img"
              src="https://res.cloudinary.com/dooge27kv/image/upload/v1701586838/project/6SB-7138-87000072_fpnway.jpg"
              alt="preview-img"
            />
          </div>
          <div className="camp-text-input">
            Final URL:
            <input
              value={formData.address}
              onChange={handleChange}
              type="text"
              name="description"
            />
          </div>
        </div>

        <div className="camp-footer-pop">
          <div className="underline"></div>
          <button className="cancel-btn" onClick={closePopup}>
            Cancel
          </button>
          <button type="submit" className="save-btn" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
