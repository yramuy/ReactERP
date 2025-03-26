import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import './App.css';
import Layout from "./components/layout";
import Dashboard from "./components/layout/dashboard";
import Users from "./components/pages/user/users";
import Login from "./components/pages/login";
import Logout from "./components/logout";
import Protected from "./components/session/ProtectedRoute";
import Employees from "./components/pages/employee/employees";
import AddUpdateEmployee from "./components/pages/employee/saveupdateemployee";
import employees from "./components/pages/employee/employees";
import AddUpdateUser from "./components/pages/user/addUpdateUser";
import ReportingTo from "./components/pages/myinfo/reportingTo";
import ApplyLeave from "./components/pages/leave/applyleave";
import MyLeave from "./components/pages/leave/myleaves";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<Protected Component={Dashboard} />} />
          <Route path="/users" element={<Protected Component={Users} />} />
          <Route path="/employees" element={<Protected Component={employees} />} />
          <Route path="/add-employee" element={<Protected Component={AddUpdateEmployee} />} />
          <Route path="/add-employee/:empID" element={<Protected Component={AddUpdateEmployee} />} />
          <Route path="/add-user" element={<Protected Component={AddUpdateUser} />} />
          <Route path="/add-user/:userID" element={<Protected Component={AddUpdateUser} />} />
          <Route path="/reporting/:empID" element={<Protected Component={ReportingTo} />} />
          <Route path="/applyLeave" element={<Protected Component={ApplyLeave} />} />
          <Route path="/leaves" element={<Protected Component={MyLeave} />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
