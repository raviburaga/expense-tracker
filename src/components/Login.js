import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://backend-expense-tracker-2.onrender.com/login', { email, password });
      const { token, user } = response.data;
      console.log('userid:',user._id, token);
      // Store user ID in local storage
      localStorage.setItem('userId', user._id);

      login(token, user);
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-violet-dark text-white">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-violet">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              className="mt-1 text-violet block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-light focus:border-violet-light sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full px-3 text-violet py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-light focus:border-violet-light sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full py-2 px-4 bg-violet text-white rounded-md hover:bg-violet-light focus:outline-none focus:ring-2 focus:ring-violet-light focus:ring-opacity-50">Login</button>
        </form>
        <p className="text-sm text-gray-600 mt-2">Don't have an account? <Link to="/signup" className="text-violet">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;
