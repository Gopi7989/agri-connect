import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const InboxPage = () => {
  const { user } = useContext(AuthContext);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const response = await axios.get('https://agri-connect-api-1msi.onrender.com/api/inquiries/my-inquiries', config);
        setInquiries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inbox:", error);
        setLoading(false);
      }
    };

    if (user) {
      fetchInquiries();
    }
  }, [user]);

  // --- FILTER LOGIC ---
  // "Received" = Messages sent TO me (I am the farmer)
  const receivedMessages = inquiries.filter(i => i.to_farmer?._id === user._id);
  
  // "Sent" = Messages sent BY me (I am the buyer)
  const sentMessages = inquiries.filter(i => i.from_buyer?._id === user._id);

  const displayList = activeTab === 'received' ? receivedMessages : sentMessages;

  if (loading) return <div className="container" style={{marginTop:'50px', textAlign:'center'}}>Loading your messages...</div>;

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* --- Header Banner --- */}
      <div style={styles.banner}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', marginBottom: '5px' }}>Message Center</h1>
          <p style={{ opacity: 0.9 }}>Manage your orders and negotiations.</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-30px' }}>
        
        {/* --- Tabs --- */}
        <div style={styles.tabsContainer}>
          <button 
            style={activeTab === 'received' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('received')}
          >
            📥 Inbox ({receivedMessages.length})
          </button>
          <button 
            style={activeTab === 'sent' ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab('sent')}
          >
            📤 Sent ({sentMessages.length})
          </button>
        </div>

        {/* --- Message List --- */}
        <div style={styles.list}>
          {displayList.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</div>
              <h3>No messages here yet.</h3>
              <p style={{ color: '#888' }}>
                {activeTab === 'received' 
                  ? "You haven't received any inquiries yet." 
                  : "You haven't sent any inquiries yet."}
              </p>
              {activeTab === 'sent' && (
                <Link to="/marketplace" style={styles.linkButton}>Go to Marketplace</Link>
              )}
            </div>
          ) : (
            displayList.map((inquiry) => (
              <div key={inquiry._id} style={styles.messageCard}>
                
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={styles.iconCircle}>
                      {activeTab === 'received' ? '👤' : '🚜'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#333' }}>
                        {activeTab === 'received' 
                          ? inquiry.from_buyer?.name || 'Unknown Buyer'
                          : inquiry.to_farmer?.name || 'Unknown Farmer'}
                      </h4>
                      <span style={styles.roleBadge}>
                        {activeTab === 'received' ? 'Buyer' : 'Farmer'}
                      </span>
                    </div>
                  </div>
                  <span style={styles.date}>
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Product Context */}
                <div style={styles.productContext}>
                  Regarding: <strong>{inquiry.listing?.cropName || 'Deleted Item'}</strong>
                </div>

                {/* Message Body */}
                <div style={styles.messageBody}>
                  "{inquiry.message}"
                </div>

                {/* Contact Info Footer */}
                <div style={styles.cardFooter}>
                  <span>📞 Contact: <strong>
                    {activeTab === 'received' 
                      ? inquiry.from_buyer?.mobileNumber 
                      : inquiry.to_farmer?.mobileNumber}
                  </strong></span>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#1B5E20',
    color: 'white',
    padding: '50px 0 80px 0',
    backgroundImage: 'linear-gradient(to right, #1B5E20, #2E7D32)',
  },
  tabsContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tab: {
    flex: 1,
    padding: '15px',
    backgroundColor: 'rgba(255,255,255,0.7)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#555',
    transition: 'all 0.2s',
  },
  activeTab: {
    flex: 1,
    padding: '15px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    color: '#2E7D32',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  linkButton: {
    display: 'inline-block',
    marginTop: '20px',
    color: '#2E7D32',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
    borderLeft: '5px solid #2E7D32',
    transition: 'transform 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  iconCircle: {
    width: '40px',
    height: '40px',
    backgroundColor: '#f0f0f0',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem',
  },
  roleBadge: {
    fontSize: '0.75rem',
    backgroundColor: '#e8f5e9',
    color: '#2E7D32',
    padding: '2px 8px',
    borderRadius: '10px',
    fontWeight: 'bold',
  },
  date: {
    fontSize: '0.85rem',
    color: '#999',
  },
  productContext: {
    backgroundColor: '#f9f9f9',
    padding: '8px 12px',
    borderRadius: '5px',
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '15px',
    display: 'inline-block',
  },
  messageBody: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#333',
    marginBottom: '20px',
  },
  cardFooter: {
    borderTop: '1px solid #eee',
    paddingTop: '15px',
    fontSize: '0.95rem',
    color: '#555',
  },
};

export default InboxPage;