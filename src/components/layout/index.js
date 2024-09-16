import React, { useEffect } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const isLogin = sessionStorage.getItem('isLogin');
    useEffect(() => {
        if (isLogin == 'false') {
            console.log('isLogin: ', isLogin)
            navigate('/login', { replace: true });
        }
    }, []);
    return (
        <>
            <body class="hold-transition sidebar-mini layout-fixed">
                <div class="wrapper">
                    <Header />
                    <Sidebar />
                    <div class="content-wrapper">
                        {children}
                    </div>
                    <Footer />
                </div>
            </body>

        </>
    );
};

export default Layout;