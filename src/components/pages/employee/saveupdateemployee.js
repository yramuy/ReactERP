import React, { useEffect, useState } from "react";
import Layout from "../../layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const AddUpdateEmployee = () => {
    const [employeeFormData, setEmployeeFormData] = useState({
        empID: 0,
        first_name: '',
        last_name: '',
        employee_id: '',
        dob: '',
        email: '',
        mobile_number: '',
        gender: '',
        position: '',
        profile_pic: null,
        is_active: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const { empID } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [path, setPath] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setEmployeeFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/create-update-employee', employeeFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                triggerSnackbar();

                console.log("RESPONSE : ", response.data);

                if (response.data['status'] === 200) {
                    dispatch({ type: "RELOAD", payload: true });
                    dispatch({ type: 'STATUS', payload: true });
                    dispatch({ type: "ID", payload: 0 });
                    dispatch({ type: 'LOADING', payload: false });
                    // setLoading(false);
                    dispatch({ type: "MESSAGE", payload: response.data['message'] });
                    navigate("/employees");
                }

            } catch (error) {
                console.error("Error submitting form", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const triggerSnackbar = () => {
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
    };

    const validateForm = () => {
        let isValid = true;
        let validationErrors = {};

        const requiredFields = [
            { field: 'first_name', message: 'First Name is required' },
            { field: 'last_name', message: 'Last Name is required' },
            { field: 'employee_id', message: 'Employee ID is required' },
            { field: 'dob', message: 'DOB is required' },
            { field: 'email', message: 'Email is required' },
            { field: 'mobile_number', message: 'Mobile Number is required' },
            { field: 'gender', message: 'Gender is required' },
            { field: 'position', message: 'Position is required' },
            { field: 'profile_pic', message: 'Profile Pic is required' },
            { field: 'is_active', message: 'Is Active is required' },
        ];

        requiredFields.forEach(({ field, message }) => {
            if (!employeeFormData[field]) {
                isValid = false;
                validationErrors[field] = message;
            }
        });

        if (employeeFormData.mobile_number) {
            const mobileLength = employeeFormData.mobile_number.length;
            if (mobileLength > 12) {
                isValid = false;
                validationErrors.mobile_number = "Mobile Number should be less than 13 digits";
            }
            if (mobileLength < 9) {
                isValid = false;
                validationErrors.mobile_number = "Mobile Number should be greater than 10 digits";
            }
        }

        setErrors(validationErrors);
        return isValid;
    };

    const handleCancel = () => {
        window.location.href = "/employees";
    };

    let msgResponse = useSelector((state) => {
        return state.moduleData;
    });

    let PId = msgResponse['id'];

    useEffect(() => {
        if (PId === 0) {
            dispatch({ type: 'LOADING', payload: false });
            clearFormData();
        }
        dispatch({ type: 'LOADING', payload: true });
        fetchEmployeeDataByID();
    }, [PId]);

    const fetchEmployeeDataByID = async () => {

        const response = await axios.get(`http://127.0.0.1:8000/api/employees/${PId}/edit`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data['status'] === 200 && PId !== 0) {
            let employee = response.data['employee'];
            dispatch({ type: 'LOADING', payload: false });

            setPath(response.data['path'] + '/' + employee['profile_pic']);

            setEmployeeFormData({
                empID: employee['emp_number'],
                first_name: employee['first_name'],
                last_name: employee['last_name'],
                employee_id: employee['employee_id'],
                dob: employee['dob'],
                email: employee['email'],
                mobile_number: employee['mobile_number'],
                gender: employee['gender'],
                position: employee['position'],
                profile_pic: employee['profile_pic'],
                is_active: employee['is_active'],
            });

        } else {
            setEmployeeFormData({
                empID: 0,
                first_name: '',
                last_name: '',
                employee_id: '',
                dob: '',
                email: '',
                mobile_number: '',
                gender: '',
                position: '',
                profile_pic: null,
                is_active: false,
            });
        }

    };

    const clearFormData = () => {

        setEmployeeFormData({
            empID: 0,
            first_name: '',
            last_name: '',
            employee_id: '',
            dob: '',
            email: '',
            mobile_number: '',
            gender: '',
            position: '',
            profile_pic: null,
            is_active: false,
        });
    }

    useEffect(() => {
        dispatch({ type: 'LOADING', payload: false });
    }, [PId === 0]);

    console.log("EMPID", empID);
    console.log("EMP Path", path);

    return (
        <Layout>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">Employees</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Employees</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                    <form method="post" onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">{employeeFormData.empID ? "Edit" : "Add"} Employee</h3>
                            </div>
                            <input type="hidden" name="empID" value={employeeFormData.empID} />
                            <div className="card-body">
                                <div className="form-group row">
                                    <div className="col-2">
                                        <label className="col-form-label">First Name</label>
                                    </div>
                                    <div className="col-4">
                                        <input
                                            type="text"
                                            name="first_name"
                                            className="form-control"
                                            value={employeeFormData.first_name}
                                            onChange={handleChange}
                                        />
                                        {errors.first_name && <div className="error">{errors.first_name}</div>}
                                    </div>
                                    <div className="col-2">
                                        <label className="col-form-label">Last Name</label>
                                    </div>
                                    <div className="col-4">
                                        <input
                                            type="text"
                                            name="last_name"
                                            className="form-control"
                                            value={employeeFormData.last_name}
                                            onChange={handleChange}
                                        />
                                        {errors.last_name && <div className="error">{errors.last_name}</div>}
                                    </div>
                                </div>
                                <div className="row form-group">
                                    <div className="col-2">
                                        <label className="col-form-label">Employee ID</label>
                                    </div>
                                    <div className="col-4">
                                        <input
                                            type="text"
                                            name="employee_id"
                                            className="form-control"
                                            value={employeeFormData.employee_id}
                                            onChange={handleChange}
                                        />
                                        {errors.employee_id && <div className="error">{errors.employee_id}</div>}
                                    </div>
                                    <div className="col-2">
                                        <label className="col-form-label">DOB</label>
                                    </div>
                                    <div className="col-4">
                                        <input
                                            type="date"
                                            name="dob"
                                            className="form-control"
                                            value={employeeFormData.dob}
                                            onChange={handleChange}
                                        />
                                        {errors.dob && <div className="error">{errors.dob}</div>}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-2">
                                        <label className="col-form-label">Email</label>
                                    </div>
                                    <div className="col-4">
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={employeeFormData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && <div className="error">{errors.email}</div>}
                                    </div>
                                    <div className="col-2">
                                        <label className="col-form-label">Mobile Number</label>
                                    </div>
                                    <div className="col-4">
                                        <input
                                            type="number"
                                            name="mobile_number"
                                            className="form-control"
                                            value={employeeFormData.mobile_number}
                                            onChange={handleChange}
                                        />
                                        {errors.mobile_number && <div className="error">{errors.mobile_number}</div>}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-2">
                                        <label className="col-form-label">Gender</label>
                                    </div>
                                    <div className="col-4">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                id="male"
                                                value="male"
                                                checked={employeeFormData.gender === "male"}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="male">Male</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                id="female"
                                                value="female"
                                                checked={employeeFormData.gender === 'female'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="female">Female</label>
                                        </div>
                                        {errors.gender && <div className="error">{errors.gender}</div>}
                                    </div>
                                    <div className="col-2">
                                        <label className="col-form-label">Position</label>
                                    </div>
                                    <div className="col-4">
                                        <select
                                            className="form-control"
                                            name="position"
                                            value={employeeFormData.position}
                                            onChange={handleChange}>
                                            <option value="">--Select--</option>
                                            <option value="1">Software Developer</option>
                                            <option value="2">Mobile Developer</option>
                                            <option value="3">QA</option>
                                        </select>
                                        {errors.position && <div className="error">{errors.position}</div>}
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-2">
                                        <label className="col-form-label">Profile Pic</label>
                                    </div>
                                    <div className="col-4">
                                        <input
                                            type="file"
                                            name="profile_pic"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                        {errors.profile_pic && <div className="error">{errors.profile_pic}</div>}
                                    </div>
                                    <div className="col-2">
                                        <label className="col-form-label">Is Active</label>
                                    </div>
                                    <div className="col-4">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            className="form-check-input"
                                            checked={employeeFormData.is_active}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                {
                                    employeeFormData.empID ? <div className="form-group row">
                                        <div className="col-2"></div>
                                        <div className="col-6">
                                            <img src={path} style={{ width: "200px", height: "200px" }} />
                                        </div>
                                    </div> : ""
                                }


                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-info">{loading ? 'Loading...' : employeeFormData.empID ? 'Update' : 'Save'}</button>
                                <button type="button" className="btn btn-default ml-2" onClick={handleCancel}>Cancel</button>
                            </div>

                        </div>
                    </form>
                </div>
            </section>
        </Layout>
    );
};

export default AddUpdateEmployee;
