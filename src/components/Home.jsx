import React from "react";
import HomeTable from "./HomeTable";

export default function Home() {

  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    date: "",
    employee_id: "",
    status: "Present",
  });

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://attendance-system-a0g5.onrender.com/api/attendance/${encodeURIComponent(formData.employee_id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);

        setFormData({
          date: '',
          status: '',
        });
        closePopup();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="content">
      <HomeTable/>
      <button className="alter" onClick={openPopup}>Alter</button>

      {isPopupOpen && (
        <div className="popup" id="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <p>
              you can change the employee presence by choosing between present and absent .
            </p>
            <form className="form" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="Enter Employee ID"
                  className="input-alter"
                />
              </div>
              <div>
                <label htmlFor="employee_id">ID:</label>
                <input
                  type="text"
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  placeholder="Enter Employee ID"
                  className="input-alter"
                />
              </div>
              <div>
                <label htmlFor="status">Presence Status:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="select-alter"
                >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                </select>
              </div>
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}