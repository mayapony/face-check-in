import {
  Avatar,
  AvatarGroup,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SyntheticEvent, useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
import { API_BASE } from "@/global";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { zhCN } from "date-fns/locale";
import dayjs from "dayjs";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("zhCN", zhCN);

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "活动名称", width: 200 },
  { field: "address", headerName: "活动地点", width: 200 },
  {
    field: "time",
    headerName: "举行时间",
    width: 200,
    valueGetter: (params) => {
      const date = new Date(params.row.time);
      return date.toLocaleString();
    },
  },
  { field: "password", headerName: "密码", width: 130 },
  {
    field: "users",
    headerName: "参加用户",
    width: 200,
    renderCell: (params) => {
      const users = params.row.users;
      console.log(users);
      return (
        <>
          <AvatarGroup
            // source from: https://stackoverflow.com/questions/70020398/changing-the-size-of-the-overflow-avatar-to-match-other-avatars-in-avatargroup
            sx={{
              "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 15 },
            }}
            max={3}
          >
            {users.length > 0 ? (
              users.map((user: any) => (
                <Avatar key={user.id} sx={{ width: 24, height: 24 }}>
                  {user.name}
                </Avatar>
              ))
            ) : (
              <>
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  src="https://mui.com/static/images/avatar/1.jpg"
                />
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  src="https://mui.com/static/images/avatar/2.jpg"
                />
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  src="https://mui.com/static/images/avatar/3.jpg"
                />
              </>
            )}

            <Avatar
              sx={{ width: 24, height: 24 }}
              src="https://mui.com/static/images/avatar/1.jpg"
            />
            <Avatar
              sx={{ width: 24, height: 24 }}
              src="https://mui.com/static/images/avatar/2.jpg"
            />
            <Avatar
              sx={{ width: 24, height: 24 }}
              src="https://mui.com/static/images/avatar/3.jpg"
            />
          </AvatarGroup>
        </>
      );
    },
  },
];

export const Activity = () => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs(new Date()));
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [rows, setRows] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    retriveData();
  }, []);

  const retriveData = () => {
    axios.get(`${API_BASE}/activitys`).then((res) => {
      if (res.data) {
        console.log(res.data);
        setRows(res.data);
      }
    });
  };

  const handleSubmitActivity = (event: SyntheticEvent) => {
    event.preventDefault();
    const postData = {
      name,
      address,
      password,
      time: startDate,
    };
    console.log(postData);
    axios.post(`${API_BASE}/activitys`, postData).then((res) => {
      if (res.data) {
        console.log(res.data);
        retriveData();
        setOpen(false);
      }
    });
  };

  return (
    <div style={{ height: "80%", width: "100%" }} className="px-5">
      <div className="my-1 flex w-full flex-row-reverse border border-gray-200 p-2">
        <Button variant="contained" size="small" onClick={handleClickOpen}>
          添加
        </Button>
      </div>
      <DataGrid rows={rows} columns={columns} sx={{ padding: "0 10px" }} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>添加活动</DialogTitle>
        <DialogContent sx={{ maxWidth: "400px" }}>
          <form className="w-full" onSubmit={handleSubmitActivity}>
            <TextField
              autoFocus
              margin="dense"
              label="活动名称"
              name="name"
              fullWidth
              required
              onChange={(event) => {
                setName(event.target.value);
              }}
              variant="outlined"
            />
            <TextField
              autoFocus
              margin="dense"
              name="address"
              label="活动地点"
              fullWidth
              required
              onChange={(event) => {
                setAddress(event.target.value);
              }}
              variant="outlined"
            />
            <TextField
              autoFocus
              margin="dense"
              label="参加密码"
              type="password"
              fullWidth
              required
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              variant="outlined"
            />
            <DatePicker
              className="w-full"
              sx={{ mt: "5px" }}
              value={startDate}
              onChange={(newValue) =>
                setStartDate(newValue ? newValue : dayjs(new Date()))
              }
            />
            <div className="mt-2 flex w-full flex-row-reverse">
              <Button
                type="submit"
                variant="contained"
                sx={{ marginLeft: "10px" }}
              >
                提交
              </Button>
              <Button onClick={handleClose} variant="contained">
                取消
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
