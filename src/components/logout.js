import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {

    const navigate = useNavigate();
    sessionStorage.setItem("userId", "");
    sessionStorage.setItem("userName", "");
    sessionStorage.setItem("userRoleId", "");
    sessionStorage.setItem("userRole", "");
    sessionStorage.setItem("email", "");
    sessionStorage.setItem("mobileno", "");
    sessionStorage.setItem("isLogin", false);
    
    useEffect(() => {
        navigate('/login', { replace: true });
    }, []);
    
};

export default Logout;