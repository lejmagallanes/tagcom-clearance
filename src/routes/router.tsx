import DefaultLayout from "../pages/Private/DefaultLayout";
import Home from "../pages/Private/Home";
import { Navigate, createBrowserRouter } from "react-router-dom";
import ForbiddenPage from "../pages/Public/ForbiddenPage";
import Login from "../pages/Public/Login";
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: <ForbiddenPage />,
  },
  {
    path: "*",
    element: <Navigate to="/unauthorized" replace />,
  },
]);

export default router;
