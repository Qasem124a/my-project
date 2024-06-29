import React, { useState, useEffect } from 'react';

const HomeTable = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employeeDataMap, setEmployeeDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const datetime = new Date();
        const date = datetime.toISOString().slice(0, 10); // YYYY-MM-DD format
        console.log(`Fetching attendance data for date: ${date}`);
        const attendanceUrl = `https://attendance-system-a0g5.onrender.com/api/attendance/day/${encodeURIComponent(date)}`;

        const attendanceResponse = await fetch(attendanceUrl);

        if (!attendanceResponse.ok) {
          throw new Error(`Attendance data fetch failed: ${attendanceResponse.statusText}`);
        }

        const attendanceData = await attendanceResponse.json();
        setAttendanceData(attendanceData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async (employeeId) => {
      try {
        const employeeUrl = `https://attendance-system-a0g5.onrender.com/api/employee/${encodeURIComponent(employeeId)}`;
        const employeeResponse = await fetch(employeeUrl);

        if (!employeeResponse.ok) {
          throw new Error(`Employee data fetch failed: ${employeeResponse.statusText}`);
        }

        const employeeData = await employeeResponse.json();

        // Update employeeDataMap with new data
        setEmployeeDataMap(prevMap => ({
          ...prevMap,
          [employeeId]: employeeData
        }));
      } catch (error) {
        setError(error);
      }
    };

    // Fetch employee data for all unique employee_ids in attendanceData
    if (attendanceData.length > 0) {
      const uniqueEmployeeIds = [...new Set(attendanceData.map(record => record.employee_id))];
      uniqueEmployeeIds.forEach(employeeId => fetchEmployeeData(employeeId));
    }
  }, [attendanceData]);

  // Render loading state while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state if there's an error
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Render the combined table with attendance and employee data
  return (
    <div className="table-container">
      <h2>Attendance Data and Employee Details</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee ID</th>
            <th>Status</th>
            <th>Employee Name</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((attendanceRecord, index) => (
            <tr key={index}>
              <td>{attendanceRecord.date}</td>
              <td>{attendanceRecord.employee_id}</td>
              <td>{attendanceRecord.status}</td>
              <td>{employeeDataMap[attendanceRecord.employee_id]?.first_name || 'Loading...'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeTable;

