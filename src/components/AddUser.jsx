import React, { useState } from "react";

export default function AddUser() {
  const [userData, setUserData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    position: '',
    department: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    fetch('https://attendance-system-a0g5.onrender.com/api/employee/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setSuccessMessage('User added successfully!');
        setUserData({
          employee_id: '',
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          phone: '',
          position: '',
          department: '',
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('Failed to add user. Please try again.');
      });
  };

  return (
    <div className="content">
      <form className="add-user-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="employeeId">Employee ID:</label>
          <input
            type="text"
            id="employee_id"
            name="employee_id"
            value={userData.employee_id}
            onChange={handleChange}
            placeholder="Enter Employee ID"
            required
          />
        </div>
        <div>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={userData.first_name}
            onChange={handleChange}
            placeholder="Enter First Name"
            required
          />
        </div>

        <div>
          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={userData.last_name}
            onChange={handleChange}
            placeholder="Enter Last Name"
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            required
          />
        </div>

        <div>
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            id="position"
            name="position"
            value={userData.position}
            onChange={handleChange}
            placeholder="Enter position"
          />
        </div>

        <div>
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            name="department"
            value={userData.department}
            onChange={handleChange}
            placeholder="Enter department"
          />
        </div>
        
        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            placeholder="Enter Phone Number"
          />
        </div>

        <button type="submit">Add New User</button>
      </form>

      {/* Success Message */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Error Message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}
