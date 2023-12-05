import { React, useState } from "react";
import NavBar from "../../components/Navbar/Navbar";
import Banner from "../../components/Banner/Banner";
import SideBar from "../../components/SideBar/SideBar";
import "./HomePage.scss";
import {
  OPEN_ACCOUNT,
  OPEN_CAMPAIGN,
  OPEN_DASHBOARD,
} from "../../containers/menuContainer";
import Account from "../../components/Account/Account";
import Campaign from "../../components/Campaign/Campaign";
import Dashboard from "../../components/Dashboard/Dashboard";

import { useSelector } from "react-redux";
const HomePage = () => {
  const [openMenu, setOpenMenu] = useState(OPEN_DASHBOARD);
  const [isOpenSideBar, setIsOpenSideBar] = useState(true);
  const currentUser = useSelector((state) => state.auth?.user);

  function openSideBar() {
    return setIsOpenSideBar(!isOpenSideBar);
  }

  function clickSideBar(changeValue) {
    return setOpenMenu(changeValue);
  }

  return (
    <div className="home-page">
      <Banner />
      <NavBar
        user={currentUser ? currentUser : null}
        openSideBar={openSideBar}
      />
      <div className="main-page">
        <SideBar
          user={currentUser ? currentUser : null}
          show={isOpenSideBar}
          clickSideBar={clickSideBar}
          activeItem={openMenu}
        />
        {openMenu === OPEN_ACCOUNT && <Account />}
        {openMenu === OPEN_CAMPAIGN && <Campaign />}
        {openMenu === OPEN_DASHBOARD && <Dashboard />}
      </div>
    </div>
  );
};

export default HomePage;
