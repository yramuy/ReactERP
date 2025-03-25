import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "../snackbar";

const SaveUpdateUserRoleScreen = () => {

    const [roles, setRoles] = useState([]);
    const [screens, setScreens] = useState([]);
    const [formData, setFormData] = useState({
        permissionID: '',
        roleId: '',
        screenId: '',
        canRead: 0,
        canCreate: 0,
        canUpdate: 0,
        canDelete: 0,
        btnValue: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleBtn = (value) => {
        setFormData({
            ...formData,
            btnValue: value
        });
    }

    const handleChange = (e) => {
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
            let roleRes = await axios.get('http://127.0.0.1:8000/api/roles', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let screenRes = await axios.get('http://127.0.0.1:8000/api/screens', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (roleRes.data['status'] === 200) {
                let roleData = roleRes.data['roles'];
                setRoles(roleData);
            }

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
            console.log("FormData", formData)
            dispatch({ type: 'LOADING', payload: true });
            setLoading(true);
            let response = await axios.post('http://127.0.0.1:8000/api/create-update-screen-permission', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            triggerSnackbar();

            if (response.data['status'] === 200) {
                dispatch({ type: 'STATUS', payload: true });
                dispatch({ type: "ID", payload: 0 });
                setFormData({
                    permissionID: '',
                    roleId: '',
                    screenId: '',
                    canRead: 0,
                    canCreate: 0,
                    canUpdate: 0,
                    canDelete: 0
                });
                dispatch({ type: 'LOADING', payload: false });
                // setLoading(false);
                dispatch({ type: "MESSAGE", payload: response.data['message'] });

            }
        }
    }

    const validateForm = () => {

        let isValid = true;
        let errors = {};

        if (!formData.roleId) {
            isValid = false;
            errors.roleId = 'Role is required';
        }
        if (!formData.screenId) {
            isValid = false;
            errors.screenId = 'Screen is required';
        }
        // Check if all permissions are false (0)
        if ((formData.canRead === 0) && (formData.canCreate === 0) && (formData.canUpdate === 0) && (formData.canDelete === 0)) {
            isValid = false;
            errors.canUpdate = 'At least one permission is required';
        }

        setErrors(errors);

        return isValid;
    };

    let msgResponse = useSelector((state) => {
        return state.moduleData;
    });

    let PId = msgResponse['id'];

    console.log("Permission ID ", PId);

    useEffect(() => {
        if (PId === 0) {
            clearFormData();
        }
        GetPermissionDataByID();
    }, [PId]);

    const GetPermissionDataByID = async () => {

        let response = await axios.get(`http://127.0.0.1:8000/api/permissions/${PId}/edit`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data['status'] === 200 && PId !== 0) {
            let permission = response.data['permission'];

            console.log("permission : ", permission);

            setFormData({
                permissionID: permission['id'],
                roleId: permission['user_role_id'],
                screenId: permission['screen_id'],
                canRead: permission['can_read'],
                canCreate: permission['can_create'],
                canUpdate: permission['can_update'],
                canDelete: permission['can_delete']
            });

        } else {
            setFormData({
                permissionID: '',
                roleId: '',
                screenId: '',
                canRead: 0,
                canCreate: 0,
                canUpdate: 0,
                canDelete: 0
            });
        }
        // console.log("PermissionID", PId)
    }

    const clearFormData = () => {
        setFormData({
            permissionID: '',
            roleId: '',
            screenId: '',
            canRead: 0,
            canCreate: 0,
            canUpdate: 0,
            canDelete: 0
        });
    }



    return (

        <div className="col-4">

            <div class="card card-info">
                <div class="card-header">
                    <h3 class="card-title">{PId ? 'Edit' : 'Add'} Permission</h3>
                </div>
                {/* <!-- /.card-header --> */}
                <form class="form-horizontal" method="post" id="moduleForm" onSubmit={handleSubmit}>
                    <div class="card-body">
                        <input type="hidden" name="permissionID" value={msgResponse['id']} />
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Roles <em className="star error">*</em></label>
                            <div class="col-sm-12">
                                <select class="form-control"
                                    name="roleId"
                                    value={formData.roleId}
                                    onChange={handleChange}>
                                    <option value="">--Select--</option>
                                    {
                                        roles.map((role) => (
                                            <option value={role.id}>{role.name}</option>
                                        ))
                                    }
                                </select>
                                {errors.roleId && <div className="error">{errors.roleId}</div>}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Screens <em className="star error">*</em></label>
                            <div class="col-sm-12">
                                <select class="form-control"
                                    name="screenId"
                                    value={formData.screenId}
                                    onChange={handleChange}
                                >
                                    <option value="">--Select--</option>
                                    {
                                        screens.map((screen) => (
                                            <option value={screen.id}>{screen.name}</option>
                                        ))
                                    }
                                </select>
                                {errors.screenId && <div className="error">{errors.screenId}</div>}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="inputEmail3" class="col-sm-8 col-form-label">Permissions <em className="star error">*</em></label>
                            <div class="col-sm-12">
                                <div class="form-check form-check-inline">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="canRead"
                                        value={formData.canRead}
                                        checked={formData.canRead}
                                        onChange={handleChange}
                                    />
                                    <label class="form-check-label" for="inlineCheckbox1">Can Read</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="canCreate"
                                        value={formData.canCreate}
                                        checked={formData.canCreate}
                                        onChange={handleChange}
                                    />
                                    <label class="form-check-label" for="inlineCheckbox1">Can Create</label>
                                </div>
                            </div>
                            <div class="col-sm-12 mt-2">
                                <div class="form-check form-check-inline">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="canUpdate"
                                        value={formData.canUpdate}
                                        checked={formData.canUpdate}
                                        onChange={handleChange}
                                    />
                                    <label class="form-check-label" for="inlineCheckbox1">Can Update</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="canDelete"
                                        value={formData.canDelete}
                                        checked={formData.canDelete}
                                        onChange={handleChange}
                                    />
                                    <label class="form-check-label" for="inlineCheckbox2">Can Delete</label>
                                </div>
                                <input type="hidden" name="btnValue" value={formData.btnValue} />
                                {errors.canUpdate && <div className="error">{errors.canUpdate}</div>}
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">

                        <button type="submit" class="btn btn-info" name="btnSave" onClick={() => handleBtn('update')}>{PId ? 'Update' : 'Save'}</button>
                        {PId !== 0 && <button type="submit" class="btn btn-success ml-2" name="btnSave" onClick={() => handleBtn('copy')}>Copy Permission</button>}

                    </div>
                </form>
                <Snackbar show={showSnackbar} message={msgResponse['message']} duration={3000} />
                {/* <!-- /.card-body --> */}
            </div>
        </div>
    );
};

export default SaveUpdateUserRoleScreen;