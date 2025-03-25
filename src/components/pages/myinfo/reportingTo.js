import { useState } from "react";
import Layout from "../../layout";
import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { post } from "jquery";
import { useDispatch } from "react-redux";
import DeleteModal from "../deletemodal";

const ReportingTo = () => {

    const [svForm, setSvForm] = useState(false);
    const [show, setShow] = useState(true);
    const [soForm, setSoForm] = useState(false);
    const [report, setReport] = useState("");
    const { empID } = useParams();
    const [reportForm, setReportForm] = useState({
        reportID: 0,
        empNumber: "",
        empName: "",
        reportEmpNumber: "",
        reportType: "",
        reportingMethod: ""
    });
    const [employees, setEmployees] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const [supervisors, setSupervisors] = useState([]);
    const [subordinates, setSubordinates] = useState([]);
    const [btnText, setBtnText] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const name = queryParams.get("name");

    const handleAddBtn = (val) => {
        setSvForm(true);
        setShow(false);
        setReport(val);
        setReportForm({
            reportType: val
        });
        setBtnText(true);
    };

    const handleSvCnclBtn = () => {
        setSvForm(false);
        setShow(true);
        setReportForm({
            reportType: ""
        });
        setFilteredSuggestions([]);
        setBtnText(true);
    }

    useEffect(() => {
        fetchEmployeesByID();
        reportingEmployees();
    }, [empID]);

    const fetchEmployeesByID = async () => {
        let body = JSON.stringify({
            empID: empID
        });

        let response = await axios.post('http://127.0.0.1:8000/api/report-employees', body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data['status'] === 200) {
            setEmployees(response.data['employee']);
        }
    }

    const reportingEmployees = async () => {

        const fetchReportingEmployees = async (type, setter) => {
            dispatch({ type: 'LOADING', payload: true });
            let body = JSON.stringify({
                empID: empID,
                type: type
            });

            let response = await axios.post('http://127.0.0.1:8000/api/reporting-employees', body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.status === 200) {
                setter(response.data['reportings']);
                dispatch({ type: 'LOADING', payload: false });
            }
        };

        await fetchReportingEmployees('sup', setSupervisors);
        await fetchReportingEmployees('sub', setSubordinates);
    }

    console.log("Sup", supervisors);
    console.log("Sub", subordinates);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name == 'empName') {
            // Filter suggestions based on input value
            const filtered = employees.filter(employee =>
                employee.first_name.toLowerCase().includes(value.toLowerCase())
            );
            setShowSuggestions(true);
            setFilteredSuggestions(filtered);
        }

        setReportForm((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    // Handle suggestion click
    const handleSuggestionClick = (id, name) => {
        setReportForm({
            ...reportForm,
            empName: name,
            empNumber: id,
            reportEmpNumber: empID,
            reportID: 0

        });
        setFilteredSuggestions([]); // Clear suggestions
        setShowSuggestions(false);
    };

    const textStyle = {
        padding: "3px",
        backgroundColor: '#17a2b8',
        margin: "3px",
        color: 'white',
        fontWeight: "bold"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            dispatch({ type: "LOADING", payload: true });
            let response = await axios.post('http://127.0.0.1:8000/api/save-update-reportto', reportForm, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data['status'] === 200) {
                dispatch({ type: 'LOADING', payload: false });
                dispatch({ type: 'MESSAGE', payload: response.data['message'] });
                reportingEmployees();
                setSvForm(false);
                setShow(true);
                setReportForm({
                    reportType: ""
                });
            } else {
                dispatch({ type: 'LOADING', payload: false });
                dispatch({ type: 'MESSAGE', payload: response.data['message'] });
            }
        }
        console.log("Reporting Form : ", reportForm);
    }

    const validateForm = () => {
        let isValid = true;
        let errors = {};

        if (!reportForm.empName) {
            isValid = false;
            errors.empName = "Name is required";
        }
        if (!reportForm.reportingMethod) {
            isValid = false;
            errors.reportingMethod = "Reporting Method is required";
        }

        setErrors(errors);

        return isValid;
    }

    const handleEdit = (id, emp_sup, emp_sub, status, name, type) => {
        setSvForm(true);
        setShow(false);
        setReport(type);

        setReportForm({
            reportID: id,
            empNumber: type === "Subordinate" ? emp_sup : emp_sub,
            empName: name,
            reportEmpNumber: type === "Supervisor" ? emp_sup : emp_sub,
            reportType: type,
            reportingMethod: status
        });
        setBtnText(false);

        console.log("ID : ", id)
    }

    const handleDelete = (id) => {
        setDeleteShow(true);
        setReportForm({
            ...reportForm,
            reportID: id
        });
    }

    const deleteClose = () => {
        setDeleteShow(false);
    }

    const handleDeleteModal = async () => {
        let rID = reportForm.reportID;
        let response = await axios.delete(`http://127.0.0.1:8000/api/reportingTo/${rID}/delete`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data['status'] === 200) {
            setDeleteShow(false);
            reportingEmployees();
            dispatch({ type: 'MESSAGE', payload: response.data['message'] });
        } else {
            setDeleteShow(false);
            dispatch({ type: 'MESSAGE', payload: response.data['message'] });
        }
    }


    console.log(report + " : " + empID)

    return (
        <>
            <Layout>
                {/* <!-- Content Header (Page header) --> */}
                <div class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1 class="m-0">{name}</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><a href="#">Home</a></li>
                                    <li class="breadcrumb-item active">My Info</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Main content --> */}
                <section class="content">
                    <div class="container-fluid">
                        {
                            svForm && <form method="post" onSubmit={handleSubmit}>
                                <div className="card card-info">
                                    <div className="card-header">
                                        <h3 className="card-title">Add {reportForm.reportType}</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group row">
                                            <div className="col-3">
                                                <label className="col-form-label">Name <em className="error">*</em></label>
                                            </div>
                                            <div className="col-5">
                                                <input type="hidden" name="reportID" value={reportForm.reportID} />
                                                <input type="hidden" name="reportType" value={reportForm.reportType} />
                                                <input type="hidden" name="reportEmpNumber" value={reportForm.reportEmpNumber} />
                                                <input type="hidden" name="empNumber" value={reportForm.empNumber} />
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="empName"
                                                    value={reportForm.empName}
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
                                                <label className="col-form-label">Reporting Method <em className="error">*</em></label>
                                            </div>
                                            <div className="col-5">
                                                <select
                                                    className="form-control"
                                                    name="reportingMethod"
                                                    value={reportForm.reportingMethod}
                                                    onChange={handleChange}>
                                                    <option value="">--Select--</option>
                                                    <option value="1">Direct</option>
                                                    <option value="2">Indirect</option>
                                                </select>

                                                {errors.reportingMethod && <div className="error">{errors.reportingMethod}</div>}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="submit" className="btn btn-info">{btnText ? "Save" : "Update"}</button>
                                        <button type="button" className="btn btn-default ml-2" onClick={handleSvCnclBtn}>Cancel</button>
                                    </div>
                                </div>
                            </form>
                        }

                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Assigned Supervisors</h3>
                            </div>
                            <div className="card-body">
                                <div className="card-body">
                                    {show && <div className="row">
                                        <div className="col-4">
                                            <button className="btn btn-success" onClick={() => handleAddBtn('Supervisor')}>Add</button>

                                        </div>

                                    </div>}

                                    <table style={{ width: '100%' }} id="example1" className="table table-bordered table-striped mt-2">
                                        <thead>
                                            <tr>
                                                <th>Sno</th>
                                                <th>Name</th>
                                                <th>Reporting Method</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {

                                                supervisors.length > 0 ? (
                                                    supervisors.map((supervisor, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{supervisor.first_name + ' ' + supervisor.last_name}</td>
                                                            <td>{supervisor.status === 1 ? "Direct" : "Indirect"}</td>
                                                            <td>
                                                                <a href="#" className="btn btn-info" onClick={() => handleEdit(supervisor.id, supervisor.emp_sup, supervisor.emp_sub, supervisor.status, supervisor.first_name + ' ' + supervisor.last_name, 'Supervisor')}><i className="fas fa-edit"></i></a>
                                                                <a href="#" className="btn btn-danger m-1" onClick={() => handleDelete(supervisor.id)}><i className="fas fa-trash"></i></a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : <tr>
                                                    <td colSpan="5">No records found!</td>
                                                </tr>
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="card card-info">
                            <div className="card-header">
                                <h3 className="card-title">Assigned Subordinates</h3>
                            </div>
                            <div className="card-body">
                                <div className="card-body">
                                    {show && <div className="row">
                                        <div className="col-4">
                                            <button className="btn btn-success" onClick={() => handleAddBtn('Subordinate')}>Add</button>

                                        </div>
                                    </div>
                                    }

                                    <table style={{ width: '100%' }} id="example1" className="table table-bordered table-striped mt-2">
                                        <thead>
                                            <tr>
                                                <th>Sno</th>
                                                <th>Name</th>
                                                <th>Reporting Method</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                subordinates.length > 0 ? (
                                                    subordinates.map((subordinate, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{subordinate.first_name + ' ' + subordinate.last_name}</td>
                                                            <td>{subordinate.status === 1 ? "Direct" : "Indirect"}</td>
                                                            <td>
                                                                <a href="#" className="btn btn-info" onClick={() => handleEdit(subordinate.id, subordinate.emp_sup, subordinate.emp_sub, subordinate.status, subordinate.first_name + ' ' + subordinate.last_name, 'Subordinate')}><i className="fas fa-edit"></i></a>
                                                                <a href="#" className="btn btn-danger m-1" onClick={() => handleDelete(subordinate.id)}><i className="fas fa-trash"></i></a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : <tr>
                                                    <td colSpan="5">No records found!</td>
                                                </tr>
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
                <DeleteModal deleteShow={deleteShow} deleteClose={deleteClose} handleDeleteModal={handleDeleteModal} />
            </Layout>
        </>
    );

};

export default ReportingTo;