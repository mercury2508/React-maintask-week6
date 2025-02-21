import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ReactLoading from "react-loading";
const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function ProductDetailPage() {
    const params = useParams();
    const { id } = params;
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState({});
    const [qtySelect, setQtySelect] = useState(1);

    useEffect(() => {
        (async () => {
            setIsScreenLoading(true);
            try {
                const res = await axios.get(
                    `${baseUrl}/v2/api/${apiPath}/product/${id}`
                );
                // console.log(res.data.product);
                setProduct(res.data.product);
            } catch (error) {
                showSwalError("取得產品失敗", error.response?.data?.message);
            } finally {
                setIsScreenLoading(false);
            }
        })();
    }, []);

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

    return (
        <>
            {isScreenLoading ? (
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
            ) : (
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-6">
                            <img
                                className="img-fluid"
                                src={product.imageUrl}
                                alt={product.title}
                            />
                        </div>
                        <div className="col-6">
                            <div className="d-flex align-items-center gap-2">
                                <h2>{product.title}</h2>
                                <span className="badge text-bg-success">
                                    {product.category}
                                </span>
                            </div>
                            <p className="mb-3">{product.description}</p>
                            <p className="mb-3">{product.content}</p>
                            <h5 className="mb-3">NT$ {product.price}</h5>
                            <div className="input-group align-items-center w-75">
                                <select
                                    value={qtySelect}
                                    onChange={(e) =>
                                        setQtySelect(e.target.value)
                                    }
                                    id="qtySelect"
                                    className="form-select"
                                >
                                    {Array.from({ length: 10 }).map(
                                        (_, index) => (
                                            <option
                                                key={index}
                                                value={index + 1}
                                            >
                                                {index + 1}
                                            </option>
                                        )
                                    )}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                    onClick={() =>
                                        addToCart(product, qtySelect)
                                    }
                                    disabled={isLoading}
                                >
                                    加入購物車
                                    {isLoading && (
                                        <ReactLoading
                                            type={"spokes"}
                                            color={"gray"}
                                            height={"1.5rem"}
                                            width={"1.5rem"}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProductDetailPage;
