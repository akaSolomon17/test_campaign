import React, { lazy, Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import {
  dispatchLogin,
  fetchUser,
  dispatchGetUser,
} from "./redux/actions/authAction";

import AccountServices from "./services/AccountServices";
import Loading from "./utils/Loading/Loading";

const LazyLoginPage = lazy(() => import("./views/LoginPage/LoginPage"));
const LazyHomePage = lazy(() => import("./views/HomePage/HomePage"));
// const LazyAccountPage = lazy(() => import("./components/"));

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const auth = useSelector((state) => state.auth);

  const { isLogged, isAdmin } = auth;
  // GET TOKEN into tokenReducer
  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      const getToken = async () => {
        const res = await AccountServices.getAccessToken(null);
        dispatch({ type: "GET_TOKEN", payload: res.data });
      };
      getToken();
    }
  }, [isLogged, dispatch]);

  useEffect(() => {
    if (token) {
      const getUser = () => {
        dispatch(dispatchLogin());
        return fetchUser(token).then((res) => {
          dispatch(dispatchGetUser(res));
        });
      };
      getUser();
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Loading />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {
            <Route
              path="/"
              element={isLogged ? <LazyHomePage /> : <Navigate to="/login" />}
            />
          }
          {
            <Route
              path="/login"
              element={isLogged ? <Navigate to="/" /> : <LazyLoginPage />}
            />
          }
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
