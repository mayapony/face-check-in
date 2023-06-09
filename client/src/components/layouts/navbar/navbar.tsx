import { localClear, localGet } from "@/utils";
import ChatIcon from "@mui/icons-material/Chat";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import LanguageIcon from "@mui/icons-material/Language";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Button,
  IconButton,
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import LogoutIcon from "@mui/icons-material/Logout";
import "./navbar.scss";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "@/global";

const AdminButtonGroup = () => {
  return (
    <>
      <div className="item">
        <LanguageIcon className="icon" />
      </div>
      <div className="item">
        <DarkModeIcon className="icon" />
      </div>
      <div className="item">
        <NotificationsIcon className="icon" />
        <div className="counter">1</div>
      </div>
      <div className="item">
        <ChatIcon className="icon" />
        <div className="counter">2</div>
      </div>
      <div className="item">
        <FullscreenIcon className="icon" />
      </div>
    </>
  );
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: "12px",
    border: "1px solid #dadde9",
  },
}));

export const Navbar = ({
  handleUpdateImage,
  handleUpdateInfo,
}: {
  handleUpdateImage?: () => void;
  handleUpdateInfo?: () => void;
}) => {
  const isAdmin = localGet("role") !== "0";
  const avatarSize = isAdmin ? 24 : 52;
  const navigate = useNavigate();

  const handleLogout = () => {
    localClear();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="wrapper">
        {!isAdmin ? (
          ""
        ) : (
          <div className="search">
            <input type="text" placeholder="Search" />
            <SearchIcon className="icon" />
          </div>
        )}
        <div className="items">
          {!isAdmin ? "" : <AdminButtonGroup />}
          <div className={isAdmin ? "item" : ""}>
            <HtmlTooltip
              arrow
              title={
                <div>
                  <Button onClick={handleUpdateInfo}>更新信息</Button>
                  <Button onClick={handleUpdateImage}>更新照片</Button>
                  <IconButton
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    <LogoutIcon color="primary" />
                  </IconButton>
                </div>
              }
            >
              <Avatar
                sx={{
                  width: avatarSize,
                  height: avatarSize,
                  bgcolor: blue[600],
                  fontSize: "18px",
                  textAlign: "center",
                }}
                className="hover:cursor-pointer"
                src={`${API_BASE}/${localGet("userID")}.png`}
              >
                {localGet("name")}
              </Avatar>
            </HtmlTooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
