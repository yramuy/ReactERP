import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from "../../layout";
import ContentHeader from "../../layout/content-header";

const MyLeave = () => {

    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);

    const handleAddBtn = () => {
        navigate('/applyLeave');
    }

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
                                        <th>Leave Date</th>
                                        <th>Employee Name</th>
                                        <th>Leave Balance(Days)</th>
                                        <th>Leave Type</th>
                                        <th>Number of Days</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.length > 0 ? (
                                        leaves.map((leave, index) => (
                                            <tr key={index}>
                                                <td>{leave.dateApplied}</td>
                                                <td>{leave.leaveDate}</td>
                                                <td>{leave.employeeName}</td>
                                                <td>{leave.leaveBalance}</td>
                                                <td>{leave.leaveType}</td>
                                                <td>{leave.numberOfDays}</td>
                                                <td>{leave.status}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No records found!</td>
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