import FrontLayout from "../layouts/FrontLayout";
import Home from "../pages/HomePage";
import ProductPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailpage";
import Cart from "../pages/CartPage";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/LoginPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminProductPage from "../admin_pages/AdminProductPage";

const routes = [
    {
        path: "/",
        element: <FrontLayout />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "products",
                element: <ProductPage />,
            },
            {
                path: "products/:id",
                element: <ProductDetailPage />,
            },
            {
                path: "cart",
                element: <Cart />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "",
                element: <AdminProductPage />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
];

export default routes;
