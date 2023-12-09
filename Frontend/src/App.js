import React, { lazy, Suspense, useEffect } from "react";
import PrivateRoute from "./router/PrivateRoute";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import {
//   dispatchLogin,
//   fetchUser,
//   dispatchGetUser,
// } from "./redux/actions/authAction";

// import AccountServices from "./services/AccountServices";
import Loading from "./components/Loading/Loading";
import HomePage from "./views/HomePage/HomePage";
import LoginPage from "./views/LoginPage/LoginPage";

const LazyLoginPage = lazy(() => import("./views/LoginPage/LoginPage"));
const LazyHomePage = lazy(() => import("./views/HomePage/HomePage"));
// const LazyAccountPage = lazy(() => import("./components/"));

function App() {
  // const dispatch = useDispatch();
  // const token = useSelector((state) => state.token);
  // const auth = useSelector((state) => state.auth);

  // const { isLogged, isAdmin } = auth;
  // GET TOKEN into tokenReducer
  // const firstLogin = localStorage.getItem("firstLogin");
  // useEffect(() => {
  //   if (firstLogin) {
  //     const getToken = async () => {
  //       const res = await AccountServices.getAccessToken(null);
  //       dispatch({ type: "GET_TOKEN", payload: res.data });
  //     };
  //     getToken();
  //   }
  // }, [isLogged, dispatch]);

  return (
    // <BrowserRouter>
    //   <Suspense fallback={<div>Loading...</div>}>
    //     <Routes>
    //       {
    //         <Route
    //           path="/"
    //           element={firstLogin ? <LazyHomePage /> : <Navigate to="/login" />}
    //         />
    //       }
    //       {
    //         <Route
    //           path="/login"
    //           element={firstLogin ? <Navigate to="/" /> : <LazyLoginPage />}
    //         />
    //       }
    //     </Routes>
    //   </Suspense>
    // </BrowserRouter>
    <>
      <div className="App">
        <Loading />
        <Routes>
          <Route exact path="/" element={<PrivateRoute />}>
            <Route exact path="/" element={<HomePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
