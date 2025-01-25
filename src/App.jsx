// src/App.jsx
/* eslint-disable no-unused-vars */
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './components/About';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/admindashboard';
import Footer from './components/footer';
import Listings from './components/listings';
import Navbar from './components/navbar';
import SignIn from './components/signin';
import SignUp from './components/signup';
import Inbox from './components/Inbox';
import Notifications from './components/Notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpLayout />} />
        <Route path="/signin" element={<SignInLayout />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

function SignUpLayout() {
  return (
    <>
      <Navbar />
      <SignUp />
      <Footer />
    </>
  );
}

function SignInLayout() {
  return (
    <>
      <Navbar />
      <SignIn />
      <Footer />
    </>
  );
}

function Home() {
  return (
    <>
      <Navbar />
      <Listings />
      <Footer />
    </>
  );
}

export default App;
