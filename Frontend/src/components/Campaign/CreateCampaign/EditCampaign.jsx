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
  const [campaign, setCampaign] = useState();

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
      name: Yup.string()
        .required("Please enter campaign's name")
        .min(2, "Name must have at least 2 characters")
        .max(255, "Exceed the number of characters"),
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
      img_preview: Yup.mixed()
        .required("Please choose a campaign's banner")
        .test(
          "FILE_TYPE",
          "Invalid type! Please choose another file",
          (value) =>
            value &&
            [
              "image/png",
              "image/jpg",
              "image/jpeg",
              "image/gif",
              "image/svg",
            ].includes(value.type)
        )
        .test(
          "Fichier taille",
          "Please choose a size less than 1 mb",
          (value) => !value || (value && value.size <= 1024 * 1024)
        ),
      final_url: Yup.string()
        .min(2, "URL must have at least 2 characters")
        .max(255, "Exceed the number of characters"),
    }),
    onSubmit: async (values) => {
      if (values.status === "") {
        values.status = "1";
      }
      let formData = {
        name: values.name,
        status: values.status,
        start_time: values.start_date,
        end_time: values.end_date,
        budget: values.budget,
        bid_amount: values.bid_amount,
        title: values.title,
        description: values.description,
        img_preview: values.img_preview,
        final_url: values.final_url,
        user_id: currentUser.user_id,
      };

      dispatch(
        updateCampaignAction(
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

  function handleStartTimeChange(event) {
    const selectedStartTime = event.target.value;

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
      .format("YYYY-MM-DD HH:mm:ss");

    if (moment(selectedEndTime).isBefore(minDateTime)) {
      return;
    }

    if (moment(selectedEndTime).isBefore(startTime)) {
      return;
    }

    // Format the date using moment before setting it
    setEndTime(moment(selectedEndTime).format("YYYY-MM-DD HH:mm:ss"));
  }

  return (
    <div className="camp-popup">
      <form onSubmit={formik.handleSubmit} className="camp-popup-inner">
        <div className="camp-title-pop">
          Edit Campaign
          <div className="underline"></div>
          <button className="camp-close-btn" onClick={closePopup}>
            <AiOutlineClose
              className={`${isDropDetail ? "" : "dropped-icon"}`}
            />
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
              </div>
              <div className="status-camp">
                User status:
                <select
                  value={formik.values.status ? formik.values.status : "1"}
                  onChange={formik.handleChange}
                  className="status-select"
                  name="status"
                >
                  <option value={1}>ACTIVE</option>
                  <option value={0}>INACTIVE</option>
                </select>
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
                    name="startDateTimePicker"
                    value={formik.values.start_time}
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
                    value={formik.values.end_time}
                    onChange={handleEndTimeChange}
                  ></input>
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
                  name="budget"
                />
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
                  name="budget"
                />
              </div>
              <div className="camp-text-input">
                Description:
                <input
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  type="text"
                  name="description"
                />
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
              </div>
              <div className="camp-text-input">
                Final URL:
                <input
                  value={formik.values.final_url}
                  onChange={formik.handleChange}
                  type="text"
                  name="description"
                />
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
