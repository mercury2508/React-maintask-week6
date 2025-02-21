import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function Cart() {
    const [isScreenLoading, setIsScreenLoading] = useState(false);
    const [cartItem, setCartItem] = useState({});

    useEffect(() => {
        getCartList();
    }, []);

    //取得購物車內容
    const getCartList = async () => {
        try {
            const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/cart`);
            setCartItem(res.data.data);
        } catch (error) {
            showSwalError("取得購物車失敗", error.response?.data?.message);
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

    // 表單驗證
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onTouched",
    });

    // 表單資料
    const onSubmit = handleSubmit((data) => {
        const { message, ...user } = data;
        const submitData = {
            data: {
                user,
                message,
            },
        };
        checkout(submitData);
    });

    // 客戶購物結帳
    const checkout = async (submitData) => {
        setIsScreenLoading(true);
        try {
            await axios.post(`${baseUrl}/v2/api/${apiPath}/order`, submitData);
            getCartList();
            reset();
            showSwal("已送出訂單!");
        } catch (error) {
            showSwalError("送出訂單失敗", error.response?.data?.message);
        } finally {
            setIsScreenLoading(false);
        }
    };

    // 調整商品數量
    const updateCartItem = async (cart_id, item_id, qty) => {
        const itemData = {
            data: {
                product_id: item_id,
                qty: Number(qty),
            },
        };
        setIsScreenLoading(true);
        try {
            await axios.put(
                `${baseUrl}/v2/api/${apiPath}/cart/${cart_id}`,
                itemData
            );
            getCartList();
        } catch (error) {
            showSwalError("調整商品數量失敗", error.response?.data?.message);
        } finally {
            setIsScreenLoading(false);
        }
    };

    // 清空購物車
    const deleteCarts = async () => {
        setIsScreenLoading(true);
        try {
            await axios.delete(`${baseUrl}/v2/api/${apiPath}/carts`);
            getCartList();
        } catch (error) {
            showSwalError("清空購物車失敗", error.response?.data?.message);
        } finally {
            setIsScreenLoading(false);
        }
    };

    // 刪除購物車單一物品
    const deleteCartItem = async (id) => {
        setIsScreenLoading(true);
        try {
            await axios.delete(`${baseUrl}/v2/api/${apiPath}/cart/${id}`);
            getCartList();
        } catch (error) {
            showSwalError("刪除購物車商品失敗", error.response?.data?.message);
        } finally {
            setIsScreenLoading(false);
        }
    };

    return (
        <>
            <div className="container">
                <div className="text-end py-3">
                    <button
                        className="btn btn-outline-danger"
                        type="button"
                        onClick={deleteCarts}
                        disabled={!cartItem.carts?.length}
                    >
                        清空購物車
                    </button>
                </div>
                {cartItem.carts?.length > 0 ? (
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th></th>
                                <th>品名</th>
                                <th style={{ width: "150px" }}>數量/單位</th>
                                <th className="text-end">單價</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItem.carts?.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() =>
                                                deleteCartItem(item.id)
                                            }
                                        >
                                            刪除
                                        </button>
                                    </td>
                                    <td>{item.product.title}</td>
                                    <td style={{ width: "150px" }}>
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="btn-group me-2"
                                                role="group"
                                            >
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() =>
                                                        updateCartItem(
                                                            item.id,
                                                            item.product_id,
                                                            item.qty - 1
                                                        )
                                                    }
                                                    disabled={item.qty === 1}
                                                >
                                                    -
                                                </button>
                                                <span
                                                    className="btn border border-dark"
                                                    style={{
                                                        width: "50px",
                                                        cursor: "auto",
                                                    }}
                                                >
                                                    {item.qty}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-dark btn-sm"
                                                    onClick={() =>
                                                        updateCartItem(
                                                            item.id,
                                                            item.product_id,
                                                            item.qty + 1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="input-group-text bg-transparent border-0">
                                                {item.product.unit}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-end">
                                        {item.final_total}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="text-end">
                                    總計：
                                </td>
                                <td
                                    className="text-end"
                                    style={{ width: "130px" }}
                                >
                                    {cartItem.total}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <div className="text-center mt-3">購物車目前是空的</div>
                )}

                <div className="my-5 row justify-content-center">
                    <form className="col-md-6" action="" onSubmit={onSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                placeholder="請輸入 Email"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Email為必填",
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Email格式錯誤",
                                    },
                                })}
                            />
                            {errors.email && (
                                <div className="invalid-feedback">
                                    {errors.email.message}
                                </div>
                            )}
                            <p className="text-danger my-2"></p>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                收件人姓名
                            </label>
                            <input
                                id="name"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                placeholder="請輸入姓名"
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: "姓名為必填",
                                    },
                                })}
                            />
                            {errors.name && (
                                <div className="invalid-feedback">
                                    {errors.name.message}
                                </div>
                            )}
                            <p className="text-danger my-2"></p>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="tel" className="form-label">
                                收件人電話
                            </label>
                            <input
                                id="tel"
                                type="tel"
                                className={`form-control ${errors.tel ? "is-invalid" : ""}`}
                                placeholder="請輸入電話"
                                {...register("tel", {
                                    required: {
                                        value: true,
                                        message: "電話為必填",
                                    },
                                    pattern: {
                                        value: /^(0[2-8]\d{7}|09\d{8})$/,
                                        message: "電話格式不正確",
                                    },
                                })}
                            />
                            {errors.tel && (
                                <div className="invalid-feedback">
                                    {errors.tel.message}
                                </div>
                            )}
                            <p className="text-danger my-2"></p>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                收件人地址
                            </label>
                            <input
                                id="address"
                                type="text"
                                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                placeholder="請輸入地址"
                                {...register("address", {
                                    required: {
                                        value: true,
                                        message: "地址為必填",
                                    },
                                })}
                            />
                            {errors.address && (
                                <div className="invalid-feedback">
                                    {errors.address.message}
                                </div>
                            )}
                            <p className="text-danger my-2"></p>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">
                                留言
                            </label>
                            <textarea
                                id="message"
                                className="form-control"
                                cols="30"
                                rows="10"
                                {...register("message")}
                            ></textarea>
                        </div>
                        <div className="text-end">
                            <button
                                type="submit"
                                className="btn btn-danger"
                                disabled={!cartItem.carts?.length}
                            >
                                送出訂單
                            </button>
                        </div>
                    </form>
                </div>
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
        </>
    );
}

export default Cart;
