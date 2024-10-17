import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "../../layout";
import axios from 'axios'; // Make sure to import axios if you plan to fetch data
import { useDispatch } from 'react-redux';
import DeleteModal from '../deletemodal';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [deleteShow, setDeleteShow] = useState(false);
    const [empID, setEmpID] = useState("");

    useEffect(() => {
        loadEmplyees();
    }, []);

    const loadEmplyees = async () => {
        dispatch({ type: 'LOADING', payload: true });
        const response = await axios.get("http://127.0.0.1:8000/api/employees", {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data['status'] === 200) {
            setEmployees(response.data['employees']);
            dispatch({ type: 'LOADING', payload: false });

        }
    }

    const handleAddBtn = () => {
        dispatch({ type: "ID", payload: 0 });
        navigate('/add-employee');
    };

    const handleEdit = (id) => {
        dispatch({ type: "ID", payload: id });
        navigate(`/add-employee/${id}`);
    };

    const handleDelete = (id) => {
        dispatch({ type: "ID", payload: id });
        setEmpID(id);
        setDeleteShow(true);
    }

    const handleDeleteModal = async () => {
        const response = await axios.get(`http://127.0.0.1:8000/api/employees/${empID}/delete`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data['status'] === 200) {
            loadEmplyees();
            setDeleteShow(false);
        }

        dispatch({ type: "MESSAGE", payload: response.data['message'] });
    }

    const deleteClose = () => {
        setDeleteShow(false);
    }

    console.log("Employees", employees);

    return (
        <>
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
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Employee List</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6">
                                        <button className="btn btn-success" onClick={handleAddBtn}>Add Employee</button>
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
                                            <th>Sno</th>
                                            <th>Emp ID</th>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Position</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            employees.map((item, index) => {

                                                let position = "";
                                                if (item.position === 1) {
                                                    position = "Software Developer"
                                                } else if (item.position === 2) {
                                                    position = "Mobile Developer"
                                                } else {
                                                    position = "QA"
                                                }

                                                return (
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.employee_id}</td>
                                                        <td>{item.first_name + ' ' + item.last_name}</td>
                                                        <td>{item.mobile_number}</td>
                                                        <td>{item.email}</td>
                                                        <td>{position}</td>
                                                        <td>
                                                            <a href="#" className="btn btn-info" onClick={() => handleEdit(item.emp_number)}><i className="fas fa-edit"></i></a>
                                                            <a href="#" className="btn btn-danger m-1" onClick={() => handleDelete(item.emp_number)}><i className="fas fa-trash"></i></a>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
                <DeleteModal deleteShow={deleteShow} deleteClose={deleteClose} handleDeleteModal={handleDeleteModal} />
            </Layout>
        </>
    );
};

export default Employees;
