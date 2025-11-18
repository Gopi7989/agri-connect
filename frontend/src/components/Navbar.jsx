import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div className="container" style={styles.navContainer}>
        
        {/* --- LOGO SECTION --- */}
        <Link to="/" style={styles.logo}>
          <img 
            src="https://cdn-icons-png.flaticon.com/512/188/188333.png" 
            alt="Logo" 
            style={styles.logoImage} 
          />
          Agri-Connect
        </Link>

        {/* --- NAVIGATION LINKS --- */}
        <ul style={styles.navLinks}>
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/marketplace" style={styles.link}>Marketplace</Link></li>
          
          {user ? (
            <>
              <li><Link to="/inbox" style={styles.link}>My Inbox</Link></li>
              <li>
                <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" style={styles.link}>Login</Link></li>
              <li><Link to="/register" style={styles.button}>Get Started</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

const styles = {
  navbar: { 
    backgroundColor: '#2E7D32', 
    color: '#fff', 
    padding: '1rem 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)' // Added shadow for depth
  },
  navContainer: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  
  // Logo Styles
  logo: { 
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    color: '#fff', 
    textDecoration: 'none', 
    display: 'flex',       // Aligns image and text
    alignItems: 'center',  // Vertically centers them
    gap: '10px'            // Space between image and text
  },
  logoImage: {
    height: '35px',        // Control the size
    width: '35px',
    filter: 'brightness(0) invert(1)' // Turns the black icon white to match text
  },

  navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' },
  button: { backgroundColor: '#F9A825', color: '#333', padding: '8px 20px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold', transition: 'transform 0.2s' },
  logoutButton: { backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Navbar;