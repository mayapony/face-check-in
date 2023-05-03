import { API_BASE } from "@/global";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { AddUserButton } from "../user/AddUserButton";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "用户名",
    width: 140,
    valueGetter: (params) => {
      return params.row.user.name;
    },
  },
  {
    field: "activity",
    headerName: "活动名称",
    width: 140,
    valueGetter: (params) => {
      return params.row.activity.name;
    },
  },
  {
    field: "createDate",
    headerName: "签到时间",
    width: 200,
    valueGetter: (params) => {
      const date = new Date(params.row.createDate);
      return date.toLocaleString();
    },
  },
];

export const Record = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    retriveData();
  }, []);

  const retriveData = () => {
    axios.get(`${API_BASE}/records`).then((res) => {
      if (res.data) {
        console.log(res.data);
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
