import { Outlet, Navigate } from "react-router-dom";
import { RouteNames } from "./router";

function PrivatePath() {
  const username: string | null = localStorage.getItem("username");
  return username !== null ? <Outlet /> : <Navigate to={RouteNames.LOGIN} />;
}

export default PrivatePath;
