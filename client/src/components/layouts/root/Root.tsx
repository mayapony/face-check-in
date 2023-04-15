import { Outlet } from "react-router-dom";
import { Sidebar } from "../sidebar";

export const Root = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Outlet />
    </div>
  );
};
