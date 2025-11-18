import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const InboxPage = () => {
  const { user } = useContext(AuthContext);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="container" style={{marginTop:'20px'}}>Loading messages...</div>;

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '50px' }}>
      <h2 style={{ color: '#2E7D32', marginBottom: '20px' }}>My Inbox</h2>

      {inquiries.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div style={styles.list}>
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} style={styles.messageCard}>
              
              {/* Header: Who is involved? */}
              <div style={styles.cardHeader}>
                <span style={styles.cropTitle}>
                  Regarding: <strong>{inquiry.listing?.cropName || 'Unknown Listing'}</strong>
                </span>
                <span style={styles.date}>
                  {new Date(inquiry.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Body: The Message */}
              <div style={styles.cardBody}>
                <p><strong>From:</strong> {inquiry.from_buyer?.name} ({inquiry.from_buyer?.mobileNumber})</p>
                <p><strong>To:</strong> {inquiry.to_farmer?.name}</p>
                
                <div style={styles.messageBox}>
                  "{inquiry.message}"
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  messageCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
  cropTitle: {
    fontSize: '1.1rem',
    color: '#2E7D32',
  },
  date: {
    color: '#888',
    fontSize: '0.9rem',
  },
  cardBody: {
    lineHeight: '1.6',
  },
  messageBox: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    borderLeft: '4px solid #2E7D32',
    fontStyle: 'italic',
  },
};

export default InboxPage;