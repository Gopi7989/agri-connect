import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const Marketplace = () => {
  const { user } = useContext(AuthContext);
  
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // --- MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [message, setMessage] = useState('');

  // --- SMART IMAGE HELPER (New!) ---
  // This picks a photo based on the crop name
  const getCropImage = (cropName) => {
    const name = cropName.toLowerCase();
    if (name.includes('tomato')) return 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=60';
    if (name.includes('grape')) return 'https://images.unsplash.com/photo-1537640538965-175287a5b501?auto=format&fit=crop&w=800&q=60';
    if (name.includes('spinach')) return 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=60';
    if (name.includes('cotton')) return 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=60';
    if (name.includes('onion')) return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=60';
    if (name.includes('rice') || name.includes('paddy')) return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=60';
    if (name.includes('wheat')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=60';
    if (name.includes('mango')) return 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=60';
    // Default Fallback Image
    return 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=800&q=60'; 
  };

  // 1. Fetch Listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('https://agri-connect-api-1msi.onrender.com/api/listings');
        setListings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // 2. Filter Logic (Enhanced)
  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          listing.location_district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || listing.cropName.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  // 3. Handle "Contact" Click
  const handleContactClick = (listing) => {
    if (!user) {
      toast.error("Please login to contact the farmer.");
      return;
    }
    setSelectedListing(listing);
    setShowModal(true);
  };

  // 4. Send Message
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
      setShowModal(false);
      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '50px' }}>
      
      {/* --- Top Banner --- */}
      <div style={styles.banner}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Marketplace</h1>
          <p style={{ opacity: 0.9 }}>Discover fresh produce from local farmers.</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-30px' }}>
        
        {/* --- Controls Section --- */}
        <div style={styles.controls}>
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search crops or districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchBar}
          />

          {/* Filter Chips */}
          <div style={styles.filters}>
            {['All', 'Tomato', 'Rice', 'Cotton', 'Fruits'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={activeFilter === filter ? styles.activeChip : styles.chip}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Add Button (For Farmers) */}
          {user && user.role === 'farmer' && (
            <Link to="/create-listing" style={styles.addButton}>
              + Sell Produce
            </Link>
          )}
        </div>

        {/* --- Listings Grid --- */}
        {loading ? (
          <div style={{textAlign: 'center', marginTop: '50px', color: '#666'}}>Loading market data...</div>
        ) : (
          <div style={styles.grid}>
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <div key={listing._id} style={styles.card}>
                  
                  {/* Listing Image */}
                  <div style={styles.imageContainer}>
                    <img 
                      src={getCropImage(listing.cropName)} 
                      alt={listing.cropName} 
                      style={styles.cardImage} 
                    />
                    <div style={styles.badge(listing.status)}>{listing.status}</div>
                  </div>

                  <div style={styles.cardContent}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                      <h3 style={styles.cropName}>{listing.cropName}</h3>
                      <span style={styles.quantityTag}>{listing.quantity}</span>
                    </div>
                    
                    <div style={styles.details}>
                      <p>📍 <strong>Location:</strong> {listing.location_district}</p>
                      <p>👨‍🌾 <strong>Farmer:</strong> {listing.user?.name || 'Unknown'}</p>
                      <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                        Posted: {new Date(listing.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action Button */}
                    {user && user.role === 'buyer' ? (
                       <button 
                         style={styles.contactButton}
                         onClick={() => handleContactClick(listing)}
                       >
                         Message Farmer
                       </button>
                    ) : (
                       <div style={{ height: '10px' }}></div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#888' }}>
                <h3>No listings found matching your search.</h3>
                <p>Try adjusting your filters or search term.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{color: '#2E7D32', marginBottom:'15px'}}>Contact Farmer</h3>
            <div style={{backgroundColor:'#f4f9f4', padding:'10px', borderRadius:'5px', marginBottom:'15px'}}>
              <p><strong>Item:</strong> {selectedListing?.cropName}</p>
              <p><strong>To:</strong> {selectedListing?.user?.name}</p>
            </div>
            
            <textarea
              rows="4"
              style={styles.textArea}
              placeholder="Hello, I am interested in buying your produce..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent:'flex-end' }}>
              <button style={styles.cancelButton} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={styles.sendButton} onClick={handleSendMessage}>Send Message</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// --- CSS Styles ---
const styles = {
  banner: {
    backgroundColor: '#2E7D32',
    color: 'white',
    padding: '60px 0 80px 0',
    backgroundImage: 'linear-gradient(rgba(46, 125, 50, 0.9), rgba(46, 125, 50, 0.8))',
  },
  controls: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '30px',
  },
  searchBar: {
    flex: 1,
    minWidth: '250px',
    padding: '12px 20px',
    borderRadius: '30px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
  },
  chip: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  activeChip: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #2E7D32',
    backgroundColor: '#2E7D32',
    color: 'white',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  addButton: {
    backgroundColor: '#F9A825',
    color: '#333',
    padding: '10px 20px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: 'bold',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    height: '180px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  badge: (status) => ({
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    backgroundColor: status === 'Available Now' ? 'rgba(232, 245, 233, 0.95)' : 'rgba(255, 243, 224, 0.95)',
    color: status === 'Available Now' ? '#2E7D32' : '#F57C00',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }),
  cardContent: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  cropName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  quantityTag: {
    backgroundColor: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: '5px',
    fontSize: '0.8rem',
    color: '#555',
  },
  details: {
    marginTop: '10px',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#555',
    flex: 1,
  },
  contactButton: {
    width: '100%',
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#2E7D32',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background 0.2s',
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    backdropFilter: 'blur(3px)',
  },
  modalContent: {
    backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '500px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  textArea: {
    width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', resize: 'vertical', fontFamily: 'inherit',
  },
  sendButton: { padding: '10px 25px', backgroundColor: '#2E7D32', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  cancelButton: { padding: '10px 25px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Marketplace;