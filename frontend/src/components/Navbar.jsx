import React, { useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // Import AuthContext

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); // Get user data
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div className="container" style={styles.navContainer}>
        <Link to="/" style={styles.logo}>Agri-Connect</Link>

        <ul style={styles.navLinks}>
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/marketplace" style={styles.link}>Marketplace</Link></li>
          
          {/* Show these links ONLY if logged in */}
          {user ? (
            <>
              <li><Link to="/inbox" style={styles.link}>My Inbox</Link></li>
              <li>
                <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
              </li>
            </>
          ) : (
            // Show these links if NOT logged in
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
  navbar: { backgroundColor: '#2E7D32', color: '#fff', padding: '1rem 0' },
  navContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', textDecoration: 'none' },
  navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '1rem' },
  button: { backgroundColor: '#F9A825', color: '#333', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' },
  logoutButton: { backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }
};

export default Navbar;