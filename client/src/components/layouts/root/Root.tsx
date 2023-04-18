import { Outlet } from "react-router-dom";
import { Navbar } from "../navbar/navbar";
import { Sidebar } from "../sidebar";

export const Root = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};
