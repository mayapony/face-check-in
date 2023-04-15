import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import "./widget.scss";

export const Widget = ({ type }: { type: string }) => {
  let data;
  const amount = Math.floor(1000 * Math.random());
  const percentage = (100 * Math.random()).toFixed(2);

  switch (type) {
    case "user":
      data = {
        title: "总人数",
        isMoney: false,
        link: "查看所有用户",
        icon: <PersonOutlineOutlinedIcon className="icon icon-user" />,
      };
      break;
    case "signed":
      data = {
        title: "已签到",
        isMoney: false,
        link: "查看已签到用户",
        icon: <ShoppingCartOutlinedIcon className="icon icon-order" />,
      };
      break;
    case "unsigned":
      data = {
        title: "未签到",
        isMoney: false,
        link: "查看未签到的用户",
        icon: <MonetizationOnOutlinedIcon className="icon icon-earning" />,
      };
      break;
    case "unregistered":
      data = {
        title: "未登记",
        isMoney: false,
        link: "查看未上传照片的用户",
        icon: (
          <AccountBalanceWalletOutlinedIcon className="icon icon-balance" />
        ),
      };
      break;
    default:
      throw new Error(`Widget props type error! your type is ${type}`);
  }

  return (
    <div className="widget">
      <div className="left">
        <div className="title">{data.title}</div>
        <div className="counter">
          {data.isMoney && "$"} {amount}
        </div>
        <div className="link">{data.link}</div>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {percentage}%
        </div>
        {/* {data.icon} */}
      </div>
    </div>
  );
};
