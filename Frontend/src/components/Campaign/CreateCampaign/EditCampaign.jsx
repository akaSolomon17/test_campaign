import React, { useRef, useState, useEffect } from "react";
// import { useSelector } from "react-redux";

import "./CreateCampaign.scss";
import moment from "moment";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
// import AccountServices from "../../services/AccountServices";

const EditCampaign = (props) => {
  //   const token = useSelector((state) => state.token);

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [isDropDetail, setDropDetail] = useState(true);
  const [campaign, setCampaign] = useState({
    name: props.record ? props.record.name : "",
    user_status: props.record ? props.record.user_status : "",
    start_time: props.record ? props.record.start_time : "",
    end_time: props.record ? props.record.end_time : "",
    budget: props.record ? props.record.budget : "",
    bid_amount: props.record ? props.record.bid_amount : "",
    title: props.record ? props.record.title : "",
    description: props.record ? props.record.description : "",
    final_url: props.record ? props.record.final_url : "",
  });

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

  const userStatusRef = useRef();
  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const budgetRef = useRef();
  const bidAmountRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();
  const finalURLRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const user_status = userStatusRef.target.value;
    const start_time = startTimeRef.target.value;
    const end_time = endTimeRef.target.value;
    const budget = budgetRef.target.value;
    const bid_amount = bidAmountRef.target.value;
    const title = titleRef.target.value;
    const description = descriptionRef.target.value;
    const final_url = finalURLRef.target.value;

    const campData = {
      user_status: user_status,
      start_time: start_time,
      end_time: end_time,
      budget: budget,
      bid_amount: bid_amount,
      title: title,
      description: description,
      final_url: final_url,
    };
    try {
      //   const res = await AccountServices.updateAccount(campData, token);
      //   console.log(res);
      alert("UPDATE ACCOUNT SUCCESSFULLY!");
      closePopup();
    } catch (error) {
      alert("UPDATE ACCOUNT FAILED!");
    }
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
              ref={userStatusRef}
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
                ref={startTimeRef}
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
                ref={endTimeRef}
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
              ref={budgetRef}
              value={campaign.address}
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
              ref={bidAmountRef}
              value={campaign.address}
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
              ref={titleRef}
              value={campaign.address}
              onChange={handleTitleChange}
              type="text"
              name="budget"
            />
          </div>
          <div className="camp-text-input">
            Description:
            <input
              ref={descriptionRef}
              value={campaign.address}
              onChange={handleDescriptionChange}
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
              ref={finalURLRef}
              value={campaign.address}
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
