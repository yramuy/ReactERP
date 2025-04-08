import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from "../../layout";
import ContentHeader from "../../layout/content-header";
import { useDispatch } from 'react-redux';
import axios from 'axios';

const MyLeave = () => {

    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);
    const sessionToken = sessionStorage.getItem('token');
    const empNumber = sessionStorage.getItem('empNumber');
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const handleAddBtn = () => {
        navigate('/applyLeave');
    }

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        dispatch({ type: 'LOADING', payload: true });
        try {

            let token = `Bearer ${sessionToken}`;
            console.log(token);
            let myData = {
                empNumber: empNumber
            };
            let body = JSON.stringify(myData);

            let response = await axios.post("http://127.0.0.1:8000/api/my-leaves", body, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });

            triggerSnackbar();

            console.log("RESPONSE : ", response.data);

            if (response.data['status'] === 200) {
                setLeaves(response.data['leaves']);
                dispatch({ type: 'LOADING', payload: false });
                dispatch({ type: "MESSAGE", payload: response.data['message'] });
            }

        } catch (error) {
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    }

    const triggerSnackbar = () => {
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
    };

    return <>
        <Layout>

            <ContentHeader title="Leave" subtitle="My Leave" />

            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info">
                        <div className="card-header">
                            <h3 className="card-title">Employee List</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <button className="btn btn-success" onClick={handleAddBtn}>Apply Leave</button>
                                </div>
                                <div className="col-6">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                        name="query"
                                    />
                                </div>
                            </div>
                            <table style={{ width: '100%' }} id="example1" className="table table-bordered table-striped mt-2">
                                <thead>
                                    <tr>
                                        <th>Date Applied</th>
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Employee Name</th>
                                        <th>Leave Balance(Days)</th>
                                        <th>Leave Type</th>
                                        <th>No of Days</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.length > 0 ? (
                                        leaves.map((leave, index) => (
                                            <tr key={index}>
                                                <td>{leave.created_at}</td>
                                                <td>{leave.from_date}</td>
                                                <td>{leave.to_date}</td>
                                                <td>{leave.emp_name}</td>
                                                <td>{leave.leave_balance}</td>
                                                <td>{leave.leave_type}</td>
                                                <td>{leave.length_days}</td>
                                                <td>{leave.leave_status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">No records found!</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    </>
};

export default MyLeave;