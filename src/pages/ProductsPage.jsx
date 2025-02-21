import { useEffect, useState } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router-dom";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getProducts = async () => {
            setIsScreenLoading(true);
            try {
                const res = await axios.get(
                    `${baseUrl}/v2/api/${apiPath}/products`
                );
                setProducts(res.data.products);
            } catch (error) {
                showSwalError("取得產品失敗", error.response?.data?.message);
            } finally {
                setIsScreenLoading(false);
            }
        };
        getProducts();
    }, []);

    // 加入購物車
    const addToCart = async (product, qty = 1) => {
        setIsLoading(true);
        const productData = {
            data: {
                product_id: product.id,
                qty: Number(qty),
            },
        };
        try {
            await axios.post(`${baseUrl}/v2/api/${apiPath}/cart`, productData);
            showSwal("已加入購物車");
        } catch (error) {
            showSwalError("加入購物車失敗", error.response?.data?.message);
        } finally {
            setIsLoading(false);
        }
    };

    // sweetalert成功提示
    const showSwal = (text) => {
        withReactContent(Swal).fire({
            title: text,
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            width: "20%",
        });
    };

    // sweetalert錯誤提示
    const showSwalError = (text, error) => {
        withReactContent(Swal).fire({
            title: text,
            text: error,
            icon: "error",
        });
    };

    return (
        <>
            <div className="container">
                <div className="mt-4">
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th>圖片</th>
                                <th>商品名稱</th>
                                <th>價格</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td style={{ width: "200px" }}>
                                        <img
                                            className="img-fluid"
                                            src={product.imageUrl}
                                            alt={product.title}
                                        />
                                    </td>
                                    <td>{product.title}</td>
                                    <td>
                                        <del className="h6">
                                            原價 {product.origin_price} 元
                                        </del>
                                        <div className="h5">
                                            特價 {product.price}元
                                        </div>
                                    </td>
                                    <td>
                                        <div className="btn-group btn-group-sm">
                                            <Link
                                                to={`/products/${product.id}`}
                                                className="btn btn-outline-secondary"
                                            >
                                                查看更多
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn btn-primary d-flex align-items-center gap-2"
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                                disabled={isLoading}
                                            >
                                                加到購物車
                                                {isLoading && (
                                                    <ReactLoading
                                                        type={"spokes"}
                                                        color={"#000"}
                                                        height={"1rem"}
                                                        width={"1rem"}
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {isScreenLoading && (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(255,255,255,0.3)",
                            zIndex: 999,
                        }}
                    >
                        <ReactLoading
                            type="spokes"
                            color="gray"
                            width="4rem"
                            height="4rem"
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default ProductPage;
