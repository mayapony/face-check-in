import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./router";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { zhCN } from "@mui/material/locale";
import { zhCN as dateZhCN } from "@mui/x-date-pickers/locales";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import * as dayjs from "dayjs";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn"); // use locale

const theme = createTheme(
  {
    palette: {},
  },
  zhCN,
  dateZhCN
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
        <RouterProvider router={router} />
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
