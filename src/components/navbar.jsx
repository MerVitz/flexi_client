import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const API_URL = import.meta.env.VITE_API_URL;

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // On component mount, check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('user_type');
  
    if (token) {
      setIsLoggedIn(true);
      setUserType(userType);
      fetchNotifications(token);
  
      /**
       * Polling mechanism
       * Will be replaced by webscockets later to provide 
       * Batter realtime expereince
       * Polling  after every 3 seconds
       * */ 
      const interval = setInterval(() => {
        fetchNotifications(token);
      }, 3000);
  
      return () => clearInterval(interval);
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, []);


  const fetchNotifications = async (token) => {
    try {
      const response = await axios.get('${API_URL}/api/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setNotifications(response.data.filter(n => !n.is_read));
    } catch (error) {
      console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/');
  };

  // Toggle More dropdown
  const toggleMoreDropdown = () => {
    setIsMoreDropdownOpen(!isMoreDropdownOpen);
  };

  return (
    <header className="header">
      <div className="navbar-container">
        <div className="nav">
          <nav className="navbar navbar-expand-lg navbar-light sticky-top">
            <div className="container-fluid">
              
              {/* FlexiHire -> Redirect to Listings if user is logged in */}
              <Link className="navbar-brand text-white fw-bold" to={isLoggedIn ? "/home" : "/"}>
                FlexiHire
              </Link>

              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link text-white" to={isLoggedIn ? "/home" : "/home"}>Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/about">About</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/contact">Contact</Link>
                  </li>

                  {/* Notifications -> Only for Customers */}
                  {isLoggedIn && userType === "customer" && (
                    <li className="nav-item">
                      <Link className="nav-link text-white" to="/notifications">
                        Notifications <span className="badge bg-danger">{notifications.length}</span>
                      </Link>
                    </li>
                  )}

                  {/* Search functionality */}
                  {isLoggedIn && (
                    <li className="nav-item">
                      <input type="text" placeholder="Search..." className="form-control" style={{ maxWidth: '200px' }} />
                    </li>
                  )}

                  {/* More dropdown with Dashboard & Logout (Dashboard only for non-customers) */}
                  {isLoggedIn && (
                    <li className="nav-item dropdown">
                      <a 
                        href="#"
                        className="nav-link dropdown-toggle text-white"
                        id="navbarDropdown"
                        role="button"
                        aria-expanded={isMoreDropdownOpen}
                        onClick={toggleMoreDropdown}
                      >
                        More
                      </a>
                      <div className={`dropdown-menu ${isMoreDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                        {userType !== 'customer' && (
                          <Link className="dropdown-item" to={userType === 'admin' ? "/admin-dashboard" : "/custom-dashboard"}>
                            Dashboard
                          </Link>
                        )}
                        <a className="dropdown-item" onClick={handleLogout}>Logout</a>
                      </div>
                    </li>
                  )}

                  {/* Show Sign Up and Sign In buttons if not logged in */}
                  {!isLoggedIn && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link text-white" to="/signup">Register</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link text-white" to="/signin">Login</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;