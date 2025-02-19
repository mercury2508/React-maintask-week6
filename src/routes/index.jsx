import FrontLayout from "../layouts/FrontLayout";
import Home from "../pages/HomePage";
import ProductPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailpage";
import Cart from "../pages/CartPage";
import NotFound from "../pages/NotFound";

const routes = [
    {
        path: "/",
        element: <FrontLayout/>,
        children: [
            {
                path: "",
                element: <Home/>
            },
            {
                path: "products",
                element: <ProductPage/>
            },
            {
                
                path: "products/:id",
                element: <ProductDetailPage/>
                
            },
            {
                path: "cart",
                element: <Cart/>
            },
            {
                path: "*",
                element: <NotFound/>
            }
        ]
    }
]

export default routes;