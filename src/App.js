import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import './App.css';
import Layout from "./components/layout";
import Dashboard from "./components/layout/dashboard";
import Users from "./components/pages/users";
import Login from "./components/pages/login";
import Logout from "./components/logout";
import Protected from "./components/session/ProtectedRoute";
import Employees from "./components/pages/employee/employees";
import AddUpdateEmployee from "./components/pages/employee/saveupdateemployee";
import employees from "./components/pages/employee/employees";

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

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
