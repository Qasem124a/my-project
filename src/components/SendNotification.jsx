import React, { useState } from "react";

export default function SendNotification() {
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleChangeContent = (e) => {
    setMessage(e.target.value);
  };

  const handleNotification = () => {
    const notificationData = {
      title: title,
      message: message
    };

    fetch('https://attendance-system-a0g5.onrender.com/api/notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send notification');
        }
        console.log('Notification sent successfully');
        setTitle('');
        setMessage('');
      })
      .catch(error => {
        console.error('Error sending notification:', error);
      });
  };

  return (
    <div className="content">
      <div className="send-notification-container">
        <h2>Notification Form</h2>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleChangeTitle}
        />

        <label htmlFor="message">Content:</label>
        <textarea
          id="message"
          value={message}
          onChange={handleChangeContent}
        />

        <button onClick={handleNotification}>Send Notification</button>
      </div>
    </div>
  );
}
