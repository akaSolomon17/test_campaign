import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import moment from "moment";
import "./CreateCampaign.scss";
import { createCampaignAction } from "../../../store/actions/campaignActions";
import useAxios from "../../../utils/useAxios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

const CreateCampaign = (props) => {
  const api = useAxios();
  const dispatch = useDispatch();
  const startTimeForGet = props.startTime;
  const endTimeForGet = props.endTime;
  const keyWord = props.keyWord;
  const pageNumber = props.pageNumber;

  const currentUser = useSelector((state) => state.auth?.currentUser);

  const [startTime, setStartTime] = useState("2023-01-01 23:59:59");
  const [endTime, setEndTime] = useState("2023-12-12 23:59:59");
  const [previewBanner, setPreviewBanner] = useState("");
  const [isDropDetail, setDropDetail] = useState(true);

  const formik = useFormik({
    initialValues: {
      name: "",
      status: true,
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
          "start_time",
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
          2147483647,
          "Budget must be less than or equal to 9007199254740991"
        ),
      bid_amount: Yup.number()
        .typeError("Bid amount must be a number")
        .required("Please enter campaign's bid amount")
        .positive("Bid amount must be positive")
        .integer("Bid amount must be an integer")
        .max(2147483647, "Bid amount exceeds the maximum value for an INT"),
      title: Yup.string()
        .min(2, "Title must have at least 2 characters")
        .max(255, "Exceed the number of characters"),
      description: Yup.string().min(
        2,
        "Description must have at least 2 characters"
      ),
      // img_preview: Yup.mixed()
      //   .required("Please choose your campaign banner")
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
        .required("Final URL is required")
        .min(2, "URL must have at least 2 characters")
        .max(255, "Exceed the number of characters"),
    }),

    onSubmit: async (values) => {
      if (values.status === "") {
        values.status = true;
      }
      const formData = {
        user_id: currentUser.user_id,
        name: values.name,
        status: values.status ? values.status : true,
        user_status: true,
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
        createCampaignAction(
          formData,
          {
            key_word: keyWord,
            start_time: startTimeForGet,
            end_time: endTimeForGet,
            page_number: pageNumber,
          },
          api
        )
      );

      formik.resetForm();
      setPreviewBanner("");

      closePopup();
    },
  });

  const closePopup = () => {
    props.changePopup();
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
          Create Campaign
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
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  type="text"
                  name="name"
                />
                {formik.touched.name && formik.errors.name && (
                  <p style={{ color: "red" }}>{formik.errors.name}</p>
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
                  {formik.touched.start_date && formik.errors.start_date && (
                    <p style={{ color: "red" }}>{formik.errors.start_date}</p>
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
                  {formik.touched.end_date && formik.errors.end_date && (
                    <p style={{ color: "red" }}>{formik.errors.end_date}</p>
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
                {formik.touched.budget && formik.errors.budget && (
                  <p style={{ color: "red" }}>{formik.errors.budget}</p>
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
                {formik.touched.bid_amount && formik.errors.bid_amount && (
                  <p style={{ color: "red" }}>{formik.errors.bid_amount}</p>
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
                {formik.touched.title && formik.errors.title && (
                  <p style={{ color: "red" }}>{formik.errors.title}</p>
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
                {formik.touched.description && formik.errors.description && (
                  <p style={{ color: "red" }}>{formik.errors.description}</p>
                )}
              </div>
              <div className="camp-text-input">
                Creative preview:
                <img
                  className="img-preview"
                  src={formik.values.img_preview}
                  alt="img-preview"
                />
                {formik.touched.img_preview && formik.errors.img_preview && (
                  <p style={{ color: "red" }}>{formik.errors.img_preview}</p>
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
                {formik.touched.final_url && formik.errors.final_url && (
                  <p style={{ color: "red" }}>{formik.errors.final_url}</p>
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
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
