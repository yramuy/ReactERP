import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "../snackbar";


const SaveUpdateMenuItem = () => {

    const [roles, setRoles] = useState([]);
    const [screens, setScreens] = useState([]);
    const [formData, setFormData] = useState({
        menuItemID: '',
        parentID: '',
        menuName: '',
        screenID: '',
        url: '',
        level: '',
        icon: '',
        isActive: 0
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleChangeFormField = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
        });
    };

    useEffect(() => {
        GetDropDowns();
    }, []);

    const triggerSnackbar = () => {
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000); // Adjust the duration as needed
    };

    const GetDropDowns = async () => {

        try {

            let screenRes = await axios.get('http://127.0.0.1:8000/api/screens', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (screenRes.data['status'] === 200) {
                let screenData = screenRes.data['screens'];
                setScreens(screenData);
            }

        } catch (error) {

        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            dispatch({ type: 'LOADING', payload: true });
            setLoading(true);
            let response = await axios.post('http://127.0.0.1:8000/api/create-update-menu-item', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            triggerSnackbar();

            if (response.data['status'] === 200) {
                dispatch({ type: "RELOAD", payload: true});
                dispatch({ type: 'STATUS', payload: true });
                dispatch({ type: "ID", payload: 0 });
                setFormData({
                    menuItemID: '',
                    parentID: '',
                    menuName: '',
                    screenID: '',
                    url: '',
                    level: '',
                    icon: '',
                    isActive: 0
                });
                dispatch({ type: 'LOADING', payload: false });
                // setLoading(false);
                dispatch({ type: "MESSAGE", payload: response.data['message'] });

            }
        }
    }

    console.log("formData", formData)

    const validateForm = () => {

        let isValid = true;
        let errors = {};

        if (!formData.menuName) {
            isValid = false;
            errors.menuName = 'Menu Name is required';
        }
        if (!formData.screenID) {
            isValid = false;
            errors.screenID = 'Screen is required';
        }
        if (!formData.url && formData.parentID != "") {
            isValid = false;
            errors.url = 'Url is required';
        }
        if (!formData.level) {
            isValid = false;
            errors.level = 'Level is required';
        }
        if (!formData.icon) {
            isValid = false;
            errors.icon = 'Icon is required';
        }
        // if (formData.isActive === 0) {
        //     isValid = false;
        //     errors.isActive = 'IS Active is required';
        // }

        setErrors(errors);

        return isValid;
    };

    let msgResponse = useSelector((state) => {
        return state.moduleData;
    });

    let PId = msgResponse['id'];

    console.log("MenuItem ID ", PId);

    useEffect(() => {
        if (PId === 0) {
            clearFormData();
        }
        GetMenuItemDataByID();
    }, [PId]);

    const GetMenuItemDataByID = async () => {

        let response = await axios.get(`http://127.0.0.1:8000/api/menuItems/${PId}/edit`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data['status'] === 200 && PId !== 0) {
            let menuItem = response.data['menuItem'];

            console.log(menuItem)

            setFormData({
                menuItemID: menuItem['id'],
                parentID: menuItem['parent_id'],
                menuName: menuItem['menu_title'],
                screenID: menuItem['screen_id'],
                url: menuItem['url'],
                level: menuItem['level'],
                icon: menuItem['icon'],
                isActive: menuItem['status']
            });

        } else {
            setFormData({
                menuItemID: '',
                parentID: '',
                menuName: '',
                screenID: 0,
                url: 0,
                level: 0,
                icon: '',
                isActive: 0
            });
        }
        // console.log("MenuItemID", PId)
    }

    const clearFormData = () => {
        setFormData({
            menuItemID: '',
            parentID: '',
            menuName: '',
            screenID: '',
            url: '',
            level: '',
            icon: '',
            isActive: 0
        });
    }

    return (

        <div className="col-4">

            <div class="card card-info">
                <div class="card-header">
                    <h3 class="card-title">{PId ? 'Edit' : 'Add'} Menu Item</h3>
                </div>
                {/* <!-- /.card-header --> */}
                <form class="form-horizontal" method="post" id="moduleForm" onSubmit={handleSubmit}>
                    <div class="card-body">
                        <input type="hidden" name="menuItemID" value={msgResponse['id']} />
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Parent Menu </label>
                            <div class="col-sm-12">
                                <select class="form-control"
                                    name="parentID"
                                    value={formData.parentID}
                                    onChange={handleChangeFormField}>
                                    <option value="">--Select--</option>
                                    {
                                        msgResponse['data'].map((item) => (
                                            <option value={item.id}>{item.menu_name}</option>
                                        ))
                                    }
                                </select>

                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Menu Name<em className="star error">*</em></label>
                            <div class="col-sm-12">
                                <input type="text"
                                    class="form-control"
                                    name="menuName"
                                    value={formData.menuName}
                                    onChange={handleChangeFormField} />

                                {/* {error.screenName && <div className="error">{error.screenName}</div>} */}

                                {errors.menuName && <div className="error">{errors.menuName}</div>}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Screens <em className="star error">*</em></label>
                            <div class="col-sm-12">
                                <select class="form-control"
                                    name="screenID"
                                    value={formData.screenID}
                                    onChange={handleChangeFormField}
                                >
                                    <option value="">--Select--</option>
                                    {
                                        screens.map((screen) => (
                                            <option value={screen.id}>{screen.name}</option>
                                        ))
                                    }
                                </select>
                                {errors.screenID && <div className="error">{errors.screenID}</div>}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Url <em className="star error">*</em></label>
                            <div class="col-sm-12">
                                <input type="text"
                                    class="form-control"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChangeFormField} />

                                {/* {error.screenName && <div className="error">{error.screenName}</div>} */}

                                {errors.url && <div className="error">{errors.url}</div>}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Level <em className="star error">*</em></label>
                            <div class="col-sm-12">
                                <input type="number"
                                    class="form-control"
                                    value={formData.level}
                                    name="level"
                                    onChange={handleChangeFormField} />

                                {/* {error.screenName && <div className="error">{error.screenName}</div>} */}

                                {errors.level && <div className="error">{errors.level}</div>}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Icon <em className="star error">*</em></label>
                            <div class="col-sm-12">
                                <input type="text"
                                    class="form-control"
                                    value={formData.icon}
                                    name="icon"
                                    onChange={handleChangeFormField} />

                                {/* {error.screenName && <div className="error">{error.screenName}</div>} */}

                                {errors.icon && <div className="error">{errors.icon}</div>}
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Is Active</label>
                            <div class="col-sm-12">
                                <div class="form-check form-check-inline">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="isActive"
                                        value={formData.isActive}
                                        checked={formData.isActive}
                                        onChange={handleChangeFormField}
                                    />

                                    {errors.isActive && <div className="error">{errors.isActive}</div>}

                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div>
                            <div class="row">
                                <div class="col-sm-1">
                                    <button type="submit" class="btn btn-info" name="btnSave">{PId ? 'Update' : 'Save'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <Snackbar show={showSnackbar} message={msgResponse['message']} duration={3000} />
                {/* <!-- /.card-body --> */}
            </div>
        </div>
    );
};

export default SaveUpdateMenuItem;