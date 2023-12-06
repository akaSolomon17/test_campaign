import { useSelector } from "react-redux";
import { Route, Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = useSelector((state) => state.auth?.currentUser);

  return user ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoute;
