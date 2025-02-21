import PropTypes from "prop-types";
import axios from "axios";
import { Modal } from "bootstrap";
import { useEffect, useRef, useState } from "react";

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function ProductModal({
    isProductModalOpen,
    setIsProductModalOpen,
    modalState,
    tempProduct,
    getProducts,
    pageInfo,
}) {
    // 新增編輯產品modal 渲染後才能取得DOM
    const productModalRef = useRef(null);
    const modalRef = useRef(null);
    useEffect(() => {
        modalRef.current = new Modal(productModalRef.current, {
            backdrop: false,
        });
    }, []);

    // 控制產品modal開關
    useEffect(() => {
        if (isProductModalOpen) {
            modalRef.current.show();
        }
    }, [isProductModalOpen]);

    // 關閉modal
    const closeModal = () => {
        modalRef.current.hide();
        setIsProductModalOpen(false);
    };

    // 產品資料狀態
    const [modalData, setModalData] = useState(tempProduct);

    useEffect(() => {
        setModalData({
            ...tempProduct,
        });
    }, [tempProduct]);

    // 撰寫產品modal (需確認name的type是否為checkbox)
    const handleProductContent = (e) => {
        const { name, value, checked, type } = e.target;
        setModalData({
            ...modalData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // 調整副圖
    const handleImageChange = (e, index) => {
        const { value } = e.target;
        const newImages = [...modalData.imagesUrl];
        newImages[index] = value;
        setModalData({
            ...modalData,
            imagesUrl: newImages,
        });
    };

    // 新增附圖button
    const handleAddImages = () => {
        const newImages = [...modalData.imagesUrl];
        newImages.push("");
        setModalData({
            ...modalData,
            imagesUrl: newImages,
        });
    };

    //刪除副圖button
    const handleRemoveImages = () => {
        const newImages = [...modalData.imagesUrl];
        newImages.pop();
        setModalData({
            ...modalData,
            imagesUrl: newImages,
        });
    };

    // 新增產品
    const addNewProduct = async () => {
        try {
            const productData = {
                data: {
                    ...modalData,
                    origin_price: Number(modalData.origin_price),
                    price: Number(modalData.price),
                    is_enabled: modalData.is_enabled ? 1 : 0,
                },
            };
            await axios.post(
                `${baseUrl}/api/${apiPath}/admin/product`,
                productData
            );
            alert("新增產品成功");
            setModalData({ ...tempProduct });
            closeModal();
        } catch (error) {
            alert(`欄位尚未填寫:${error.response.data.message}`);
        }
    };

    // 編輯產品
    const adjustProduct = async () => {
        try {
            const productData = {
                data: {
                    ...modalData,
                    origin_price: Number(modalData.origin_price),
                    price: Number(modalData.price),
                    is_enabled: modalData.is_enabled ? 1 : 0,
                },
            };
            await axios.put(
                `${baseUrl}/api/${apiPath}/admin/product/${modalData.id}`,
                productData
            );
            alert("已編輯產品");
            closeModal();
        } catch (error) {
            alert(`產品編輯失敗:${error}`);
        }
    };

    // 送出新增產品
    // 使用modalState狀態判斷該送出新增or編輯HTTP請求
    const handleUpdateProduct = async () => {
        const apiCall = modalState === "add" ? addNewProduct : adjustProduct;
        try {
            await apiCall();
            setIsProductModalOpen(false);
            getProducts(pageInfo.current_page);
        } catch (error) {
            alert(error);
        }
    };

    // 圖片上傳
    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file-to-upload", file);
        try {
            const res = await axios.post(
                `${baseUrl}/api/${apiPath}/admin/upload`,
                formData
            );
            const uploadedUrl = res.data.imageUrl;
            setModalData({
                ...modalData,
                imageUrl: uploadedUrl,
            });
        } catch (error) {
            alert(`圖片上傳失敗:${error}`);
        }
    };

    return (
        <>
            <div
                ref={productModalRef}
                id="productModal"
                className="modal"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header border-bottom">
                            <h5 className="modal-title fs-4">
                                {modalState === "add" ? "新增產品" : "編輯產品"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body p-4">
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="fileInput"
                                            className="form-label"
                                        >
                                            {" "}
                                            圖片上傳{" "}
                                        </label>
                                        <input
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            className="form-control"
                                            id="fileInput"
                                            onChange={handleUploadImage}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="primary-image"
                                            className="form-label"
                                        >
                                            主圖
                                        </label>
                                        <div className="input-group">
                                            <input
                                                name="imageUrl"
                                                type="text"
                                                id="primary-image"
                                                className="form-control"
                                                placeholder="請輸入圖片連結"
                                                value={modalData.imageUrl}
                                                onChange={handleProductContent}
                                            />
                                        </div>
                                        <img
                                            src={modalData.imageUrl}
                                            alt={modalData.title}
                                            className="img-fluid"
                                        />
                                    </div>

                                    <div className="border border-2 border-dashed rounded-3 p-2">
                                        {modalData.imagesUrl?.map(
                                            (image, index) => (
                                                <div
                                                    key={index}
                                                    className="mb-2"
                                                >
                                                    <label
                                                        htmlFor={`imagesUrl-${index + 1}`}
                                                        className="form-label"
                                                    >
                                                        副圖 {index + 1}
                                                    </label>
                                                    <input
                                                        id={`imagesUrl-${index + 1}`}
                                                        type="text"
                                                        placeholder={`圖片網址 ${index + 1}`}
                                                        className="form-control mb-2"
                                                        value={image}
                                                        onChange={(e) =>
                                                            handleImageChange(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                    {image && (
                                                        <img
                                                            src={image}
                                                            alt={`副圖 ${index + 1}`}
                                                            className="img-fluid mb-2"
                                                        />
                                                    )}
                                                </div>
                                            )
                                        )}
                                        <div className="btn-group w-100">
                                            {modalData.imagesUrl.length < 5 &&
                                                modalData.imagesUrl[
                                                    modalData.imagesUrl.length -
                                                        1
                                                ] !== "" && (
                                                    <button
                                                        className="btn btn-outline-primary btn-sm w-100"
                                                        onClick={
                                                            handleAddImages
                                                        }
                                                    >
                                                        新增圖片
                                                    </button>
                                                )}
                                            {modalData.imagesUrl.length > 1 && (
                                                <button
                                                    className="btn btn-outline-danger btn-sm w-100"
                                                    onClick={handleRemoveImages}
                                                >
                                                    取消圖片
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="mb-3">
                                        <label
                                            htmlFor="title"
                                            className="form-label"
                                        >
                                            標題
                                        </label>
                                        <input
                                            name="title"
                                            id="title"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入標題"
                                            value={modalData.title}
                                            onChange={handleProductContent}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="category"
                                            className="form-label"
                                        >
                                            分類
                                        </label>
                                        <input
                                            name="category"
                                            id="category"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入分類"
                                            value={modalData.category}
                                            onChange={handleProductContent}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="unit"
                                            className="form-label"
                                        >
                                            單位
                                        </label>
                                        <input
                                            name="unit"
                                            id="unit"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入單位"
                                            value={modalData.unit}
                                            onChange={handleProductContent}
                                        />
                                    </div>

                                    <div className="row g-3 mb-3">
                                        <div className="col-6">
                                            <label
                                                htmlFor="origin_price"
                                                className="form-label"
                                            >
                                                原價
                                            </label>
                                            <input
                                                name="origin_price"
                                                id="origin_price"
                                                type="number"
                                                className="form-control"
                                                placeholder="請輸入原價"
                                                min="0"
                                                value={modalData.origin_price}
                                                onChange={handleProductContent}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <label
                                                htmlFor="price"
                                                className="form-label"
                                            >
                                                售價
                                            </label>
                                            <input
                                                name="price"
                                                id="price"
                                                type="number"
                                                className="form-control"
                                                placeholder="請輸入售價"
                                                min="0"
                                                value={modalData.price}
                                                onChange={handleProductContent}
                                            />
                                        </div>
                                    </div>
                                    {/*熱門程度*/}
                                    <div className="mb-3">
                                        <label
                                            htmlFor="popularity"
                                            className="form-label"
                                        >
                                            熱門程度
                                        </label>
                                        <input
                                            name="popularity"
                                            id="popularity"
                                            type="number"
                                            className="form-control"
                                            placeholder="請輸入熱門程度"
                                            max="5"
                                            min="1"
                                            value={modalData.popularity}
                                            onChange={handleProductContent}
                                        />
                                    </div>
                                    {/*熱門程度*/}
                                    <div className="mb-3">
                                        <label
                                            htmlFor="description"
                                            className="form-label"
                                        >
                                            產品描述
                                        </label>
                                        <textarea
                                            name="description"
                                            id="description"
                                            className="form-control"
                                            rows={4}
                                            placeholder="請輸入產品描述"
                                            value={modalData.description}
                                            onChange={handleProductContent}
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label
                                            htmlFor="content"
                                            className="form-label"
                                        >
                                            說明內容
                                        </label>
                                        <textarea
                                            name="content"
                                            id="content"
                                            className="form-control"
                                            rows={4}
                                            placeholder="請輸入說明內容"
                                            value={modalData.content}
                                            onChange={handleProductContent}
                                        ></textarea>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            name="is_enabled"
                                            type="checkbox"
                                            className="form-check-input"
                                            id="isEnabled"
                                            checked={modalData.is_enabled}
                                            onChange={handleProductContent}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="isEnabled"
                                        >
                                            是否啟用
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer border-top bg-light">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={closeModal}
                            >
                                取消
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleUpdateProduct}
                            >
                                確認
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductModal;

ProductModal.propTypes = {
    isProductModalOpen: PropTypes.bool,
    setIsProductModalOpen: PropTypes.func,
    modalState: PropTypes.string,
    tempProduct: PropTypes.shape({
        imageUrl: PropTypes.string,
        title: PropTypes.string,
        category: PropTypes.string,
        unit: PropTypes.string,
        origin_price: PropTypes.string,
        price: PropTypes.string,
        description: PropTypes.string,
        content: PropTypes.string,
        is_enabled: PropTypes.number,
        popularity: PropTypes.string,
        imagesUrl: PropTypes.arrayOf(PropTypes.string),
    }),
    getProducts: PropTypes.func,
    pageInfo: PropTypes.shape({
        category: PropTypes.string,
        current_page: PropTypes.number,
        has_next: PropTypes.bool,
        has_pre: PropTypes.bool,
        total_pages: PropTypes.number,
    }),
};
