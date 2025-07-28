import { BrowserRouter as BRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Private/Dashboard";
import PublicRoute from "./PublicRoute";
import Login from "../pages/Private/Public/Login";
import Home from "../pages/Private/Public/Home";

const Router = () => {
  return (
    <BRouter>
      <Routes>
        <Route path="/tagcom-clearance/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BRouter>
  );
};

export default Router;
