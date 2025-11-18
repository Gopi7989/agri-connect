import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext'; // Import the Context

const LoginPage = () => {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: '',
  });
  const { mobileNumber, password } = formData;

  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get the login function from Context

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Call the Backend Login API
      const response = await axios.post('http://localhost:5000/api/users/login', {
        mobileNumber,
        password,
      });

      if (response.data) {
        // 2. If success, save user data to Context (and LocalStorage)
        login(response.data); 
        
        toast.success('Login Successful!');
        
        // 3. Redirect based on role
        // (For now, we'll just go to the Marketplace, we can change this later)
        navigate('/marketplace'); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '50px' }}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', color: '#2E7D32', marginBottom: '20px' }}>
          Login to Your Account
        </h2>

        <form onSubmit={onSubmit}>
          <div style={styles.formGroup}>
            <input
              type="text"
              className="form-control"
              name="mobileNumber"
              value={mobileNumber}
              placeholder="Mobile Number"
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter Password"
              onChange={onChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          New to Agri-Connect? <Link to="/register" style={{ color: '#2E7D32', fontWeight: 'bold' }}>Register Here</Link>
        </p>
      </div>
    </div>
  );
};

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

export default LoginPage;