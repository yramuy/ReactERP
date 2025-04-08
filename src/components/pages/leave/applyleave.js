import axios from "axios";
import Layout from "../../layout";
import ContentHeader from "../../layout/content-header";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";


const ApplyLeave = () => {

    const loginEmployee = sessionStorage.getItem('empNumber');

    const [leaveFormData, setLeaveFormData] = useState({
        leaveId: '0',
        leaveType: '',
        from_date: '',
        to_date: '',
        duration_type: '0',
        session_type: '0',
        comment: '',
        length_days: '0',
        length_hours: '0',
        emp_number: loginEmployee
    });
    const [leaveTypes, setLeaveTypes] = useState([]);
    const dispatch = useDispatch();
    const [duration, setDuration] = useState(false);
    const [session, setSession] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const sessionToken = sessionStorage.getItem('token');
    const [loading, setLoading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setLeaveFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'to_date') {
            calculateDateDifference(leaveFormData.from_date, value);
        }
    }

    useEffect(() => {
        loadLeaveTypes();
    }, []);

    const loadLeaveTypes = async () => {
        dispatch({ type: 'LOADING', payload: true });
        const response = await axios.get("http://127.0.0.1:8000/api/leave-types", {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data['status'] === 200) {
            setLeaveTypes(response.data['leaveTypes']);
            dispatch({ type: 'LOADING', payload: false });

        }
    }

    const hanldeFromDate = (e) => {
        setLeaveFormData((prevState) => ({
            ...prevState,
            from_date: e.target.value,
            to_date: e.target.value
        }));
        setDuration(true);
        calculateDateDifference(e.target.value, e.target.value);
    };

    const calculateDateDifference = (fromDate, toDate) => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffInMs = end - start;
        let diff = 0;

        diff = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        diff += 1;

        setLeaveFormData((prevState) => ({
            ...prevState,
            length_days: diff

        }));
        console.log("Date Difference:", diff, "days");
    };



    const handleDuration = (e) => {

        setLeaveFormData((prevState) => ({
            ...prevState,
            duration_type: e.target.value
        }));

        console.log(e.target.value)
        if (e.target.value === '2') {
            setSession(true);
        } else {
            setSession(false);
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setLoading(true);

            callingApplyLeaveApi();
        }
    };

    const callingApplyLeaveApi = async () => {
        try {
            console.log(leaveFormData);
            let token = `Bearer ${sessionToken}`;
            console.log(token);

            let response = await axios.post("http://127.0.0.1:8000/api/apply-leave", leaveFormData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });

            triggerSnackbar();

            console.log("RESPONSE : ", response.data);

            if (response.data['status'] === 200) {
                dispatch({ type: "RELOAD", payload: true });
                dispatch({ type: 'STATUS', payload: true });
                dispatch({ type: "ID", payload: 0 });
                dispatch({ type: 'LOADING', payload: false });
                dispatch({ type: "MESSAGE", payload: response.data['message'] });
                navigate("/leaves");
            }

        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
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

        let requiredFields = [
            { field: 'leaveType', message: "Leave type required" },
            { field: 'from_date', message: "From Date required" },
            { field: 'to_date', message: "To Date required" },
            { field: 'duration_type', message: "Duration required" },
        ];

        requiredFields.forEach(({ field, message }) => {
            if (!leaveFormData[field]) {
                isValid = false;
                validationErrors[field] = message;
            }
        });

        if (leaveFormData.to_date < leaveFormData.from_date) {
            isValid = false;
            validationErrors.to_date = "Date should be greater than from date";
        }

        setErrors(validationErrors);

        return isValid;
    }

    const handleCancel = () => {
        navigate('/leaves');
    }


    return (
        <>
            <Layout>
                <ContentHeader title="Leave" subtitle="Apply Leave" />

                <section class="content">
                    <div class="container-fluid">
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Apply Leave</h3>
                            </div>
                            <form method="post" onSubmit={handleSubmit}>
                                <div className="card-body">

                                    <div className="form-group row">
                                        <div className="col-2">
                                            <label className="col-form-label">Leave Type</label>
                                        </div>
                                        <div className="col-4">
                                            <select
                                                className="form-control"
                                                name="leaveType"
                                                value={leaveFormData.leaveType}
                                                onChange={handleChange}>
                                                <option value="">--Select--</option>
                                                {
                                                    leaveTypes.map((type) => (
                                                        <option value={type.id}>{type.name}</option>

                                                    ))
                                                }
                                            </select>
                                            {errors.leaveType && <div className="error">{errors.leaveType}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-2">
                                            <label className="col-form-label">From Date</label>
                                        </div>
                                        <div className="col-4">
                                            <input
                                                type="date"
                                                name="from_date"
                                                className="form-control"
                                                value={leaveFormData.from_date}
                                                onChange={hanldeFromDate}
                                            />
                                            {errors.from_date && <div className="error">{errors.from_date}</div>}
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-2">
                                            <label className="col-form-label">To Date</label>
                                        </div>
                                        <div className="col-4">
                                            <input
                                                type="date"
                                                name="to_date"
                                                className="form-control"
                                                value={leaveFormData.to_date}
                                                onChange={handleChange}
                                            />
                                            {errors.to_date && <div className="error">{errors.to_date}</div>}
                                        </div>
                                    </div>
                                    {
                                        duration && (<div className="form-group row">
                                            <div className="col-2">
                                                <label className="col-form-label">Duration</label>
                                            </div>
                                            <div className="col-2">
                                                <select
                                                    className="form-control"
                                                    name="duration_type"
                                                    value={leaveFormData.duration_type}
                                                    onChange={handleDuration}>
                                                    <option value="">--Select--</option>
                                                    <option value='1'>Full Day</option>
                                                    <option value='2'>Half Day</option>
                                                </select>

                                            </div>

                                            {
                                                session && (
                                                    <div className="col-2">
                                                        <select
                                                            className="form-control"
                                                            name="session_type"
                                                            value={leaveFormData.session_type}
                                                            onChange={handleChange}>
                                                            <option value="">--Select--</option>
                                                            <option value='1'>Morning</option>
                                                            <option value='2'>Afternoon</option>
                                                        </select>

                                                    </div>)
                                            }

                                            {errors.duration_type && <div className="error">{errors.duration_type}</div>}

                                        </div>)
                                    }


                                    <div className="form-group row">
                                        <div className="col-2">
                                            <label className="col-form-label">Comment</label>
                                        </div>
                                        <div className="col-4">
                                            <textarea rows='3'
                                                name="comment"
                                                className="form-control"
                                                value={leaveFormData.comment}
                                                onChange={handleChange}>

                                            </textarea>

                                        </div>
                                    </div>

                                </div>

                                <div className="card-footer">
                                    <button type="submit" className="btn btn-success">Apply</button>
                                    <button type="button" className="btn btn-default ml-2" onClick={handleCancel}>Cancel</button>
                                </div>

                            </form>

                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default ApplyLeave;