import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useAxios from "../../../utils/useAxios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineDown, AiOutlineClose } from "react-icons/ai";
import "./AccPopup.scss";
import { createAccountAction } from "../../../store/actions/accountAction";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

const AccPopup = (props) => {
  const api = useAxios();
  const dispatch = useDispatch();
  // const [isDropDetail, setDropDetail] = useState(true);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role_id: "",
      address: "",
      phone: "",
      confirm_password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email is required")
        .email("Please enter a valid email"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(120, "Password must not exceed 11 characters"),
      first_name: Yup.string()
        .required("First name is required")
        .matches(/^[A-Za-z ]*$/, "Please enter valid first name")
        .max(40, "First name maximum is 40 characters"),
      last_name: Yup.string()
        .required("Last name is required")
        .matches(/^[A-Za-z ]*$/, "Please enter valid last name")
        .max(40, "Last name maximum is 40 characters"),
      address: Yup.string()
        .required("Address is required")
        .typeError("Your address must be a string")
        .max(255, "Exceed the number of characters"),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^\d+$/, "Phone must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(11, "Phone number must not exceed 11 digits"),
      confirm_password: Yup.string()
        .required("Confirm Password is required")
        .min(6, "Confirm password must be at least 6 characters")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),

    onSubmit: async (values) => {
      if (values.role_id === "") {
        values.role_id = "1";
      }
      const formData = {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        role_id: values.role_id,
        address: values.address,
        phone: values.phone,
      };

      dispatch(
        createAccountAction(
          formData,
          { key_word: props.keyWord, page_number: props.pageNumber },
          api
        )
      );

      formik.resetForm();
      closePopup();
    },
  });

  const closePopup = () => {
    props.changePopup();
  };
  return (
    <div className="acc-popup">
      <form onSubmit={formik.handleSubmit} className="acc-popup-inner">
        <div className="acc-title-pop">
          Create Account
          <div className="underline"></div>
          <button className="acc-close-btn" onClick={closePopup}>
            <AiOutlineClose className="dropped-icon" />
          </button>
        </div>
        {/* <div className="acc-title" onClick={changeDetailDrop}>
          Detail
          <AiOutlineDown className="drop-btn" />
        </div> */}
        <Accordion allowZeroExpanded preExpanded={["active"]}>
          <AccordionItem uuid="active">
            <AccordionItemHeading>
              <AccordionItemButton>Detail</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="detail">
                <div className="acc-text-input">
                  Email:
                  <input
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    type="text"
                    name="email"
                  />
                  {formik.errors.email && (
                    <p style={{ color: "red" }}>{formik.errors.email}</p>
                  )}
                </div>
                <div className="acc-text-input">
                  First name:
                  <input
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    type="text"
                    name="first_name"
                  />
                  {formik.errors.first_name && (
                    <p style={{ color: "red" }}>{formik.errors.first_name}</p>
                  )}
                </div>
                <div className="acc-text-input">
                  Last name:
                  <input
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    type="text"
                    name="last_name"
                  />
                  {formik.errors.last_name && (
                    <p style={{ color: "red" }}>{formik.errors.last_name}</p>
                  )}
                </div>
                <div className="role-acc">
                  Role:
                  <select
                    value={formik.values.role_id ? formik.values.role_id : "1"}
                    onChange={formik.handleChange}
                    className="role-select"
                    name="role_id"
                  >
                    <option value="1">ADMIN</option>
                    <option value="2">DAC</option>
                    <option value="3">ADVERTISER</option>
                  </select>
                </div>
                <div className="acc-text-input">
                  Address:
                  <input
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    type="text"
                    name="address"
                  />
                  {formik.errors.address && (
                    <p style={{ color: "red" }}>{formik.errors.address}</p>
                  )}
                </div>
                <div className="acc-text-input">
                  Phone:
                  <input
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    type="text"
                    name="phone"
                  />
                  {formik.errors.phone && (
                    <p style={{ color: "red" }}>{formik.errors.phone}</p>
                  )}
                </div>
                <div className="acc-text-input">
                  Password:
                  <input
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    type="password"
                    name="password"
                  />
                  {formik.errors.password && (
                    <p style={{ color: "red" }}>{formik.errors.password}</p>
                  )}
                </div>
                <div className="acc-text-input">
                  Confirm password:
                  <input
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    type="password"
                    name="confirm_password"
                  />
                  {formik.errors.confirm_password && (
                    <p style={{ color: "red" }}>
                      {formik.errors.confirm_password}
                    </p>
                  )}
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>

        <div className="acc-footer-pop">
          <div className="underline"></div>
          <button className="cancel-btn" onClick={closePopup}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccPopup;
