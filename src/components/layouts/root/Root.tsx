import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar";

export const Root = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};
