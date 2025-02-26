import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const baseUrl = import.meta.env.VITE_BASE_URL;

function LoginPage() {
    const navigate = useNavigate();

    // 帳密狀態
    const [account, setAccount] = useState({
        username: "",
        password: "",
    });

    // 取得帳號密碼
    const getInputValue = (event) => {
        const { name, value } = event.target;
        setAccount({
            ...account,
            [name]: value,
        });
    };

    // 登入功能
    const loginButton = (event) => {
        event.preventDefault();
        (async () => {
            try {
                const res = await axios.post(
                    `${baseUrl}/admin/signin`,
                    account
                );
                const { token, expired } = res.data;
                document.cookie = `hexToken=${token}; expires=${new Date({ expired })}`;
                axios.defaults.headers.common["Authorization"] = token;
                if(res.data?.success){
                    navigate("/admin");
                } else{
                    alert(res.data?.error?.message);
                }
            } catch (error) {
                alert(error.response.data?.error?.message);
            }
        })();
    };

    // 確認使用者是否已登入
    const checkUserLogin = async () => {
        try {
            await axios.post(`${baseUrl}/api/user/check`);
            alert("使用者已成功登入");
            navigate("/admin");
        } catch (error) {
            alert(error.response.data.message);
        }
    };
    // 自動檢查是否已登入
    useEffect(() => {
        const token = document.cookie.replace(
            // eslint-disable-next-line no-useless-escape
            /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
        );
        if (!token) {
            return;
        }
        axios.defaults.headers.common["Authorization"] = token;
        checkUserLogin();
    }, []);

    return (
        <>
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <h1 className="mb-5">請先登入</h1>
                <form
                    className="d-flex flex-column gap-3"
                    onSubmit={loginButton}
                >
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            name="username"
                            value={account.username}
                            className="form-control"
                            id="username"
                            placeholder="name@example.com"
                            onChange={getInputValue}
                        />
                        <label htmlFor="username">Email address</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="password"
                            name="password"
                            value={account.password}
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            onChange={getInputValue}
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <button className="btn btn-primary">登入</button>
                </form>
                <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
            </div>
        </>
    );
}

export default LoginPage;
