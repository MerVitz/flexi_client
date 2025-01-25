/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/notifications.css';
import Navbar from './navbar';

const API_URL = import.meta.env.VITE_API_URL;

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    // Initial fetch of notifications
    fetchNotifications();

    // Set up polling for notifications
    const interval = setInterval(fetchNotifications, 5000); // Fetch every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Fetch Notifications from Backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('${API_URL}/api/notifications/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data); // Update notifications state
    } catch (error) {
      console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
    }
  };

  // Handle "OK" Button -> Move Item to Cart & Update Notification in Backend
  const handleConfirmBooking = async (notificationId) => {
    console.log(`Clicked OK for notification ${notificationId}`);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/notifications/${notificationId}/confirm/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const itemDetails = response.data.item_details;

      // Add item to Cart
      setCart((prevCart) => {
        const updatedCart = [...prevCart, itemDetails];
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save cart in local storage
        return updatedCart;
      });

      // Remove the notification from UI
      setNotifications((prevNotifications) =>
        prevNotifications.filter((n) => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Error confirming booking:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="notifications-container">
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No new notifications.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="notification">
              {notification.message}
              {notification.requires_confirmation && (
                <button
                  className="confirm-btn"
                  onClick={() => handleConfirmBooking(notification.id)}
                >
                  OK
                </button>
              )}
            </div>
          ))
        )}
        {cart.length > 0 && (
          <div className="cart-container">
            <h3>Your Cart</h3>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;
