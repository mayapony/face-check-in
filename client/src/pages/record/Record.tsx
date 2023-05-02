import { API_BASE } from "@/global";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useState, useEffect } from "react";
import { AddUserButton } from "../user/AddUserButton";

const columns: GridColDef[] = [{ field: "id", headerName: "ID", width: 70 }];

export const Record = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    retriveData();
  }, []);

  const retriveData = () => {
    axios.get(`${API_BASE}/records`).then((res) => {
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
