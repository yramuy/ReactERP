import { useState } from "react";
import { PostApiService } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "../snackbar";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();

    const triggerSnackbar = () => {
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
            dispatch({ type: "MESSAGE", payload: "" });
        }, 3000); // Adjust the duration as needed
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const body = JSON.stringify({
                username: userName,
                password: password
            });

            const response = await axios.post('http://127.0.0.1:8000/api/login', body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            triggerSnackbar();
            // setMessage(response.data['message']);
            dispatch({ type: "MESSAGE", payload: response.data['message'] });

            if (response.data['status'] === 200) {

                const userData = response.data['userDetails'];
                sessionStorage.setItem("userId", userData.id);
                sessionStorage.setItem("userName", userData.name);
                sessionStorage.setItem("userRoleId", userData.role_id);
                sessionStorage.setItem("userRole", userData.role_name);
                // sessionStorage.setItem("userImg", userData.image);
                sessionStorage.setItem("email", userData.email);
                // sessionStorage.setItem("mobileno", userData.mobileno);
                sessionStorage.setItem("isLogin", true);
                // dispatch({ type: "MESSAGE", payload: response.data['message']});

                console.log("userData : ", userData)
                setLoading(false);
                navigate('/', { replace: true });

            } else {
                // setShowMsg(true);
                setLoading(false);
                // dispatch({ type: "MESSAGE", payload: response.data['message']});
                navigate('/login', { replace: true });
            }
        } catch (error) {

        }

    }

    let result = useSelector((state) => {
        return state.moduleData;
    });

    return (
        <>
            <div class="container">
                {loading && <div className="loader"></div>}
                <div class="login-container">
                    <div class="avatar1">
                        <img src="dist/img/57857.jpg" id="logo" alt="User Image" />
                    </div>
                    {/* <h2>Admin Login</h2> */}
                    <br />
                    <form method="post">
                        <div class="form-group">
                            {/* <label for="username">Username</label> */}
                            <input type="text" class="form-control"
                                id="username"
                                name="username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Email or Mobile Number" required />
                        </div>
                        <div class="form-group">
                            {/* <label for="password">Password</label> */}
                            <input type="password" class="form-control"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password" required />
                        </div>
                        <button type="submit" name="btn_login" class="btn btn-primary btn-block" onClick={handleLogin}>Login</button>


                    </form>
                </div>
            </div>

            <Snackbar show={showSnackbar} message={result['message']} duration={3000} />
        </>
    );
};

export default Login;