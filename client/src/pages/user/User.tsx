import { API_BASE } from "@/global";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import axios from "axios";
import { axiosInstance as axios } from "@/utils";
import { useEffect, useState } from "react";
import { AddUserButton } from "./AddUserButton";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "姓名", width: 140 },
  {
    field: "phoneNumber",
    headerName: "手机号",
    width: 140,
  },
  {
    field: "isActive",
    headerName: "是否启用",
    width: 100,
    valueGetter: (params) => {
      if (params.row.isActive) return "是";
      else return "否";
    },
  },
  {
    field: "activity",
    headerName: "所选活动",
    width: 140,
    valueGetter: (params) => {
      const activity = params.row.activity;
      if (activity) return activity.name;
      else return "暂未选择活动";
    },
  },
];

export const User = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    retriveData();
  }, []);

  const retriveData = () => {
    axios.get(`${API_BASE}/users`).then((res) => {
      if (res.data) {
        setRows(res.data);
      }
    });
  };

  return (
    <div style={{ height: "80%", width: "100%" }} className="px-5">
      <AddUserButton />
      <DataGrid rows={rows} columns={columns} sx={{ padding: "0 10px" }} />
    </div>
  );
};
