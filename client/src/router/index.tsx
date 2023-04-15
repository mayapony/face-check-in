import { createBrowserRouter } from "react-router-dom";
import { Root } from "../components/layouts/root";
import { Home } from "../pages/home";
import { Login } from "../pages/login";
import { Recognition } from "@/pages/recognition";
import { Upload } from "@/pages/upload";

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/recognition",
    element: <Recognition />,
  },
  {
    path: "/upload",
    element: <Upload />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default router;
