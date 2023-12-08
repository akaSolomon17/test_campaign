import React from "react";
import { useSelector } from "react-redux";
import LoadingGif from "../../assest/loadingGif.gif";
import "./Loading.scss";
export default function Loading() {
  const isLoading = useSelector((state) => state.loading.isLoading);
  return (
    <div
      className={
        isLoading === true
          ? "loader-container"
          : "loader-container hide-loading"
      }
    >
      <div className="loader">
        <img src={LoadingGif} alt="loading..." />
      </div>
    </div>
  );
}
