import PropTypes from "prop-types";
import axios from "axios";
import { Modal } from "bootstrap";
import { useEffect, useRef } from "react";
const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function DeleteProductModal({
    isDeleteProductModalOpen,
    setIsDeleteProductModalOpen,
    tempProduct,
    getProducts,
    pageInfo,
}) {
    // 刪除modal
    const deleteProductModalRef = useRef(null);
    const deleteModalRef = useRef(null);
    useEffect(() => {
        deleteModalRef.current = new Modal(deleteProductModalRef.current, {
            backdrop: false,
        });
    }, []);

    // 控制刪除modal開關
    useEffect(() => {
        if (isDeleteProductModalOpen) {
            deleteModalRef.current.show();
        }
    }, [isDeleteProductModalOpen]);

    // 關閉刪除modal
    const closeDeleteModal = () => {
        deleteModalRef.current.hide();
        setIsDeleteProductModalOpen(false);
    };

    // 刪除產品
    const deleteProduct = async () => {
        try {
            await axios.delete(
                `${baseUrl}/api/${apiPath}/admin/product/${tempProduct.id}`
            );
            alert("產品已刪除");
            closeDeleteModal();
            getProducts(pageInfo.current_page);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div
            ref={deleteProductModalRef}
            className="modal fade"
            id="delProductModal"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5">刪除產品</h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={closeDeleteModal}
                        ></button>
                    </div>
                    <div className="modal-body">
                        你是否要刪除
                        <span className="text-danger fw-bold">
                            {tempProduct.title}
                        </span>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={closeDeleteModal}
                        >
                            取消
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={deleteProduct}
                        >
                            刪除
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteProductModal;

DeleteProductModal.propTypes = {
    isDeleteProductModalOpen: PropTypes.bool,
    setIsDeleteProductModalOpen: PropTypes.func,
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
        id: PropTypes.string,
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
