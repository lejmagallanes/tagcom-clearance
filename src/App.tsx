import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import Layout from "./components/Generic/Layout";

const App = () => {
  return (
    <Layout>
      <RouterProvider router={router} />
    </Layout>
  );
};

export default App;
