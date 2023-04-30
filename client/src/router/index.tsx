import { createBrowserRouter } from "react-router-dom";
import { Root } from "../components/layouts/root";
import { Home } from "../pages/home";
import { Login } from "../pages/login";
import { Upload } from "@/pages/upload";
import { Recognition } from "@/pages/recognition";
import { Activity } from "@/pages/activity";
import { User } from "@/pages/user/User";

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/activity",
        element: <Activity />,
      },
      {
        path: "/user",
        element: <User />,
      },
    ],
  },
  {
    path: "/upload",
    element: <Upload />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/recognition",
    element: <Recognition />,
  },
]);

export default router;
