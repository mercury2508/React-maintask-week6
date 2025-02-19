// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import routes from "./routes";

import { createHashRouter, RouterProvider } from "react-router-dom";
const router = createHashRouter(routes);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  // <App />
  // </StrictMode>,
  <RouterProvider router={router}>

  </RouterProvider>
);
