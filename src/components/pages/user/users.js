import { useEffect, useState } from "react";
import Layout from "../../layout";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../deletemodal";

const Users = () => {

    const [users, setUsers] = useState([]);
    const sessionToken = sessionStorage.getItem('token');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        dispatch({ type: "LOADING", payload: true });
        let url = "http://127.0.0.1:8000/api/users";

        // Make sure your token is correctly set
        let token = `Bearer ${sessionToken}`;

        let response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        console.log("Response Status : ", response.status)

        // Check if the request was successful
        if (response.status === 200 && response.data['statusCode'] === 200) {
            setUsers(response.data['users']);
            dispatch({ type: "MESSAGE", payload: response.data['message'] });
            dispatch({ type: "LOADING", payload: false });
        } else {
            setUsers(users);
            dispatch({ type: "MESSAGE", payload: response.data['message'] });
            dispatch({ type: "LOADING", payload: false });
        }
    }

    const handleAddBtn = () => {
        dispatch({ type: "ID", payload: 0 });
        navigate('/add-user');
    };

    const handleEdit = (id) => {
        dispatch({ type: "ID", payload: id });
        navigate(`/add-user/${id}`);
        console.log(id)
    };

    const handleDelete = (id) => {
        dispatch({ type: "ID", payload: id });
        setShow(true);
    };

    const deleteClose = () => {
        setShow(false);
    }

    let userResponse = useSelector((state) => {
        return state.moduleData;
    });

    let userId = userResponse['id'];

    const handleDeleteModal = async () => {
        const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}/delete`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data['status'] === 200) {
            fetchUsers();
            setShow(false);
        }

        dispatch({ type: "MESSAGE", payload: response.data['message'] });
    }

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
                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Users List</h3>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6">
                                        <button className="btn btn-success" onClick={handleAddBtn}>Add User</button>
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
                                            <th>User ID</th>
                                            <th>User Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            users.map((user, index) => (
                                                <tr key={user.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{user.id}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.roleName}</td>
                                                    <td>
                                                        <a href="#" className="btn btn-info" onClick={() => handleEdit(user.id)}><i className="fas fa-edit"></i></a>
                                                        <a href="#" className="btn btn-danger m-1" onClick={() => handleDelete(user.id)}><i className="fas fa-trash"></i></a>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
                <DeleteModal deleteShow={show} deleteClose={deleteClose} handleDeleteModal={handleDeleteModal} />
                {/* <!-- /.content --> */}
            </Layout>
        </>
    );
};

export default Users;