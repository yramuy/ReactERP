import React, { useEffect, useState } from "react";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "../snackbar";

const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const [showSnackbar, setShowSnackbar] = useState(false);

    let response = useSelector((state) => {
        return state.moduleData;
    });

    useEffect(() => {
        triggerSnackbar();
    }, [response['message']]);

    const triggerSnackbar = () => {
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
            dispatch({ type: "MESSAGE", payload: "" });
        }, 3000); // Adjust the duration as needed
    };

    return (
        <>
            <body class="hold-transition sidebar-mini layout-fixed">
                <div class="wrapper">
                    <Header />
                    <Sidebar />
                    <div class="content-wrapper">
                        {children}
                    </div>
                    {response['message'] && <Snackbar show={showSnackbar} message={response['message']} duration={3000} />}
                    <Footer />
                </div>
            </body>

        </>
    );
};

export default Layout;