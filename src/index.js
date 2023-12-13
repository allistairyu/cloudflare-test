import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";
import OrgChart from "./components/OrgChart";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="orgchart">Org Chart</Link>
      </div>
    ),
  },
  {
    path: "orgchart",
    element: <OrgChart />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);