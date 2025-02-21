import PropTypes from "prop-types";

function Pagination({ getProducts, pageInfo }) {
    // 切換頁面
    const handlePageChange = (page = 1) => {
        getProducts(page);
    };

    return (
        <div className="d-flex justify-content-center">
            <nav>
                <ul className="pagination">
                    <li
                        className={`page-item ${!pageInfo.has_pre && "disabled"}`}
                    >
                        <button
                            className="page-link"
                            type="button"
                            onClick={() =>
                                handlePageChange(pageInfo.current_page - 1)
                            }
                        >
                            上一頁
                        </button>
                    </li>
                    {Array.from({ length: pageInfo.total_pages }).map(
                        (_, index) => (
                            <li
                                className={`page-item ${pageInfo.current_page === index + 1 && "active"}`}
                                key={index}
                            >
                                <button
                                    className="page-link"
                                    type="button"
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        )
                    )}
                    <li
                        className={`page-item ${!pageInfo.has_next && "disabled"}`}
                    >
                        <button
                            className="page-link"
                            type="button"
                            onClick={() =>
                                handlePageChange(pageInfo.current_page + 1)
                            }
                        >
                            下一頁
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Pagination;

Pagination.propTypes = {
    getProducts: PropTypes.func,
    pageInfo: PropTypes.shape({
        category: PropTypes.string,
        current_page: PropTypes.number,
        has_next: PropTypes.bool,
        has_pre: PropTypes.bool,
        total_pages: PropTypes.number,
    }),
};
