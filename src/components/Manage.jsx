import React, { useState, useEffect } from "react";

export default function Manage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState({
    startTime: new Date(),
    endTime: new Date(),
    employeeId: "",
  });

  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [employeePresence, setEmployeePresence] = useState([]);
  const [error, setError] = useState(null);
  const [showPresenceTable, setShowPresenceTable] = useState(false);
  const [showRemoveEmployeeForm, setShowRemoveEmployeeForm] = useState(false);
  const [showUpdateEmployeeForm, setShowUpdateEmployeeForm] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState(null);
  const [employeeToUpdate, setEmployeeToUpdate] = useState(null);
  const [updateData, setUpdateData] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch employee data from the API
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch('https://attendance-system-a0g5.onrender.com/api/employees');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEmployeeDetails(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleTimeRangeChange = (startTime, endTime) => {
    setSelectedTimeRange({ startTime, endTime, employeeId: selectedTimeRange.employeeId });
  };

  const handleEmployeeIdChange = (e) => {
    setSelectedTimeRange({ ...selectedTimeRange, employeeId: e.target.value });
  };

  const fetchEmployeePresence = async () => {
    setShowPresenceTable(false);
    setError(null);

    const { startTime, endTime, employeeId } = selectedTimeRange;

    const startDate = startTime.toISOString().slice(0, 10);
    const endDate = endTime.toISOString().slice(0, 10);

    try {
      const response = await fetch(`https://attendance-system-a0g5.onrender.com/api/attendance/day/${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}/${encodeURIComponent(selectedTimeRange.employeeId)}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEmployeePresence(data);
      setShowPresenceTable(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleViewPresence = () => {
    fetchEmployeePresence();
  };

  const handleRemoveEmployee = (employeeId) => {
    setEmployeeToUpdate(null); // Clear any existing update form
    setEmployeeToRemove(employeeId);
    setShowRemoveEmployeeForm(true);
  };

  const confirmRemoveEmployee = async () => {
    try {
      const response = await fetch(`https://attendance-system-a0g5.onrender.com/api/employee/${encodeURIComponent(employeeToRemove)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove employee');
      }

      // Refresh employee list after deletion
      const updatedEmployees = employeeDetails.filter(employee => employee.employee_id !== employeeToRemove);
      setEmployeeDetails(updatedEmployees);
      setShowRemoveEmployeeForm(false);
      setEmployeeToRemove(null);
      setSuccessMessage('Employee removed successfully!');
    } catch (error) {
      setError(`Error removing employee: ${error.message}`);
      console.error('Error details:', error);
    }
  };

  const handleUpdateEmployee = (employeeId) => {
    const employeeToUpdate = employeeDetails.find(emp => emp.employee_id === employeeId);
    if (employeeToUpdate) {
      setUpdateData({ ...employeeToUpdate });
      setEmployeeToUpdate(employeeId);
      setShowUpdateEmployeeForm(true);
    }
  };

  const handleChangeUpdateData = (e) => {
    const { name, value } = e.target;
    setUpdateData({ ...updateData, [name]: value });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://attendance-system-a0g5.onrender.com/api/employee/${encodeURIComponent(employeeToUpdate)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      // Refresh employee list after update
      const updatedEmployees = employeeDetails.map(emp => {
        if (emp.employee_id === employeeToUpdate) {
          return { ...emp, ...updateData };
        }
        return emp;
      });
      setEmployeeDetails(updatedEmployees);
      setShowUpdateEmployeeForm(false);
      setEmployeeToUpdate(null);
      setUpdateData({
        employee_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
      });
      setSuccessMessage('Employee updated successfully!');
    } catch (error) {
      setError(`Error updating employee: ${error.message}`);
      console.error('Error details:', error);
    }
  };

  return (
    <div className="content">
      <div className="manage-content">
        <h2>Employee Presence </h2>

        {/* Time Filter */}
        <div className="time-filter">
          <label>Select Time Range:</label>
          <input
            type="date"
            value={selectedTimeRange.startTime.toISOString().slice(0, 10)}
            onChange={(e) => handleTimeRangeChange(new Date(e.target.value), selectedTimeRange.endTime)}
          />
          <input
            type="date"
            value={selectedTimeRange.endTime.toISOString().slice(0, 10)}
            onChange={(e) => handleTimeRangeChange(selectedTimeRange.startTime, new Date(e.target.value))}
          />
          <label>Employee ID:</label>
          <input
            type="text"
            value={selectedTimeRange.employeeId}
            onChange={handleEmployeeIdChange}
          />
          <button onClick={handleViewPresence}>View</button>
        </div>

        {/* Employee Presence Table */}
        {showPresenceTable && (
          <div className="employee-table">
            <h2>Employee Presence</h2>
            {error ? (
              <div>Error: {error}</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee ID</th>
                    <th>Presence Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employeePresence.map((presence) => (
                    <tr key={presence.employee_id}>
                      <td>{presence.date}</td>
                      <td>{presence.employee_id}</td>
                      <td>{presence.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Employee Details Table */}
        <div className="employee-table">
          <h2>Employees Details</h2>
          {error ? (
            <div>Error: {error}</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employeeDetails.map((employee) => (
                  <tr key={employee.employee_id}>
                    <td>{employee.employee_id}</td>
                    <td>{employee.first_name}</td>
                    <td>{employee.last_name}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone}</td>
                    <td>
                      <button onClick={() => handleUpdateEmployee(employee.employee_id)}>Update</button>
                      <button onClick={() => handleRemoveEmployee(employee.employee_id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Remove Employee Form */}
          {showRemoveEmployeeForm && (
            <div className="remove-employee-form">
              <h3>Confirm Employee Removal</h3>
              <p>Are you sure you want to remove employee with ID: {employeeToRemove}?</p>
              <button onClick={confirmRemoveEmployee}>Confirm</button>
              <button onClick={() => setShowRemoveEmployeeForm(false)}>Cancel</button>
            </div>
          )}

          {/* Update Employee Form */}
          {showUpdateEmployeeForm && (
            <div className="update-employee-form">
              <h3>Update Employee Details</h3>
              <form onSubmit={handleSubmitUpdate}>
                <div>
                  <label htmlFor="employeeId">Employee ID:</label>
                  <input
                    type="text"
                    id="employee_id"
                    name="employee_id"
                    value={updateData.employee_id}
                    onChange={handleChangeUpdateData}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={updateData.first_name}
                    onChange={handleChangeUpdateData}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={updateData.last_name}
                    onChange={handleChangeUpdateData}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={updateData.email}
                    onChange={handleChangeUpdateData}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="position">Position:</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={updateData.position}
                    onChange={handleChangeUpdateData}
                  />
                </div>
                <div>
                  <label htmlFor="department">Department:</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={updateData.department}
                    onChange={handleChangeUpdateData}
                  />
                </div>
                <div>
                  <label htmlFor="phone">Phone Number:</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={updateData.phone}
                    onChange={handleChangeUpdateData}
                  />
                </div>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setShowUpdateEmployeeForm(false)}>Cancel</button>
              </form>
            </div>
          )}

          {/* Success and Error Messages */}
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
    </div>
  );
}
