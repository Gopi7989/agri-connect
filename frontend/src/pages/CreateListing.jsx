import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const CreateListing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    status: 'Available Now', // Default value
  });

  const { cropName, quantity, status } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Security check: Ensure user exists and is a farmer
    if (!user || user.role !== 'farmer') {
      toast.error("Only farmers can post listings.");
      return;
    }

    try {
      // We need to send the Token in the header!
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.post('http://localhost:5000/api/listings', formData, config);

      toast.success('Listing Created Successfully!');
      navigate('/marketplace'); // Go back to the market to see it
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '50px' }}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', color: '#2E7D32', marginBottom: '20px' }}>
          Add New Produce
        </h2>

        <form onSubmit={onSubmit}>
          {/* Crop Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Crop Name</label>
            <input
              type="text"
              name="cropName"
              value={cropName}
              placeholder="e.g. Red Onions, Basmati Rice"
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          {/* Quantity */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Quantity Available</label>
            <input
              type="text"
              name="quantity"
              value={quantity}
              placeholder="e.g. 500kg, 20 Quintals"
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          {/* Status */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Availability Status</label>
            <select 
              name="status" 
              value={status} 
              onChange={onChange} 
              style={styles.select}
            >
              <option value="Available Now">Available Now</option>
              <option value="Expected Harvest">Expected Harvest (Future)</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>
            Post Listing
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2E7D32',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default CreateListing;