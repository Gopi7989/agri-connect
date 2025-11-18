import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // To talk to backend
import { toast } from 'react-toastify'; // For alerts

const RegisterPage = () => {
  const navigate = useNavigate();

  // 1. State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    password: '',
    role: 'farmer', // Default role
    location_district: '',
    mainCrops: '',   // For farmers
    companyName: '', // For buyers
  });

  const { name, mobileNumber, password, role, location_district, mainCrops, companyName } = formData;

  // 2. Handle Input Change
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // 3. Handle Form Submit
  const onSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for backend
    // (We convert the comma-separated string of crops into an array)
    const userData = {
      name,
      mobileNumber,
      password,
      role,
      location_district,
      mainCrops: role === 'farmer' ? mainCrops.split(',').map(crop => crop.trim()) : [],
      companyName: role === 'buyer' ? companyName : '',
    };

    try {
      // --- THE API CALL ---
      // We connect to the backend URL we built earlier
      const response = await axios.post('https://agri-connect-api-1msi.onrender.com/api/users/register', userData);

      if (response.data) {
        toast.success('Registration Successful! Please Login.');
        navigate('/login'); // Redirect to login page
      }
    } catch (error) {
      // If error, show the message from the backend (e.g., "User already exists")
      toast.error(error.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', color: '#2E7D32', marginBottom: '20px' }}>
          Create Account
        </h2>

        <form onSubmit={onSubmit}>
          {/* Name */}
          <div style={styles.formGroup}>
            <input
              type="text"
              className="form-control"
              name="name"
              value={name}
              placeholder="Full Name"
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          {/* Mobile */}
          <div style={styles.formGroup}>
            <input
              type="text"
              name="mobileNumber"
              value={mobileNumber}
              placeholder="Mobile Number"
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Create Password"
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          {/* Role Selection */}
          <div style={styles.formGroup}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>I am a:</label>
            <select name="role" value={role} onChange={onChange} style={styles.select}>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>

          {/* District */}
          <div style={styles.formGroup}>
             <input
              type="text"
              name="location_district"
              value={location_district}
              placeholder="District (e.g. Anantapur)"
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          {/* CONDITIONAL FIELDS */}
          {role === 'farmer' ? (
            // Show if Farmer
            <div style={styles.formGroup}>
              <input
                type="text"
                name="mainCrops"
                value={mainCrops}
                placeholder="Main Crops (e.g. Tomato, Cotton)"
                onChange={onChange}
                required
                style={styles.input}
              />
              <small>Separate crops with commas</small>
            </div>
          ) : (
            // Show if Buyer
            <div style={styles.formGroup}>
              <input
                type="text"
                name="companyName"
                value={companyName}
                placeholder="Company Name (Optional)"
                onChange={onChange}
                style={styles.input}
              />
            </div>
          )}

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#2E7D32', fontWeight: 'bold' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

// Internal CSS
const styles = {
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2E7D32',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default RegisterPage;