import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import "./CreateCampaign.scss";
import { updateCampaignAction } from "../../../store/actions/campaignActions";
import useAxios from "../../../utils/useAxios";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

const EditCampaign = (props) => {
  const api = useAxios();
  const startTimeForGet = props.startTime;
  const endTimeForget = props.endTime;
  const keyWord = props.keyWord;
  const pageNumber = props.pageNumber;
  const dispatch = useDispatch();

  const [startTime, setStartTime] = useState("2023-01-01 23:59:59");
  const [endTime, setEndTime] = useState("2023-12-12 23:59:59");
  const [isDropDetail, setDropDetail] = useState(true);

  const currentUser = useSelector((state) => state.auth?.currentUser);

  const formik = useFormik({
    initialValues: {
      user_id: props.record ? props.record.user_id : "",
      campaign_id: props.record ? props.record.campaign_id : "",
      name: props.record ? props.record.name : "",
      status: props.record ? props.record.status : true,
      start_date: props.record ? props.record.start_date : "",
      end_date: props.record ? props.record.end_date : "",
      budget: props.record ? props.record.budget : "",
      bid_amount: props.record ? props.record.bid_amount : "",
      title: props.record ? props.record.creatives[0].title : "",
      description: props.record ? props.record.creatives[0].description : "",
      img_preview: props.record ? props.record.creatives[0].img_preview : "",
      final_url: props.record ? props.record.creatives[0].final_url : "",
    },

    validationSchema: Yup.object({
      start_date: Yup.date().required("Required!"),
      end_date: Yup.date()
        .required("Required!")
        .when(
          "start_date",
          (start_date, yup) =>
            start_date &&
            yup.min(start_date, "End time cannot be before start time")
        ),
      budget: Yup.number()
        .typeError("Budget must be a number")
        .required("Please enter campaign's budget")
        .positive("Must be more than 0")
        .integer("Budget must be a integer")
        .max(
          Number.MAX_SAFE_INTEGER,
          "Budget must be less than or equal to 9007199254740991"
        ),
      bid_amount: Yup.number()
        .typeError("Bid amount must be a number")
        .required("Please enter campaign's bid amount")
        .positive("Must be more than 0")
        .integer("Bid amount must be a integer")
        .max(
          Number.MAX_SAFE_INTEGER,
          "Bid amount must be less than or equal to 9007199254740991"
        ),
      title: Yup.string()
        .min(2, "Title must have at least 2 characters")
        .max(255, "Exceed the number of characters"),
      description: Yup.string().min(
        2,
        "Description must have at least 2 characters"
      ),
      // img_preview: Yup.mixed()
      //   .required("Please choose a campaign's banner")
      //   .test(
      //     "FILE_TYPE",
      //     "Invalid type! Please choose another file",
      //     (value) =>
      //       value &&
      //       [
      //         "image/png",
      //         "image/jpg",
      //         "image/jpeg",
      //         "image/gif",
      //         "image/svg",
      //       ].includes(value.type)
      //   )
      //   .test(
      //     "Fichier taille",
      //     "Please choose a size less than 1 mb",
      //     (value) => !value || (value && value.size <= 1024 * 1024)
      //   ),
      final_url: Yup.string()
        .min(2, "URL must have at least 2 characters")
        .max(255, "Exceed the number of characters"),
    }),
    onSubmit: async (values) => {
      if (values.status === "") {
        values.status = "1";
      }
      let formData = {
        user_id: currentUser.user_id,
        status: values.status,
        start_date: values.start_date,
        end_date: values.end_date,
        budget: values.budget,
        bid_amount: values.bid_amount,
        title: values.title,
        description: values.description,
        img_preview: values.img_preview,
        final_url: values.final_url,
      };

      dispatch(
        updateCampaignAction(
          props.record.campaign_id,
          formData,
          {
            key_word: keyWord,
            start_time: startTimeForGet,
            end_time: endTimeForget,
            page_number: pageNumber,
          },
          api
        )
      );
      formik.resetForm();
      closePopup();
    },
  });

  const closePopup = () => {
    props.onClose();
  };

  const changeDetailDrop = () => {
    setDropDetail(!isDropDetail);
  };

  const handleDateChange = (event, dateField) => {
    const selectedDate = event.target.value;

    if (dateField === "start_date") {
      const minDateTime = moment().format("YYYY-MM-DD HH:mm");
      if (
        moment(selectedDate).isBefore(minDateTime) ||
        moment(selectedDate).isAfter(endTime)
      ) {
        return;
      }
      setStartTime(selectedDate);
    } else if (dateField === "end_date") {
      const minDateTime = moment(startTime)
        .add(1, "days")
        .format("YYYY-MM-DD HH:mm");
      if (
        moment(selectedDate).isBefore(minDateTime) ||
        moment(selectedDate).isBefore(startTime)
      ) {
        return;
      }
      setEndTime(selectedDate);
    }
  };

  return (
    <div className="camp-popup">
      <form onSubmit={formik.handleSubmit} className="camp-popup-inner">
        <div className="camp-title-pop">
          Edit Campaign
          <div className="underline"></div>
          <button className="camp-close-btn" onClick={closePopup}>
            <AiOutlineClose className="dropped-icon" />
          </button>
        </div>
        <Accordion
          allowMultipleExpanded
          preExpanded={[
            "active-detail",
            "active-schedule",
            "active-budget",
            "active-bidding",
            "active-creative",
          ]}
        >
          <AccordionItem uuid="active-detail">
            <AccordionItemHeading>
              <AccordionItemButton>Detail</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="camp-text-input">
                Name:
                <input
                  readOnly={true}
                  value={formik.values.name}
                  type="text"
                  name="name"
                />
                {formik.errors.name && (
                  <p className="error-text" style={{ color: "red" }}>
                    {formik.errors.name}
                  </p>
                )}
              </div>
              <div className="status-camp">
                User status:
                <select
                  value={formik.values.status ? formik.values.status : true}
                  onChange={formik.handleChange}
                  className="status-select"
                  name="status"
                >
                  <option value={true}>ACTIVE</option>
                  <option value={false}>INACTIVE</option>
                </select>
                {formik.errors.status && (
                  <p className="error-text" style={{ color: "red" }}>
                    {formik.errors.status}
                  </p>
                )}
              </div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem uuid="active-schedule">
            <AccordionItemHeading>
              <AccordionItemButton>Schedule</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="camp-schedule-input">
                Schedule:
                <div className="camp-starttime-container">
                  <label htmlFor="startDateTimePicker">Start Time: </label>
                  <input
                    type="datetime-local"
                    id="startDateTimePicker"
                    name="start_date"
                    value={formik.values.start_date}
                    onChange={(event) => {
                      formik.handleChange(event);
                      handleDateChange(event, "start_date");
                    }}
                  />
                  {formik.errors.start_date && (
                    <p className="error-text" style={{ color: "red" }}>
                      {formik.errors.start_date}
                    </p>
                  )}
                </div>
                <div className="camp-endtime-container">
                  <label htmlFor="endDateTimePicker">End Time:</label>
                  <input
                    className="endtime"
                    type="datetime-local"
                    id="endDateTimePicker"
                    name="end_date"
                    value={formik.values.end_date}
                    onChange={(event) => {
                      formik.handleChange(event);
                      handleDateChange(event, "end_date");
                    }}
                  />
                  {formik.errors.end_date && (
                    <p className="error-text" style={{ color: "red" }}>
                      {formik.errors.end_date}
                    </p>
                  )}
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem uuid="active-budget">
            <AccordionItemHeading>
              <AccordionItemButton>Budget</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="camp-text-input">
                Budget:
                <input
                  value={formik.values.budget}
                  onChange={formik.handleChange}
                  type="text"
                  name="budget"
                />
                {formik.errors.budget && (
                  <p className="error-text" style={{ color: "red" }}>
                    {formik.errors.budget}
                  </p>
                )}
              </div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem uuid="active-bidding">
            <AccordionItemHeading>
              <AccordionItemButton>Bidding</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="camp-text-input">
                Bid Amount:
                <input
                  value={formik.values.bid_amount}
                  onChange={formik.handleChange}
                  type="text"
                  name="bid_amount"
                />
                {formik.errors.bid_amount && (
                  <p className="error-text" style={{ color: "red" }}>
                    {formik.errors.bid_amount}
                  </p>
                )}
              </div>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem uuid="active-creative">
            <AccordionItemHeading>
              <AccordionItemButton>Creative</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="camp-text-input">
                Title:
                <input
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  type="text"
                  name="title"
                />
                {formik.errors.title && (
                  <p className="error-text" style={{ color: "red" }}>
                    {formik.errors.title}
                  </p>
                )}
              </div>
              <div className="camp-text-input">
                Description:
                <input
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  type="text"
                  name="description"
                />
                {formik.errors.description && (
                  <p className="error-text" style={{ color: "red" }}>
                    {formik.errors.description}
                  </p>
                )}
              </div>
              <div className="camp-text-input">
                Creative preview:
                <img
                  className="img-preview"
                  src={
                    formik.values.preview_img
                      ? formik.values.preview_img
                      : "https://res.cloudinary.com/dooge27kv/image/upload/v1701941092/Insert_image_here_kttfjb.svg"
                  }
                  alt="img-preview"
                />
                {formik.errors.preview_img && (
                  <p className="error-text" style={{ color: "red" }}>
                    {formik.errors.preview_img}
                  </p>
                )}
              </div>
              <div className="camp-text-input">
                Final URL:
                <input
                  value={formik.values.final_url}
                  onChange={formik.handleChange}
                  type="text"
                  name="final_url"
                />
                {formik.errors.final_url && (
                  <p className="error-text" style={{ color: "red" }}>
                    {formik.errors.final_url}
                  </p>
                )}
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
        <div className="camp-footer-pop">
          <div className="underline"></div>
          <button className="cancel-btn" onClick={closePopup}>
            Cancel
          </button>
          <button
            type="submit"
            className="save-btn"
            onClick={formik.handleSubmit}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCampaign;
