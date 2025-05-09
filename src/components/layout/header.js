
import { useState } from "react";
import { useDispatch } from "react-redux";
import MenuConfig from "../pages/menuconfig";

const Header = () => {

    const [show, setShow] = useState(false);
    const [text, setText] = useState('');
    const dispatch = useDispatch();
    const roleID = sessionStorage.getItem('userRoleId');

    const handleClose = () => {
        setShow(false);
    }

    const handleScreen = (value) => {
        setShow(true);
        setText(value);
        dispatch({ type: "STATUS", payload: true });
        dispatch({ type: "ID", payload: 0 });
    }

    console.log("RoleID",roleID)

    return (
        <>
            {/* <!-- Navbar --> */}
            <nav class="main-header navbar navbar-expand navbar-white navbar-light">
                {/* <!-- Left navbar links --> */}
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a href="index.php" class="nav-link">Home</a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a href="#" class="nav-link">Contact</a>
                    </li>
                    {
                        roleID === "1" && <li class="nav-item d-none d-sm-inline-block">
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav mr-auto">
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Menu
                                        </a>
                                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <a class="dropdown-item" href="#" onClick={() => handleScreen('Screen')}>Screen</a>
                                            <a class="dropdown-item" href="#" onClick={() => handleScreen('User Role Screen')}>User Role Screen</a>
                                            <a class="dropdown-item" href="#" onClick={() => handleScreen('Menu Item')}>Menu Item</a>


                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    }

                </ul>

                {/* <!-- Right navbar links --> */}
                <ul class="navbar-nav ml-auto">
                    {/* <!-- Navbar Search --> */}
                    <li class="nav-item">
                        <a class="nav-link" data-widget="navbar-search" href="#" role="button">
                            <i class="fas fa-search"></i>
                        </a>
                        <div class="navbar-search-block">
                            <form class="form-inline">
                                <div class="input-group input-group-sm">
                                    <input class="form-control form-control-navbar" type="search" placeholder="Search"
                                        aria-label="Search" />
                                    <div class="input-group-append">
                                        <button class="btn btn-navbar" type="submit">
                                            <i class="fas fa-search"></i>
                                        </button>
                                        <button class="btn btn-navbar" type="button" data-widget="navbar-search">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                            <i class="fas fa-expand-arrows-alt"></i>
                        </a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                            <i class="fa fa-cog" aria-hidden="true"></i>

                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <div class="dropdown-divider"></div>
                            <a href="/logout" class="dropdown-item">
                                <i class="fa fa-address-book mr-2" aria-hidden="true"></i> Logout
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <i class="fa fa-user mr-2" aria-hidden="true"></i> User Profile
                            </a>
                            <div class="dropdown-divider"></div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-widget="control-sidebar" data-controlsidebar-slide="true" href="#"
                            role="button">
                            <i class="fas fa-th-large"></i>
                        </a>
                    </li>
                </ul>
            </nav>

            <MenuConfig show={show} handleClose={handleClose} text={text} />
        </>
    );
};

export default Header;