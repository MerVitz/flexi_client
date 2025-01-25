/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/managebookings.css';

const API_URL = import.meta.env.VITE_API_URL;

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch of bookings
    fetchBookings();

    // Set up polling for bookings (every 5 seconds)
    const interval = setInterval(fetchBookings, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Fetch bookings from Backend (only unconfirmed bookings)
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('${API_URL}/api/bookings/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter out confirmed bookings and update state
      setBookings(response.data.filter(booking => !booking.is_confirmed));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error.response ? error.response.data : error.message);
      setError(error);
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/bookings/${bookingId}/confirm/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update the state after confirming the booking
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId) // Remove the confirmed booking
      );
    } catch (error) {
      console.error('Error confirming booking:', error.response ? error.response.data : error.message);
    }
  };

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p>Error loading bookings: {error.message}</p>;
  }

  return (
    <div className="manage-bookings">
      <h2>Manage Bookings</h2>
      <div className="booking-list">
        {bookings.length === 0 ? (
          <p>No unconfirmed bookings available.</p>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <p><strong>Equipment:</strong> {booking.equipment.name}</p>
              <p><strong>User:</strong> {booking.user.email}</p>
              <p><strong>Start Time:</strong> {new Date(booking.start_time).toLocaleString()}</p>
              <p><strong>End Time:</strong> {new Date(booking.end_time).toLocaleString()}</p>
              <p><strong>Confirmed:</strong> {booking.is_confirmed ? 'Yes' : 'No'}</p>
              {!booking.is_confirmed && (
                <button onClick={() => handleConfirm(booking.id)}>Confirm</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
