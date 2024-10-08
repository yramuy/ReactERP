import React from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import './App.css';
import Layout from "./components/layout";
import Dashboard from "./components/layout/dashboard";
import Users from "./components/pages/users";
import Login from "./components/pages/login";
import Logout from "./components/logout";
import Protected from "./components/session/ProtectedRoute";

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/" element={<Protected Component={Dashboard} />} />
          <Route path="/users" element={<Protected Component={Users} />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
