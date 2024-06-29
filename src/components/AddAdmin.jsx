import React, { useState } from "react";

// CSS styles
const styles = {
  content: {
    padding: "20px",
    marginTop: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
  },
  form: {
    marginBottom: "20px",
  },
};

// AdminTable component to display the admins
function AdminTable({ adminList }) {
  return (
    <div style={styles.content}>
      <h2>Admin List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {adminList.map((admin, index) => (
            <tr key={index}>
              <th>{admin.id}</th>
              <td>{admin.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AddAdminForm({ onAddAdmin }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [adminList, setAdminList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Call backend API to add admin
    fetch('http://localhost:3000/api/add-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add admin');
        }
        return response.json(); // Assuming the response returns the added admin data
      })
      .then(data => {
        // Update adminList with the added admin data
        setAdminList([...adminList, data]);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setErrorMessage("");
      })
      .catch(error => {
        console.error('Error adding admin:', error);
        setErrorMessage('Failed to add admin. Please try again.'); // Update error message as needed
      });
  };

  return (
    <div className="content">
      <div style={styles.form} className="add-admin-form">
        <h2>Add New Admin</h2>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="form-submit">
            Add Admin
          </button>
        </form>
      </div>
      {/* Render AdminTable component */}
      <AdminTable adminList={adminList} />
    </div>
  );
}

export default AddAdminForm;
