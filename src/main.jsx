import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import routes from "./routes";

import { createHashRouter, RouterProvider } from "react-router-dom";
const router = createHashRouter(routes);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router}></RouterProvider>
);
