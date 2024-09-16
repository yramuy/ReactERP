import { useState } from "react";
import { PostApiService } from "../api";
import { useNavigate } from "react-router-dom";
const Login = () => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const url = '/BillsPayeApis/v1/login';
            const body = JSON.stringify({
                username: userName,
                password: password
            });

            await PostApiService(url, body).then((data) => {
                if (data.status === 1) {

                    const userData = data.userDetails;
                    sessionStorage.setItem("userId", userData.user_id);
                    sessionStorage.setItem("userName", userData.user_name);
                    sessionStorage.setItem("userRoleId", userData.user_role_id);
                    sessionStorage.setItem("userRole", userData.role_name);
                    // sessionStorage.setItem("userImg", userData.image);
                    sessionStorage.setItem("email", userData.email);
                    sessionStorage.setItem("mobileno", userData.mobileno);
                    sessionStorage.setItem("isLogin", true);

                    console.log("userData : ", userData)

                    navigate('/', { replace: true });

                } else {
                    // setShowMsg(true);
                    navigate('/login', { replace: true });
                }
            });
        } catch (error) {
            
        }

    }

    return (
        <>
            <div class="container">
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
        </>
    );
};

export default Login;