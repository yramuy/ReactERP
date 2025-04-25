import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Layout from "../../layout";
import ContentHeader from "../../layout/content-header";
import { useDispatch } from 'react-redux';
import axios from 'axios';

const LeaveList = () => {

    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);
    const sessionToken = sessionStorage.getItem('token');
    const empNumber = sessionStorage.getItem('empNumber');
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [leaveIds, setLeaveIds] = useState([]);

    const handleAddBtn = () => {
        navigate('/applyLeave');
    }

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {

        setLoading(true);  // Setting loading state at the start
        dispatch({ type: 'LOADING', payload: true });  // Dispatching loading state

        // try {

        let token = `Bearer ${sessionToken}`;

        if (!token) {
            console.error('Token is missing or invalid');
            return;
        }

        const myData = {
            empNumber: empNumber,
        };

        const body = JSON.stringify(myData);

        // console.log("Request body:", body);
        // console.log("Authorization token:", token);

        const response = await axios.post('http://127.0.0.1:8000/api/leave-list', body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        });

        console.log('Server response status: ', response.status);

        triggerSnackbar();

        if (response.status === 200) {
            setLeaves(response.data.leaves);
            dispatch({ type: 'MESSAGE', payload: response.data.message });
            dispatch({ type: 'LOADING', payload: false });
            setLoading(false);   // Dispatching loading state
        } else {
            setLeaves([]);
            dispatch({ type: 'MESSAGE', payload: response.data.message });
            dispatch({ type: 'LOADING', payload: false });  // Dispatching loading state
            setLoading(false);
        }



        // Handle all status codes
        // if (response.status >= 200 && response.status < 500) {
        //     // Success response
        //     console.log('RESPONSE : ', response.data);
        //     if (response.data.status === 200) {
        //         setLeaves(response.data.leaves);
        //         dispatch({ type: 'MESSAGE', payload: response.data.message });
        //     } else {
        //         setLeaves([]);
        //         dispatch({ type: 'MESSAGE', payload: response.data.message });
        //     }

        //     dispatch({ type: 'LOADING', payload: false });  // Dispatching loading state
        // } else {
        //     // Handle other status codes (e.g., 4xx, 5xx)
        //     dispatch({ type: 'MESSAGE', payload: `Error: ${response.status} - ${response.statusText}` });
        // }

        // } catch (error) {
        //     console.error('Error fetching leaves', error);

        //     if (error.response) {
        //         // Handle server errors
        //         console.error('Server responded with status:', error.response.status);
        //         console.error('Error response:', error.response.data);
        //         dispatch({ type: 'MESSAGE', payload: `Server Error: ${error.response.status} - ${error.response.statusText}` });
        //         dispatch({ type: 'LOADING', payload: false });  // Dispatching loading state
        //         setLoading(false);
        //     } else if (error.request) {
        //         // Handle case where no response was received
        //         console.error('No response received from server');
        //         dispatch({ type: 'MESSAGE', payload: 'No response from server. Please try again later.' });
        //         // navigate('/login');
        //         dispatch({ type: 'LOADING', payload: false });  // Dispatching loading state
        //         setLoading(false);
        //     } else {
        //         // Handle unexpected errors
        //         console.error('Error setting up the request:', error.message);
        //         dispatch({ type: 'MESSAGE', payload: 'An error occurred while making the request.' });
        //         // navigate('/login');
        //         dispatch({ type: 'LOADING', payload: false });  // Dispatching loading state
        //         setLoading(false);
        //     }
        // }
    };


    const triggerSnackbar = () => {
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000);
    };

    const handleAction = (leaveId, actionValue) => {
        // Create a new item object with leaveId and actionId
        const newItem = { leaveId: leaveId, actionId: actionValue };

        // Update the state, checking if the leaveId already exists
        setLeaveIds((prevItem) => {
            // Find if the leaveId already exists in the previous state
            const existingItemIndex = prevItem.findIndex(item => item.leaveId === leaveId);

            // If the leaveId exists, update the actionId for that leaveId
            if (existingItemIndex !== -1) {
                const updatedItems = [...prevItem];
                updatedItems[existingItemIndex] = newItem; // Update the actionId
                return updatedItems;
            }

            // If the leaveId doesn't exist, add the new item to the state
            return [...prevItem, newItem];
        });

        console.log('Leave Id', leaveId);
        console.log('Action Value', actionValue);
    };

    const handleSave = async () => {
        setLoading(true);  // Setting loading state at the start
        dispatch({ type: 'LOADING', payload: true });  // Dispatching loading state
        const body = {
            leaveIds: leaveIds,
            empNumber: empNumber
        };

        const encodeBody = JSON.stringify(body);

        try {

            let token = `Bearer ${sessionToken}`;
            console.log(token);

            let response = await axios.post("http://127.0.0.1:8000/api/leave-actions", encodeBody, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });

            triggerSnackbar();

            console.log("leave-actions RESPONSE : ", response.data);

            console.log("Response Status : ", response.status);

            if (response.status >= 200 || response.status < 500) {
                setLoading(false);  // Setting loading state at the start
                dispatch({ type: 'LOADING', payload: false });  // Dispatching loading state
                dispatch({ type: "RELOAD", payload: true });
                dispatch({ type: 'STATUS', payload: true });
                dispatch({ type: "ID", payload: 0 });
                dispatch({ type: 'LOADING', payload: false });
                dispatch({ type: "MESSAGE", payload: response.data['message'] });
                fetchLeaves();
            }

        } catch (error) {
            console.error("Error submitting form", error);
        }

        console.log("body ", body);
    }


    console.log("Leave Ids", leaveIds);

    return <>
        <Layout>
            <ContentHeader title="Leave" subtitle="Leave List" />
            <section className="content">
                <div className="container-fluid">
                    <div className="card card-info">
                        <div className="card-header">
                            <h3 className="card-title">Subordinate Leave List</h3>
                        </div>
                        <div className="card-body">

                            <table style={{ width: '100%' }} id="example1" className="table table-bordered table-striped mt-2">
                                <thead>
                                    <tr>
                                        <th>Date Applied</th>
                                        <th>From Date</th>
                                        <th>To Date</th>
                                        <th>Name</th>
                                        <th>Leave Type</th>
                                        <th>No of Days</th>
                                        <th>Status</th>
                                        <th>Actions</th>
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
                                                <td>{leave.leave_type}</td>
                                                <td>{leave.length_days}</td>
                                                <td>{leave.leave_status}</td>
                                                <td>
                                                    <select className="form-control"
                                                        name='actions'
                                                        onChange={(e) => handleAction(leave.id, e.target.value)}>
                                                        <option value="0">--Select--</option>
                                                        <option value="2">Approve</option>
                                                        <option value="3">Reject</option>
                                                        <option value="4">Cancel</option>
                                                    </select>
                                                </td>
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
                        <div className="card-footer">
                            <button type="submit" className="btn btn-success" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    </>

};

export default LeaveList;