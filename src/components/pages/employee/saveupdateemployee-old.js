import React, { Component } from "react";
import Layout from "../../layout";
import { connect } from "react-redux";
import axios from "axios";
import { Redirect, withRouter } from "react-router-dom";

class AddUpdateEmployee extends Component {
    

    constructor(props) {
        super(props);        

        this.state = {
            employeeFormData: {
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
            },
            errors: {},
            loading: false,
            showSnackbar: false,
            redirect: false,
            empID: this.props.id
        };

        // console.log("EMP ID: ", this.props.id);
    }
    

    handleChange = (e) => {

        const { name, value, type, checked, files } = e.target;
        this.setState((prevState) => ({
            employeeFormData: {
                ...prevState.employeeFormData,
                [name]: type === 'checkbox' ? (checked ? 1 : 0) : type === 'file' ? files[0] : value

            }
        }));
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        if (this.validateForm()) {
            console.log(this.state.employeeFormData);
            // const { dispatch } = this.props;
            // dispatch({ type: 'LOADING', payload: true });
            this.setState({ loading: true });

            let response = await axios.post('http://127.0.0.1:8000/api/create-update-employee', this.state.employeeFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            this.triggerSnackbar();
            if (response.data['status'] === 200) {

                window.location.href = "/employees";

                // redirect('/employees');
                // dispatch({ type: "RELOAD", payload: true });
                // dispatch({ type: 'STATUS', payload: true });
                // dispatch({ type: "ID", payload: 0 });

                // this.clearFormData();
                // dispatch({ type: 'LOADING', payload: false });
                // dispatch({ type: "MESSAGE", payload: response.data['message'] });
            }

            console.log(response.data['message']);

        }


    }

    triggerSnackbar = () => {
        this.setState({ showSnackbar: true });
        setTimeout(() => {
            this.setState({ showSnackbar: false });
        }, 3000);
    }

    validateForm = () => {
        const { employeeFormData } = this.state;
        let isValid = true;
        let errors = {};

        // if (!employeeFormData.first_name) {
        //     isValid = false;
        //     errors.first_name = 'First Name is required';
        // }
        // if (!employeeFormData.last_name) {
        //     isValid = false;
        //     errors.last_name = "Last Name is required";
        // }
        // if (!employeeFormData.employee_id) {
        //     isValid = false;
        //     errors.employee_id = "Employee ID is required";
        // }
        // if (!employeeFormData.dob) {
        //     isValid = false;
        //     errors.dob = "DOB is required";
        // }
        // if (!employeeFormData.email) {
        //     isValid = false;
        //     errors.email = "Email is required";
        // }
        // if (!employeeFormData.mobile_number) {
        //     isValid = false;
        //     errors.mobile_number = "Mobile Number is required";
        // }
        // if (employeeFormData.mobile_number.length > 12) {
        //     isValid = false;
        //     errors.mobile_number = "Mobile Number should be less than 13 digits";
        // }
        // if (employeeFormData.mobile_number.length !== 0 && employeeFormData.mobile_number.length < 9) {
        //     isValid = false;
        //     errors.mobile_number = "Mobile Number should be greater than 10 digits";
        // }

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
                errors[field] = message;
            }
        });

        if (employeeFormData.mobile_number) {
            const mobileLength = employeeFormData.mobile_number.length;
            if (mobileLength > 12) {
                isValid = false;
                errors.mobile_number = "Mobile Number should be less than 13 digits";
            }
            if (mobileLength < 9) {
                isValid = false;
                errors.mobile_number = "Mobile Number should be greater than 10 digits";
            }
        }

        this.setState({ errors });

        return isValid;
    }

    handleCancel = () => {
        window.location.href = "/employees";
    }

    render() {

        const { employeeFormData, errors } = this.state;

        return (
            <Layout>
                <div class="content-header">
                    <div class="container-fluid">
                        {/* {loading && <div class="loader"></div>} */}
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1 class="m-0">Employees {this.state.empID}</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><a href="#">Home</a></li>
                                    <li class="breadcrumb-item active">Employees</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                <section class="content">
                    <div class="container-fluid">

                        <form method="post" onSubmit={this.handleSubmit} encType="multipart/form-data">
                            <div class="card card-info">
                                <div class="card-header">
                                    <h3 class="card-title">Add Employee</h3>
                                </div>
                                {/* <!-- /.card-header --> */}
                                <div class="card-body">

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
                                                onChange={this.handleChange}
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
                                                onChange={this.handleChange}
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
                                                onChange={this.handleChange}
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
                                                onChange={this.handleChange}
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
                                                onChange={this.handleChange}
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
                                                onChange={this.handleChange}
                                            />
                                            {errors.mobile_number && <div className="error">{errors.mobile_number}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-2">
                                            <label className="col-form-label">Gender</label>
                                        </div>
                                        <div className="col-4">
                                            <div class="form-check form-check-inline">
                                                <input
                                                    class="form-check-input"
                                                    type="radio"
                                                    name="gender"
                                                    id="male"
                                                    value="male"
                                                    checked={employeeFormData.gender === "male"}
                                                    onChange={this.handleChange}
                                                />

                                                <label class="form-check-label" for="male">Male</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input
                                                    class="form-check-input"
                                                    type="radio"
                                                    name="gender"
                                                    id="female"
                                                    value="female"
                                                    checked={employeeFormData.gender === 'female'}
                                                    onChange={this.handleChange}
                                                />
                                                <label class="form-check-label" for="female">Female</label>
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
                                                onChange={this.handleChange}>
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
                                                className="form-control"
                                                name="profile_pic"
                                                accept="image/*"
                                                onChange={this.handleChange}
                                            />
                                            {errors.profile_pic && <div className="error">{errors.profile_pic}</div>}
                                        </div>
                                        <div className="col-2">
                                            <label className="col-form-label">Is Active</label>
                                        </div>
                                        <div className="col-4">
                                            <div class="form-check">
                                                <input
                                                    class="form-check-input"
                                                    type="checkbox"
                                                    name="is_active"
                                                    value={employeeFormData.is_active}
                                                    id="option1"
                                                    checked={employeeFormData.is_active}
                                                    onChange={this.handleChange}
                                                />
                                                {errors.is_active && <div className="error">{errors.is_active}</div>}
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                {/* <!-- /.card-body --> */}
                                <div className="card-footer text-right">
                                    <button type="submit" class="btn btn-info mr-3">Save</button>
                                    <button type="button" class="btn btn-secondary" onClick={this.handleCancel}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section >

            </Layout >
        );
    }
}

export default AddUpdateEmployee;