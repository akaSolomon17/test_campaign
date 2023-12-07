import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import moment from "moment";
import "./CreateCampaign.scss";

import { createCampaignAction } from "../../../store/actions/campaignActions";
import useAxios from "../../../utils/useAxios";

const CreateCampaign = (props) => {
  const api = useAxios();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth?.currentUser);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const initialState = {
    name: "",
    user_status: true,
    start_date: moment(startTime).format("YYYY-MM-DD HH:mm:ss"),
    end_date: moment(endTime).format("YYYY-MM-DD HH:mm:ss"),
    budget: "",
    bid_amount: "",
    title: "",
    description: "",
    img_preview:
      "https://res.cloudinary.com/dooge27kv/image/upload/v1701586838/project/6SB-7138-87000072_fpnway.jpg",
    final_url: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [isDropDetail, setDropDetail] = useState(true);

  useEffect(() => {
    const currentMoment = moment();
    const formatCurrentDate = currentMoment.format("YYYY-MM-DDTHH:mm");

    setStartTime(formatCurrentDate);
    setEndTime(formatCurrentDate);
  }, [setStartTime, setEndTime]);

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const closePopup = () => {
    props.changePopup();
  };

  const changeDetailDrop = () => {
    setDropDetail(!isDropDetail);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const createFormData = {
      ...formData,
      user_id: currentUser.user_id,
    };

    dispatch(createCampaignAction(createFormData, api));
    closePopup();
  };

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
              value={formData.user_status ? formData.user_status : true}
              onChange={handleChange}
              className="status-select"
              name="status"
            >
              <option value={true}>ACTIVE</option>
              <option value={false}>INACTIVE</option>
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
              value={formData.budget}
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
              value={formData.bid_amount}
              onChange={handleChange}
              type="text"
              name="bid_amount"
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
              value={formData.title}
              onChange={handleChange}
              type="text"
              name="title"
            />
          </div>
          <div className="camp-text-input">
            Description:
            <input
              value={formData.description}
              onChange={handleChange}
              type="text"
              name="description"
            />
          </div>
          <div className="camp-text-input">
            Creative preview:
            <img
              className="img-preview"
              src={formData.img_preview}
              alt="img-preview"
            />
          </div>
          <div className="camp-text-input">
            Final URL:
            <input
              value={formData.final_url}
              onChange={handleChange}
              type="text"
              name="final_url"
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
