import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NotFound from "./pages/NotFound";
import VerifyAuth from "./pages/VerifyAuth";

const router = createBrowserRouter([
  {
    path: "/company/:company_id/",
    element: <App />,
  },
  {
    path: "/company/",
    element: <VerifyAuth />,
  },
  {
    path: "/company/:company_id/application/:application_id",
    element: <App />,
  },
  {
    path: "/",
    element: <>
    <div>
      its working, Please move to another working route.
    </div>
    </>,
  },
  {
    path: "/test-page",
    element: (
      <>
        <div>Hurrrey Its wokring</div>
      </>
    ),
  },
  {
    path: "/*", // Fallback route for all unmatched paths
    element: <NotFound />, // Component to render for unmatched paths
  },
]);

export default router;
