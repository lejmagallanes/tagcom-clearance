import DefaultLayout from "../pages/Private/DefaultLayout";
import Home from "../pages/Private/Home";

// const Router = () => {
//   return (
//     <BRouter>
//       <Routes>
//         <Route path={"/tagcom-clearance/"} element={<Home />} />
//         <Route
//           path="/login"
//           element={
//             <PublicRoute>
//               <Login />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </BRouter>
//   );
// };

// export default Router;

import { Navigate, createBrowserRouter } from "react-router-dom";
import ForbiddenPage from "../pages/Public/ForbiddenPage";
import Login from "../pages/Public/Login";
const router = createBrowserRouter([
  {
    path: "/",
    // element: <DefaultLayout />,
    element: <DefaultLayout />,
    children: [
      {
        index: true, // 👈 This matches path: "/"
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
