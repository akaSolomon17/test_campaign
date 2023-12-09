import "./SideBar.scss";
import {
  OPEN_ACCOUNT,
  OPEN_CAMPAIGN,
  OPEN_DASHBOARD,
} from "../../containers/menuContainer";
import React from "react";
import { TbCategory } from "react-icons/tb";
import { useSelector } from "react-redux";

const SideBar = (props) => {
  const { activeItem } = props;
  function clickChange(value) {
    props.clickSideBar(value);
  }
  let currentUser = useSelector((state) => state.auth?.currentUser);

  return (
    <div
      className={`${"side-bar"}
            ${props.show ? "" : "hidden"}`}
    >
      <div className="user-info">
        <div className="logo-user">
          <img alt="#" src={props.user?.avatar} />
        </div>
        <div className={"name-user"}>
          <p>
            {props
              ? props.user?.first_name + " " + props.user?.last_name
              : "Please sign in"}
          </p>
        </div>
      </div>
      <div
        className={
          activeItem === OPEN_DASHBOARD ? "highlight-item-side" : "item-side"
        }
        onClick={() => clickChange(OPEN_DASHBOARD)}
      >
        <TbCategory className="icon-side-bar" />
        Dashboard
      </div>
      <div
        className={
          activeItem === OPEN_CAMPAIGN ? "highlight-item-side" : "item-side"
        }
        onClick={() => clickChange(OPEN_CAMPAIGN)}
      >
        <TbCategory className="icon-side-bar" />
        Campaign
      </div>
      <div
        className={currentUser.role_id === "ADMIN" ? "" : "hide-tab-account"}
      >
        <div
          className={
            activeItem === OPEN_ACCOUNT ? "highlight-item-side" : "item-side"
          }
          onClick={() => clickChange(OPEN_ACCOUNT)}
        >
          <TbCategory className="icon-side-bar" />
          Account
        </div>
      </div>
    </div>
  );
};

export default SideBar;
