import React from "react";
import Sidenav from './components/Sidenav';
import { Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import AddUser from "./components/AddUser";
import Manage from "./components/Manage";
import LoginForm from "./components/LoginForm";
import Footer from "./components/Footer";
import ContactUs from "./components/ContactUs";
import "./App.css"

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <Sidenav onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;