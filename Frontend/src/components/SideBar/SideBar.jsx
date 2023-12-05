import "./SideBar.scss";
import {
  OPEN_ACCOUNT,
  OPEN_CAMPAIGN,
  OPEN_DASHBOARD,
} from "../../containers/menuContainer";
import React from "react";
import { TbCategory } from "react-icons/tb";

const SideBar = (props) => {
  const { activeItem } = props;
  function clickChange(value) {
    props.clickSideBar(value);
  }

  return (
    <div
      className={`${"side-bar"} 
            ${props.show ? "" : "hidden"}`}
    >
      <div className="user-info">
        <div className="logo-user">
          <img alt="#" src={props.user.user?.avatar} />
        </div>
        <div className={"name-user"}>
          <p>
            {props.user
              ? props.user.user?.first_name + " " + props.user.user?.last_name
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
        className={
          activeItem === OPEN_ACCOUNT ? "highlight-item-side" : "item-side"
        }
        onClick={() => clickChange(OPEN_ACCOUNT)}
      >
        <TbCategory className="icon-side-bar" />
        Account
      </div>
    </div>
  );
};

export default SideBar;
