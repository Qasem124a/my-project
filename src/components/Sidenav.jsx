import React from "react";
import { Link } from "react-router-dom";

export default function Sidenav({ onLogout }) {
  return (
    <header>
      <div className="navbar">
        <h2>Attendance System</h2>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/add-user" className="nav-link">Add New User</Link>
          <Link to="/manage" className="nav-link">Manage</Link>
          <Link to="/contact-us" className="nav-link">Contact Us</Link>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
      </div>
    </header>
  );
}
