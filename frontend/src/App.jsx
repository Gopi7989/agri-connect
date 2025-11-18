import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // <-- Import Container
import 'react-toastify/dist/ReactToastify.css'; // <-- Import CSS
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Marketplace from './pages/Marketplace'; // <-- Import
// We will import RegisterPage in a moment, commenting out for now
import RegisterPage from './pages/RegisterPage'; 
import CreateListing from './pages/CreateListing'; // <-- Import
import InboxPage from './pages/InboxPage'; // <-- Import

function App() {
  return (
    <Router>
      <div className='app'>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/inbox" element={<InboxPage />} />
          {/* Additional routes can be added here */}
        </Routes>
        
        {/* This allows pop-up notifications to appear anywhere in the app */}
        <ToastContainer position="top-center" />
      </div>
    </Router>
  );
}

export default App;