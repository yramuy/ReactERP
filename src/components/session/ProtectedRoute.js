import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Protected(props) {

    const navigate = useNavigate();
    const { Component } = props;

    useEffect(() => {
        let login = sessionStorage.getItem('isLogin');

        console.log("Protected Route", login)
        if (login === "false" || login === null || login === "null") {
            navigate("/login", { replace: true });
        }
    }, []);

    // useEffect(() => {
    //     // Set timeout for auto logout (e.g., 5 minutes = 300000 milliseconds)
    //     const timeout = setTimeout(() => {
    //         handleLogout();
    //     }, 120000); // 5 minutes

    //     // Clear timeout if component unmounts
    //     return () => clearTimeout(timeout);
    // }, []);

    // const handleLogout = () => {
    //     // Perform logout actions (e.g., clearing tokens, redirecting to login page)
    //     // For demonstration, we just redirect to the login page
    //     sessionStorage.setItem('isLogin', false);
    //     navigate('/login');
    // };

    return (
        <Component />
    );

}