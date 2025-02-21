import { useEffect } from "react";
import { useNavigate } from "react-router";

function NotFound() {
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            navigate("/");
        }, 3000);
    }, []);

    return (
        <>
            <div className="container">
                <h3>頁面不存在，3秒後將自動導回首頁</h3>
            </div>
        </>
    );
}

export default NotFound;
