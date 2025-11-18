import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import AuthContext from '../context/AuthContext';

const Marketplace = () => {
  const { user } = useContext(AuthContext);
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- MODAL STATE (New) ---
  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [message, setMessage] = useState('');

  // 1. Fetch Listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/listings');
        setListings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // 2. Filter logic
  const filteredListings = listings.filter((listing) =>
    listing.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location_district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Handle "Contact" Click
  const handleContactClick = (listing) => {
    if (!user) {
      toast.error("Please login to contact the farmer.");
      return;
    }
    setSelectedListing(listing);
    setShowModal(true); // Open the popup
  };

  // 4. Send Message Function
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.post('https://agri-connect-api-1msi.onrender.com/api/inquiries', {
        listingId: selectedListing._id,
        message: message
      }, config);

      toast.success('Message sent to farmer!');
      setShowModal(false); // Close popup
      setMessage(''); // Clear text
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="container" style={{ marginTop: '30px', marginBottom: '50px' }}>
      
      {/* --- Header --- */}
      <div style={styles.header}>
        <div>
          <h2 style={{ color: '#2E7D32' }}>Current Market Listings</h2>
          <p>Find fresh produce directly from farmers.</p>
        </div>
        {user && user.role === 'farmer' && (
          <Link to="/create-listing" style={styles.addButton}>+ Add Your Produce</Link>
        )}
      </div>

      {/* --- Search --- */}
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Search by crop or district..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
        />
      </div>

      {/* --- Grid --- */}
      {loading ? (
        <p>Loading market data...</p>
      ) : (
        <div style={styles.grid}>
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <div key={listing._id} style={styles.card}>
                <div style={styles.badge(listing.status)}>{listing.status}</div>
                <h3 style={{ marginTop: '10px', color: '#333' }}>{listing.cropName}</h3>
                
                <div style={styles.cardBody}>
                  <p><strong>Quantity:</strong> {listing.quantity}</p>
                  <p><strong>Farmer:</strong> {listing.user?.name || 'Unknown'}</p>
                  <p><strong>Location:</strong> {listing.location_district}</p>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>
                    Posted: {new Date(listing.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Contact Button (Only for Buyers) */}
                {user && user.role === 'buyer' && (
                   <button 
                     style={styles.contactButton}
                     onClick={() => handleContactClick(listing)}
                   >
                     Contact Farmer
                   </button>
                )}
              </div>
            ))
          ) : (
            <p>No listings found.</p>
          )}
        </div>
      )}

      {/* --- MESSAGE MODAL POPUP (New) --- */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{color: '#2E7D32'}}>Contact {selectedListing?.user?.name}</h3>
            <p style={{marginBottom:'10px'}}>
              Inquiring about: <strong>{selectedListing?.cropName}</strong>
            </p>
            
            <textarea
              rows="4"
              style={styles.textArea}
              placeholder="Hi, I am interested in buying this..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button style={styles.sendButton} onClick={handleSendMessage}>Send Message</button>
              <button style={styles.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- Styles ---
const styles = {
  // ... (Same styles as before) ...
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' },
  addButton: { backgroundColor: '#2E7D32', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' },
  searchBar: { width: '100%', padding: '15px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: { backgroundColor: 'white', border: '1px solid #eee', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' },
  cardBody: { marginTop: '10px', lineHeight: '1.8' },
  badge: (status) => ({ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: status === 'Available Now' ? '#E8F5E9' : '#FFF3E0', color: status === 'Available Now' ? '#2E7D32' : '#F57C00' }),
  contactButton: { width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#1976D2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  
  // Modal Styles
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  textArea: {
    width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', resize: 'vertical'
  },
  sendButton: { padding: '10px 20px', backgroundColor: '#2E7D32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  cancelButton: { padding: '10px 20px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Marketplace;