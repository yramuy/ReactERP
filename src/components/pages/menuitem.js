import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "../snackbar";
import SaveUpdateMenuItem from "./saveupdatemenuitem";
import DeleteModal from "./deletemodal";


const MenuItems = () => {
    const dispatch = useDispatch();
    const [deleteShow, setDeleteShow] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchItem, setSearchItem] = useState("");

    var menuitems = useSelector((state) => {
        return state.moduleData;
    });

    let status = menuitems['status'];

    const triggerSnackbar = () => {
        setShowSnackbar(true);
        setTimeout(() => {
            setShowSnackbar(false);
        }, 3000); // Adjust the duration as needed
    };

    useEffect(() => {
        GetMenuitems(searchItem);
    }, [status]);

    const GetMenuitems = async (searchItem) => {
        const body = JSON.stringify({
            item: searchItem
        });
        console.log("searchItem", searchItem);
        dispatch({ type: "STATUS", payload: false });
        let response = await axios.post('http://127.0.0.1:8000/api/menuitems', body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data['status'] === 200) {
            dispatch({ type: "DATA", payload: response.data['menuItems'] });
        }
    }

    const handleEdit = (id) => {
        dispatch({ type: "ID", payload: id });

    }

    const handleDelete = (id) => {
        setDeleteShow(true);
        dispatch({ type: "ID", payload: id });
    }

    const handleAdd = () => {
        dispatch({ type: "ID", payload: 0 });
    }

    const deleteClose = () => {
        setDeleteShow(false);
        dispatch({ type: "ID", payload: 0 });
    }

    let PId = menuitems['id'];

    const handleDeleteModal = async () => {
        dispatch({ type: 'LOADING', payload: true });
        setDeleteShow(false);
        let response = await axios.delete(`http://127.0.0.1:8000/api/menuItems/${PId}/delete`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        triggerSnackbar();

        if (response.data['status'] === 200) {
            dispatch({ type: "RELOAD", payload: true });
            dispatch({ type: "ID", payload: 0 });
            dispatch({ type: 'LOADING', payload: false });
            dispatch({ type: 'STATUS', payload: true });
            dispatch({ type: "MESSAGE", payload: response.data['message'] });
        }

    }

    console.log("RESPONSE", menuitems)

    const style = {
        height: '50em',
        overflowY: 'scroll'
    };

    let sno = 1;

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
        GetMenuitems(e.target.value);
    }

    console.log("Search", searchItem);

    return (
        <>
            <div className="col-8" style={style}>
                <div class="card card-info">
                    <div class="card-header">
                        <h3 class="card-title">Menu Item List</h3>
                    </div>
                    {/* <!-- /.card-header --> */}
                    <div class="card-body">
                        <div className="row">
                            <div className="col-6">
                                <button class="btn btn-success" onClick={handleAdd}>New</button>
                            </div>
                            <div className="col-6">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Search..."
                                    name="query"
                                    value={searchItem}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>


                        {/* <div class="input-group">
                            <input type="text" class="form-control" placeholder="Search..." name="query" />
                            <div class="input-group-append">
                                <button class="btn btn-primary" type="submit">Search</button>
                            </div>
                        </div> */}
                        <table style={{ width: '100%' }} id="example1" class="table table-bordered table-striped mt-2">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Mnenu Name</th>
                                    <th>Parent Menu</th>
                                    <th>Screen</th>
                                    {/* <th>Url</th> */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {

                                    menuitems['data'].map((item) => (
                                        <tr key={item['id']}>
                                            <td>{sno++}</td>
                                            <td>{item['menu_name']}</td>
                                            <td>{item['parent'] ?? "--"}</td>
                                            <td>{item['screen_name']}</td>
                                            {/* <td>{item['url']}</td> */}
                                            <td>
                                                <a href="#" class="btn btn-info" onClick={() => handleEdit(item['id'])}><i class="fas fa-edit"></i></a>
                                                <a href="#" class="btn btn-danger m-1" onClick={() => handleDelete(item['id'])}><i class="fas fa-trash"></i></a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    {/* <!-- /.card-body --> */}
                </div>

            </div>
            <Snackbar show={showSnackbar} message={menuitems['message']} duration={3000} />

            <SaveUpdateMenuItem />

            <DeleteModal deleteShow={deleteShow} deleteClose={deleteClose} handleDeleteModal={handleDeleteModal} />
        </>
    );
};

export default MenuItems;