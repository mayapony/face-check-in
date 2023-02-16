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
import "./sidebar.scss";

export const Sidebar = () => {
  return (
    <div className="sidebar w-60">
      <div className="top">
        <img
          className="w-3/4"
          src="https://see.fontimg.com/api/renderfont4/L3jyW/eyJyIjoiZnMiLCJoIjo5OCwidyI6MTUwMCwiZnMiOjY1LCJmZ2MiOiIjN0EyNEM3IiwiYmdjIjoiI0ZGRkZGRiIsInQiOjF9/RGFzaGJvYXJk/farmshed.png"
        />
      </div>
      <hr />
      <div className="center text-base">
        <ul>
          <SidebarTitle text="主要" />
          <li>
            <DashboardIcon className="icon" />
            <span>控制台</span>
          </li>
          <SidebarTitle text="LISTS" />
          <li>
            <PersonIcon className="icon" />
            <span>用户管理</span>
          </li>
          <li>
            <FilterFramesIcon className="icon" />
            <span>签到记录</span>
          </li>
          <SidebarTitle text="USEFUL" />
          <li>
            <LeaderboardIcon className="icon" />
            <span>统计信息</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>消息通知</span>
          </li>
          <SidebarTitle text="SERVICE" />
          <li>
            <NotesIcon className="icon" />
            <span>系统日志</span>
          </li>
          <li>
            <SettingsIcon className="icon" />
            <span>系统设置</span>
          </li>
          <SidebarTitle text="USER" />
          <li>
            <AccountBoxIcon className="icon" />
            <span>个人信息</span>
          </li>
          <li>
            <LogoutIcon className="icon" />
            <span>退出登陆</span>
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
