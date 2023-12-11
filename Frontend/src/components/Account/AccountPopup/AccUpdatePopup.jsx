import React from "react";
import { useDispatch } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import "./AccPopup.scss";
import useAxios from "../../../utils/useAxios";
import { updateAccountAction } from "../../../store/actions/accountAction";
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

const AccUpdatePopup = (props) => {
  const api = useAxios();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: props.record ? props.record.email : "",
      first_name: props.record ? props.record.first_name : "",
      last_name: props.record ? props.record.last_name : "",
      role_id: props.record ? props.record.role_id : "1",
      address: props.record ? props.record.address : "",
      phone: props.record ? props.record.phone : "",
      user_id: props.record ? props.record.user_id : "",
    },

    validationSchema: Yup.object({
      first_name: Yup.string().required("First name is required").max(40),
      last_name: Yup.string().required("Last name is required").max(40),
      role_id: Yup.string().required("Role is required"),
      address: Yup.string().required("Address is required").max(255),
      phone: Yup.string()
        .required("Phone number is required")
        .matches(/^\d+$/, "Phone must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(11, "Phone number must not exceed 11 digits"),
    }),
    onSubmit: async (values) => {
      const updateData = {
        user_id: values.user_id,
        first_name: values.first_name,
        last_name: values.last_name,
        role_id: values.role_id,
        address: values.address,
        phone: values.phone,
      };

      dispatch(
        updateAccountAction(
          updateData,
          {
            key_word: props.keyWord,
            page_number: props.pageNumber,
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
  return (
    <div className="acc-popup">
      <form onSubmit={formik.handleSubmit} className="acc-popup-inner">
        <div className="acc-title-pop">
          Edit Account
          <div className="underline"></div>
          <button className="acc-close-btn" onClick={props.onClose}>
            <AiOutlineClose className="dropped-icon" />
          </button>
        </div>
        <Accordion allowZeroExpanded preExpanded={["active"]}>
          <AccordionItem uuid="active">
            <AccordionItemHeading>
              <AccordionItemButton>Detail</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="detail-update">
                <div className="acc-text-input-update">
                  Email:
                  <input
                    readOnly={true}
                    value={formik.values.email}
                    type="text"
                    name="email"
                  />
                </div>
                <div className="acc-text-input-update">
                  First name:
                  <input
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    name="first_name"
                  />
                  {formik.errors.first_name && (
                    <p style={{ color: "red" }}>{formik.errors.first_name}</p>
                  )}
                </div>
                <div className="acc-text-input-update">
                  Last name:
                  <input
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                    onBlur={formik.handleBlur}
                    className="role-select"
                    name="role_id"
                  >
                    <option value="1">ADMIN</option>
                    <option value="2">DAC</option>
                    <option value="3">ADVERTISER</option>
                  </select>
                </div>
                <div className="acc-text-input-update">
                  Address:
                  <input
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    name="address"
                  />
                  {formik.errors.address && (
                    <p style={{ color: "red" }}>{formik.errors.address}</p>
                  )}
                </div>
                <div className="acc-text-input-update">
                  Phone:
                  <input
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    name="phone"
                  />
                  {formik.errors.phone && (
                    <p style={{ color: "red" }}>{formik.errors.phone}</p>
                  )}
                </div>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
        <div className="acc-footer-pop">
          <div className="underline"></div>
          <button className="cancel-btn" onClick={props.onClose}>
            Cancel
          </button>
          <button className="save-btn" onClick={formik.handleSubmit}>
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccUpdatePopup;
