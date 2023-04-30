import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FilterFramesIcon from "@mui/icons-material/FilterFrames";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import LogoutIcon from "@mui/icons-material/Logout";
import NotesIcon from "@mui/icons-material/Notes";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import SidebarTitle from "./components/SidebarTitle";
import EditCalendarIcon from "@mui/icons-material/CalendarViewMonth";
import "./sidebar.scss";
import { Link, useNavigate } from "react-router-dom";
import { checkUser, localClear } from "@/utils";
import { useEffect } from "react";

export const Sidebar = () => {
  const nav = useNavigate();

  useEffect(() => {
    checkUser("1", nav);
  }, []);

  return (
    <div className="sidebar w-60">
      <div className="top">
        <h1 className="text-xl font-bold text-blue-500">签到系统后台</h1>
      </div>
      <hr />
      <div className="center text-base">
        <ul>
          <SidebarTitle text="主要" />
          <Link to="/home">
            <li>
              <DashboardIcon className="icon" />
              <span>控制台</span>
            </li>
          </Link>
          <SidebarTitle text="列表" />
          <Link to="user">
            <li>
              <PersonIcon className="icon" />
              <span>用户管理</span>
            </li>
          </Link>
          <Link to="/activity">
            <li>
              <EditCalendarIcon className="icon" />
              <span>活动管理</span>
            </li>
          </Link>
          <li>
            <FilterFramesIcon className="icon" />
            <span>签到记录</span>
          </li>
          <SidebarTitle text="工具" />
          <li>
            <LeaderboardIcon className="icon" />
            <span>统计信息</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>消息通知</span>
          </li>
          <SidebarTitle text="服务" />
          <li>
            <NotesIcon className="icon" />
            <span>系统日志</span>
          </li>
          <li>
            <SettingsIcon className="icon" />
            <span>系统设置</span>
          </li>
          <SidebarTitle text="用户" />
          <li>
            <AccountBoxIcon className="icon" />
            <span>个人信息</span>
          </li>
          <li>
            <LogoutIcon className="icon" />
            <span
              onClick={() => {
                localClear();
                nav("/login");
              }}
            >
              退出登陆
            </span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div className="colorOption h-4 w-4 bg-white"></div>
        <div className="colorOption h-4 w-4 bg-blue-800"></div>
        <div className="colorOption h-4 w-4 bg-black"></div>
      </div>
    </div>
  );
};
