import FrontLayout from "../layouts/FrontLayout";
import Home from "../pages/Home";
import ProductPage from "../pages/ProductsPage";
import ProductDetailPage from "../pages/ProductDetailpage";
import Cart from "../pages/CartPage";

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
            }
        ]
    }
]

export default routes;