import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="homepage">
      
      {/* --- HERO SECTION --- */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Sell Your Produce.<br />
            <span style={{ color: '#F9A825' }}>Directly to Buyers.</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Agri-Connect bridges the gap between farmers and markets. 
            List your crops, negotiate prices, and grow your business without middlemen.
          </p>
          
          <div style={styles.buttonGroup}>
            <Link to="/register" style={styles.primaryButton}>
              Join as a Farmer
            </Link>
            <Link to="/marketplace" style={styles.secondaryButton}>
              Browse Market
            </Link>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>How Agri-Connect Works</h2>
          
          <div style={styles.featureGrid}>
            {/* Card 1 */}
            <div style={styles.featureCard}>
              <div style={styles.icon}>🌱</div>
              <h3>1. List Your Crops</h3>
              <p>Create a profile and list your harvest. Tell buyers what you have and how much is available.</p>
            </div>

            {/* Card 2 */}
            <div style={styles.featureCard}>
              <div style={styles.icon}>🤝</div>
              <h3>2. Connect Directly</h3>
              <p>Buyers search for produce in their district and contact you directly via our secure messaging system.</p>
            </div>

            {/* Card 3 */}
            <div style={styles.featureCard}>
              <div style={styles.icon}>📈</div>
              <h3>3. Grow Your Profits</h3>
              <p>Get fair market prices by eliminating intermediaries. Build long-term relationships with buyers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={styles.footer}>
        <div className="container">
          <p>&copy; 2025 Agri-Connect. Empowering Farmers.</p>
        </div>
      </footer>

    </div>
  );
};

// --- CSS STYLES ---
const styles = {
  // Hero Styles
  hero: {
    backgroundColor: '#2E7D32',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
    backgroundImage: 'linear-gradient(rgba(46, 125, 50, 0.9), rgba(46, 125, 50, 0.8))', // Adds a cool overlay effect
    borderBottomLeftRadius: '50px',
    borderBottomRightRadius: '50px',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    opacity: '0.9',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '15px 30px',
    backgroundColor: '#F9A825', // Yellow Accent
    color: '#333',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s',
  },
  secondaryButton: {
    padding: '15px 30px',
    backgroundColor: 'white',
    color: '#2E7D32',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },

  // Features Styles
  features: {
    padding: '80px 20px',
    backgroundColor: '#f4f9f4',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '50px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    transition: 'transform 0.3s',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '20px',
  },

  // Footer Styles
  footer: {
    backgroundColor: '#1B5E20',
    color: 'white',
    padding: '20px 0',
    textAlign: 'center',
    marginTop: 'auto',
  },
};

export default HomePage;