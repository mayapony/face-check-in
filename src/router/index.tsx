import { createBrowserRouter } from "react-router-dom";
import { Root } from "../components/layouts/root";
import { Home } from "../pages/home";
import { Index } from "../pages/index/Index";
import { Login } from "../pages/login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
