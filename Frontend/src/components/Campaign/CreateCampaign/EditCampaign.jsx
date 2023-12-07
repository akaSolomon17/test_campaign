import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";

import "./CreateCampaign.scss";
import moment from "moment";

import { updateCampaignAction } from "../../../store/actions/campaignActions";
import useAxios from "../../../utils/useAxios";

const EditCampaign = (props) => {
  const api = useAxios();
  const dispatch = useDispatch();
  const initialState = {
    user_id: props.record ? props.record.user_id : "",
    campaign_id: props.record ? props.record.campaign_id : "",
    name: props.record ? props.record.name : "",
    user_status: props.record ? props.record.user_status : true,
    start_time: props.record ? props.record.start_date : "",
    end_time: props.record ? props.record.end_date : "",
    budget: props.record ? props.record.budget : "",
    bid_amount: props.record ? props.record.bid_amount : "",
    title: props.record ? props.record.creatives[0].title : "",
    description: props.record ? props.record.creatives[0].description : "",
    img_preview: props.record ? props.record.creatives[0].img_preview : "",
    final_url: props.record ? props.record.creatives[0].final_url : "",
  };

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isDropDetail, setDropDetail] = useState(true);
  const [campaign, setCampaign] = useState(initialState);

  useEffect(() => {
    const currentMoment = moment();
    const formatCurrentDate = currentMoment.format("YYYY-MM-DDTHH:mm");

    setStartTime(formatCurrentDate);
    setEndTime(formatCurrentDate);
  }, [setStartTime, setEndTime]);

  const handleUserStatusChange = (e) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      user_status: e.target.value,
    }));
  };
  const handleStartTimeChange = (e) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      start_time: e.target.value,
    }));
  };
  const handleEndTimeChange = (e) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      end_time: e.target.value,
    }));
  };
  const handleBudgetChange = (e) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      budget: e.target.value,
    }));
  };
  const handleBidAmountChange = (e) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      bid_amount: e.target.value,
    }));
  };
  const handleTitleChange = (e) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      title: e.target.value,
    }));
  };
  const handleDescriptionChange = (e) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      description: e.target.value,
    }));
  };
  const handleFinalURLChange = (e) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      final_url: e.target.value,
    }));
  };

  const closePopup = () => {
    props.onClose();
  };

  const changeDetailDrop = () => {
    setDropDetail(!isDropDetail);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const campData = {
      user_id: campaign.user_id,
      user_status: campaign.user_status,
      start_date: campaign.start_time,
      end_date: campaign.end_time,
      budget: campaign.budget,
      bid_amount: campaign.bid_amount,
      title: campaign.title,
      description: campaign.description,
      img_preview: campaign.img_preview,
      final_url: campaign.final_url,
    };
    dispatch(updateCampaignAction(campaign.campaign_id, campData, api));
    closePopup();
    // try {
    //   alert("UPDATE ACCOUNT SUCCESSFULLY!");
    //   closePopup();
    // } catch (error) {
    //   alert("UPDATE ACCOUNT FAILED!");
    // }
  }

  return (
    <div className="camp-popup">
      <form onSubmit={handleSubmit} className="camp-popup-inner">
        <div className="camp-title-pop">
          Edit Campaign
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
              readOnly={true}
              value={campaign.name}
              type="text"
              name="name"
            />
          </div>
          <div className="status-camp">
            User status:
            <select
              value={campaign.user_status ? campaign.user_status : "1"}
              onChange={handleUserStatusChange}
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
                value={campaign.start_time}
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
                value={campaign.end_time}
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
              value={campaign.budget}
              onChange={handleBudgetChange}
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
              value={campaign.bid_amount}
              onChange={handleBidAmountChange}
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
              value={campaign.title}
              onChange={handleTitleChange}
              type="text"
              name="budget"
            />
          </div>
          <div className="camp-text-input">
            Description:
            <input
              value={campaign.description}
              onChange={handleDescriptionChange}
              type="text"
              name="description"
            />
          </div>
          <div className="camp-text-input">
            Creative preview:
            <img
              className="img-preview"
              src={
                campaign.preview_img
                  ? campaign.preview_img
                  : "https://res.cloudinary.com/dooge27kv/image/upload/v1701941092/Insert_image_here_kttfjb.svg"
              }
              alt="img-preview"
            />
          </div>
          <div className="camp-text-input">
            Final URL:
            <input
              value={campaign.final_url}
              onChange={handleFinalURLChange}
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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCampaign;
