import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {

    const [isActive, setIsActive] = useState(false);
    const [isConfig, setIsConfig] = useState(false);
    const loginUser = sessionStorage.getItem('userName');
    const userRole = sessionStorage.getItem('userRole');
    const userRoleId = sessionStorage.getItem('userRoleId');
    const [menus, setMenus] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = () => {
        setIsActive(!isActive);
    }
    const handleConfig = () => {
        setIsConfig(!isConfig);

    }

    const response = useSelector((state) => {
        return state.moduleData;
    });

    useEffect(() => {
        GetMenus();
    }, []);

    const GetMenus = async () => {
        try {

            const body = JSON.stringify({
                role_id: userRoleId,
                parent_id: 0
            });

            const result = await axios.post('http://127.0.0.1:8000/api/menu', body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Menus ", result.data['mainMenus']);

            if (result.data['status'] === 200) {
                const menuData = result.data['mainMenus'];
                // dispatch({ type: "RELOAD", payload: false });
                setMenus(menuData)
            }
        } catch (error) {
            setMenus([]);
        }
    }

    const handleMenu = (id, url) => {
        console.log(url)
        dispatch({ type: "LEVELMENUID", payload: id });
    }

    const handleNavigate = (e, url) => {
        // e.preventDefault();
        navigate(`${url}`);
    }

    // Reusable component for menu items
    const MenuItem = ({ menu, activeMenuId, onClick, handleNavigate }) => {
        const isActive = menu.miID === activeMenuId || location.pathname === menu.url;
        return (
            <li key={menu.miID} className={isActive ? 'nav-item menu-open' : 'nav-item'} onClick={() => onClick(menu.miID)}>
                <a href="javascript:void(0)" className={isActive ? 'nav-link active' : 'nav-link'} onClick={(e) => handleNavigate(e, menu.url)}>
                    <i className={`nav-icon fas ${menu.icon}`}></i>
                    <p>
                        {menu.menu_name}
                        {menu.subMenus.length > 0 && <i className="right fas fa-angle-left"></i>}
                    </p>
                </a>
                {Array.isArray(menu.subMenus) && menu.subMenus.length > 0 && renderSubmenus(menu.subMenus, activeMenuId, onClick, handleNavigate)}
            </li>
        );
    };

    // Refactored renderSubmenus function
    const renderSubmenus = (submenus, activeMenuId, onClick, handleNavigate) => (
        <ul className="nav nav-treeview">
            {submenus.map(submenu => (
                <Submenu key={submenu.miID} submenu={submenu} activeMenuId={activeMenuId} onClick={onClick} handleNavigate={handleNavigate} />
            ))}
        </ul>
    );

    // Component to render submenus
    const Submenu = ({ submenu, activeMenuId, onClick, handleNavigate }) => {
        const isActive = submenu.miID === activeMenuId || location.pathname === submenu.url;
        return (
            <li key={submenu.miID} className={isActive ? 'nav-item menu-open' : 'nav-item'} onClick={() => onClick(submenu.miID)}>
                <a href="javascript:void(0)" className={isActive ? 'nav-link active' : 'nav-link'} onClick={(e) => handleNavigate(e, submenu.url)}>
                    <i className={`nav-icon fas ${submenu.icon}`}></i>
                    <p>
                        {submenu.menu_name}
                        {Array.isArray(submenu.subMenus) && submenu.subMenus.length > 0 && <i className="right fas fa-angle-left"></i>}
                    </p>
                </a>
                {Array.isArray(submenu.subMenus) && submenu.subMenus.length > 0 && renderSubmenus(submenu.subMenus, activeMenuId, onClick, handleNavigate)}
            </li>
        );
    };

    return (
        <>
            <aside class="main-sidebar sidebar-dark-primary elevation-4">
                {/* <!-- Brand Logo --> */}
                <a href="index3.html" class="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style={{ opacity: "0.8" }} />
                    <span class="brand-text font-weight-light">AdminLTE 3</span>
                </a>

                {/* <!-- Sidebar --> */}
                <div class="sidebar">
                    {/* <!-- Sidebar user panel (optional) --> */}
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">
                            <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div class="info">
                            <a href="#" class="d-block">{loginUser}</a>
                        </div>
                    </div>

                    {/* <!-- SidebarSearch Form --> */}
                    <div class="form-inline">
                        <div class="input-group" data-widget="sidebar-search">
                            <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search" />
                            <div class="input-group-append">
                                <button class="btn btn-sidebar">
                                    <i class="fas fa-search fa-fw"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Sidebar Menu --> */}
                    <nav class="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            {menus.map(menu => (
                                <MenuItem key={menu.miID} menu={menu} activeMenuId={response['levelMenuID']} onClick={handleMenu} handleNavigate={handleNavigate} />
                            ))}
                        </ul>
                        {/* <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                            <li class="nav-item">
                                <a href="/" class="nav-link">
                                    <i class="nav-icon fas fa-home"></i>
                                    <p>
                                        Home
                                    </p>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="/users" class="nav-link">
                                    <i class="nav-icon fas fa-users"></i>
                                    <p>
                                        Users
                                    </p>
                                </a>
                            </li>

                            <li class={isActive ? 'nav-item menu-open' : 'nav-item'} onClick={handleClick}>
                                <a href="#" class={isActive ? 'nav-link active' : 'nav-link'}>
                                    <i class="nav-icon fas fa-tachometer-alt"></i>
                                    <p>
                                        Dashboard
                                        <i class="right fas fa-angle-left"></i>
                                    </p>
                                </a>
                                <ul class="nav nav-treeview">
                                    <li class="nav-item">
                                        <a href="./index.html" class="nav-link active">
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>Dashboard v1</p>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="./index2.html" class="nav-link">
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>Dashboard v2</p>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="./index3.html" class="nav-link">
                                            <i class="far fa-circle nav-icon"></i>
                                            <p>Dashboard v3</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class={isConfig ? 'nav-item menu-open' : 'nav-item'} onClick={handleConfig}>
                                <a href="#" class={isConfig ? 'nav-link active' : 'nav-link'}>
                                    <i class="nav-icon fas fa-cog"></i>
                                    <p>
                                        Configurations
                                        <i class="right fas fa-angle-left"></i>
                                    </p>
                                </a>
                                <ul class="nav nav-treeview">
                                    <li class="nav-item">
                                        <a href="./index.html" class="nav-link">
                                            <i class="nav-icon fas fa-folder"></i>
                                            <p>Category</p>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="./index2.html" class="nav-link">
                                            <i class="nav-icon fas fa-chart-bar"></i>
                                            <p>Subcategory</p>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="./index3.html" class="nav-link">
                                            <i class="nav-icon fas fa-gift"></i>
                                            <p>Items</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>

                        </ul> */}
                    </nav>
                    {/* <!-- /.sidebar-menu --> */}
                </div>
                {/* <!-- /.sidebar --> */}
            </aside>
        </>
    );
};

export default Sidebar;