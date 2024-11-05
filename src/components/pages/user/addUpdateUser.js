
import { useEffect, useState } from "react";
import Layout from "../../layout";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddUpdateUser = () => {

    const [roles, setRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [userFormData, setUserFormData] = useState({
        userID: 0,
        role: "",
        empNumber: "",
        empName: "",
        userName: "",
        status: "",
        password: "",
        confirmPassword: ""
    });
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isCheck, setIsCheck] = useState(false);

    let userResponse = useSelector((state) => {
        return state.moduleData;
    });

    let PId = userResponse['id'];

    useEffect(() => {
        fetchRoles();
        fetchEmployees();
    }, []);

    const fetchRoles = async () => {
        let response = await axios.get("http://127.0.0.1:8000/api/roles", {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            setRoles(response.data['roles']);
        }
    };

    const fetchEmployees = async () => {
        let response = await axios.get("http://127.0.0.1:8000/api/employees", {
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            setEmployees(response.data['employees']);
        }
    };

    console.log("Employees", employees)

    // Handle suggestion click
    const handleSuggestionClick = (id, name) => {
        setUserFormData({
            empName: name,
            empNumber: id
        });
        setFilteredSuggestions([]); // Clear suggestions
        setShowSuggestions(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "empName") {
            // Filter suggestions based on input value
            const filtered = employees.filter(employee =>
                employee.first_name.toLowerCase().includes(value.toLowerCase())
            );
            setShowSuggestions(true);
            setFilteredSuggestions(filtered);
        }
        setUserFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        console.log(userFormData)
        e.preventDefault();

        if (validateForm()) {

            dispatch({ type: 'LOADING', payload: true });
            const response = await axios.post('http://127.0.0.1:8000/api/create-update-user', userFormData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.data['status'] === 200) {
                dispatch({ type: 'LOADING', payload: false });
                dispatch({ type: 'MESSAGE', payload: response.data['message'] });
                navigate('/users');

            }
        }
    }

    const validateForm = () => {
        let isValid = true;
        let validationErrors = {};

        const requiredFields = [
            { field: 'role', message: 'Role is required' },
            { field: 'empName', message: 'EmpName is required' },
            { field: 'userName', message: 'UserName is required' },
            { field: 'status', message: 'Status is required' },
            // { field: 'password', message: 'Password is required' },
            // { field: 'confirmPassword', message: 'Confirm Password is required' }
        ];

        requiredFields.forEach(({ field, message }) => {
            if (!userFormData[field]) {
                isValid = false;
                validationErrors[field] = message;
            }
        });

        if (isCheck && userFormData.password === "") {
            isValid = false;
            validationErrors.password = "Password is required";
        }

        if (isCheck && userFormData.confirmPassword === "") {
            isValid = false;
            validationErrors.confirmPassword = "Confirm Password is required";
        }

        if (userFormData.password !== userFormData.confirmPassword) {
            isValid = false;
            validationErrors.confirmPassword = "Password does not match";
        }

        setErrors(validationErrors);
        return isValid;
    }

    useEffect(() => {
        fetchUserDataByID();
    }, [PId]);

    const fetchUserDataByID = async () => {
        if (PId !== 0) {
            console.log("Calling", PId);
            const response = await axios.get(`http://127.0.0.1:8000/api/user/${PId}/edit`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data['status'] === 200) {
                let userData = response.data['user'];
                dispatch({ type: 'LOADING', payload: false });
                console.log(userData)
                setUserFormData({
                    userID: userData['id'],
                    role: userData['role'],
                    empNumber: userData['emp_number'],
                    empName: userData['first_name'] + ' ' + userData['last_name'],
                    userName: userData['username'],
                    status: userData['status'],
                    password: userData['password'],
                    confirmPassword: userData['password']
                });
            }
        } else {
            setIsCheck(true);
            clearFormData();
        }

    }

    const clearFormData = () => {
        setUserFormData({
            userID: 0,
            role: "",
            empNumber: "",
            empName: "",
            userName: "",
            status: "",
            password: "",
            confirmPassword: ""
        });
    }

    const handleCancelBtn = () => {
        navigate('/users');
    }

    const handleCheckbox = () => {
        setIsCheck(!isCheck);
    }

    const textStyle = {
        padding: "3px",
        backgroundColor: '#17a2b8',
        margin: "3px",
        color: 'white',
        fontWeight: "bold"
    };

    return (
        <>
            <Layout>
                {/* <!-- Content Header (Page header) --> */}
                <div class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1 class="m-0">Users</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><a href="#">Home</a></li>
                                    <li class="breadcrumb-item active">Users</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Main content --> */}
                <section class="content">
                    <div class="container-fluid">
                        <form method="post" onSubmit={handleSubmit}>
                            <div className="card card-info">
                                <div className="card-header">
                                    <h3 className="card-title">Add User</h3>
                                </div>
                                <input type="hidden" name="userID" value={userFormData.userID} />
                                <div className="card-body">

                                    <div className="form-group row">
                                        <div className="col-3">
                                            <label className="col-form-label">Employee Name <em className="error">*</em></label>
                                        </div>
                                        <div className="col-5">
                                            <input type="hidden" name="empNumber" value={userFormData.empNumber} />
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="empName"
                                                value={userFormData.empName}
                                                onChange={handleChange}
                                                placeholder="Type For Hints..." />
                                            {errors.empName && <div className="error">{errors.empName}</div>}
                                        </div>
                                    </div>
                                    {showSuggestions && (

                                        filteredSuggestions.length ? (
                                            filteredSuggestions.map((suggestion, index) => (
                                                <div className="form-group row"><div className="col-3"></div>
                                                    <div className="col-5" key={index} onClick={() => handleSuggestionClick(suggestion.emp_number, suggestion.first_name + ' ' + suggestion.last_name)} style={textStyle}>
                                                        {suggestion.first_name}
                                                    </div></div>
                                            ))
                                        ) : (
                                            <div className="form-group row"><div className="col-3"></div>
                                                <div className="col-5">
                                                    No suggestions available
                                                </div></div>
                                        )

                                    )}
                                    <div className="form-group row">

                                        <div className="col-3">
                                            <label className="col-form-label">Roles <em className="error">*</em></label>
                                        </div>
                                        <div className="col-5">
                                            <select
                                                className="form-control"
                                                name="role"
                                                value={userFormData.role}
                                                onChange={handleChange}>
                                                <option value="">--Select--</option>
                                                {
                                                    roles.map((role) => (
                                                        <option value={role.id}>{role.name}</option>
                                                    ))
                                                }
                                            </select>
                                            {errors.role && <div className="error">{errors.role}</div>}

                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-3">
                                            <label className="col-form-label">Username <em className="error">*</em></label>
                                        </div>
                                        <div className="col-5">
                                            <input
                                                className="form-control"
                                                type="text"
                                                name="userName"
                                                value={userFormData.userName}
                                                onChange={handleChange} />
                                            {errors.userName && <div className="error">{errors.userName}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-3">
                                            <label className="col-form-label">Status <em className="error">*</em></label>
                                        </div>
                                        <div className="col-5">
                                            <select
                                                className="form-control"
                                                name="status"
                                                value={userFormData.status}
                                                onChange={handleChange}>
                                                <option value="">--Select--</option>
                                                <option value="1">Enabled</option>
                                                <option value="0">Disbled</option>
                                            </select>
                                            {errors.status && <div className="error">{errors.status}</div>}

                                        </div>
                                    </div>
                                    {
                                        PId !== 0 && <div className="form-group row">
                                            <div className="col-3">
                                                <label className="col-form-label">Change Password</label>
                                            </div>
                                            <div className="col-5">
                                                <input
                                                    className="form-control1"
                                                    type="checkbox"
                                                    name="cpassword"
                                                    value=""
                                                    onChange={handleCheckbox} />

                                            </div>
                                        </div>
                                    }

                                    {
                                        isCheck && <><div className="form-group row">
                                            <div className="col-3">
                                                <label className="col-form-label">Password <em className="error">*</em></label>
                                            </div>
                                            <div className="col-5">
                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    name="password"                                    
                                                    onChange={handleChange} />
                                                {errors.password && <div className="error">{errors.password}</div>}
                                            </div>
                                        </div>
                                            <div className="form-group row">
                                                <div className="col-3">
                                                    <label className="col-form-label">Confirm Password <em className="error">*</em></label>
                                                </div>
                                                <div className="col-5">
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        name="confirmPassword"
                                                        onChange={handleChange} />
                                                    {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
                                                </div>
                                            </div></>
                                    }


                                </div>
                                <div className="card-footer">
                                    <button type="submit" className="btn btn-info">Save</button>
                                    <button type="button" className="btn btn-default ml-2" onClick={handleCancelBtn}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
                {/* <!-- /.content --> */}
            </Layout>
        </>
    );
};

export default AddUpdateUser;