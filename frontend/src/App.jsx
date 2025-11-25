import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';

// --- LAZY LOADING PAGES ---
// Instead of importing everything at the top, we import them on demand.
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const CreateListing = lazy(() => import('./pages/CreateListing'));
const InboxPage = lazy(() => import('./pages/InboxPage'));

// A simple loading spinner to show while the chunk is downloading
const PageLoader = () => (
  <div style={{ padding: '50px', textAlign: 'center', color: '#2E7D32' }}>
    <h3>Loading...</h3>
  </div>
);

function App() {
  return (
    <Router>
      <div className='app'>
        <Navbar />
        
        {/* Suspense handles the loading state for lazy components */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/inbox" element={<InboxPage />} />
          </Routes>
        </Suspense>
        
        <ToastContainer position="top-center" />
      </div>
    </Router>
  );
}

export default App;