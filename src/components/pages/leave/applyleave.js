import axios from "axios";
import Layout from "../../layout";
import ContentHeader from "../../layout/content-header";
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';


const ApplyLeave = () => {

    const [leaveFormData, setLeaveFormData] = useState({
        leaveType: ''
    });
    const [leaveTypes, setLeaveTypes] = useState([]);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        setLeaveFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
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


    const handleSubmit = () => {

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

                                        </div>
                                    </div>

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