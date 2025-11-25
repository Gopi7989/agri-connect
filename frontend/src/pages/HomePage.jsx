import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// REMOVED: import axios from 'axios';  <-- Reducing bundle size

const HomePage = () => {
  const [stats, setStats] = useState({
    farmers: 0,
    listings: 0,
    districts: 0
  });

  // Fetch real stats using native fetch (No Axios)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://agri-connect-api-1msi.onrender.com/api/stats');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="homepage">
      
      {/* --- HERO SECTION --- */}
      <section style={styles.hero}>
        <div style={styles.overlay}>
          <div className="container" style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              The Future of <br />
              <span style={{ color: '#AEEA00' }}>Smart Farming</span> is Here.
            </h1>
            <p style={styles.heroSubtitle}>
              Connect directly with buyers, get fair prices, and access real-time 
              agricultural insights. No middlemen. Just growth.
            </p>
            
            <div style={styles.buttonGroup}>
              <Link to="/register" style={styles.primaryButton}>
                Start Selling Now
              </Link>
              <Link to="/marketplace" style={styles.secondaryButton}>
                View Market Prices
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- REAL STATS SECTION --- */}
      <section style={styles.statsBar}>
        <div className="container" style={styles.statsGrid}>
          <div style={styles.statItem}>
            <h3>{stats.farmers}+</h3>
            <p>Farmers Registered</p>
          </div>
          <div style={styles.statItem}>
            <h3>{stats.listings}+</h3>
            <p>Active Listings</p>
          </div>
          <div style={styles.statItem}>
            <h3>{stats.districts}+</h3>
            <p>Districts Covered</p>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Why Choose Agri-Connect?</h2>
          
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.icon}>🚜</div>
              <h3>Zero Commission</h3>
              <p>Keep 100% of your profit. We connect you directly to the buyer.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.icon}>📱</div>
              <h3>Real-Time Chat</h3>
              <p>Negotiate prices and delivery details instantly with our secure inbox.</p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.icon}>🌦️</div>
              <h3>Smart Insights</h3>
              <p>Get listing recommendations based on what's in high demand right now.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section style={styles.ctaSection}>
        <div className="container">
          <h2>Ready to grow your business?</h2>
          <p>Join the fastest growing agricultural network in India today.</p>
          <Link to="/register" style={styles.ctaButton}>Create Free Account</Link>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={styles.footer}>
        <div className="container">
          <p>&copy; 2025 Agri-Connect. Built for the Farming Community.</p>
        </div>
      </footer>

    </div>
  );
};

// --- CSS STYLES ---
const styles = {
  hero: {
    // OPTIMIZATION: 
    // 1. Reduced width to 1200px (1920px is often overkill for bg images)
    // 2. Added 'fm=webp' to convert to WebP format (smaller file size)
    // 3. Lowered quality 'q=70' (imperceptible difference, much faster load)
    backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=70&fm=webp")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    position: 'relative',
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '20px',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: '1.2',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '40px',
    opacity: '0.9',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto 40px auto',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '15px 35px',
    backgroundColor: '#AEEA00',
    color: '#1B5E20',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    border: '2px solid #AEEA00',
    transition: 'all 0.3s',
  },
  secondaryButton: {
    padding: '15px 35px',
    backgroundColor: 'transparent',
    color: 'white',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    border: '2px solid white',
    transition: 'all 0.3s',
  },
  // Stats Section
  statsBar: {
    backgroundColor: '#1B5E20',
    color: 'white',
    padding: '40px 0',
  },
  statsGrid: {
    display: 'flex',
    justifyContent: 'space-around',
    textAlign: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  statItem: {
    minWidth: '150px',
  },
  // Features
  features: {
    padding: '80px 20px',
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '50px',
    fontWeight: 'bold',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s',
    borderTop: '5px solid #2E7D32',
  },
  icon: {
    fontSize: '3.5rem',
    marginBottom: '20px',
  },
  // CTA Section
  ctaSection: {
    padding: '80px 20px',
    backgroundColor: '#2E7D32',
    color: 'white',
    textAlign: 'center',
  },
  ctaButton: {
    display: 'inline-block',
    marginTop: '30px',
    padding: '15px 40px',
    backgroundColor: 'white',
    color: '#2E7D32',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  },
  // Footer
  footer: {
    backgroundColor: '#111',
    color: '#888',
    padding: '30px 0',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
};

export default HomePage;