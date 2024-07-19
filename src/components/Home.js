import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Using useNavigate instead of useHistory

import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import Summary from './Summary';

const Home = () => {
  const { user, token, logout } = useAuth(); // Assuming you have a logout function in your AuthContext
  const [salary, setSalary] = useState('NA');
  const [newSalaryInput, setNewSalaryInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      console.log('User or token is missing, skipping fetch.');
      return;
    }
  
    const fetchUserData = async () => {
      try {
        const salaryResponse = await axios.get(`https://backend-expense-tracker-2.onrender.com/salary`, {
          headers: { Authorization: token }
        });
        console.log('Salary response:', salaryResponse.data);
        setSalary(Number(salaryResponse.data));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [user, token]);

  const handleSaveSalary = async () => {
    try {
      await axios.put(`https://backend-expense-tracker-2.onrender.com/salary`, { salary: Number(newSalaryInput) }, {
        headers: { Authorization: token }
      });
      setSalary(newSalaryInput);
      setNewSalaryInput('');
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewSalaryInput(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Assuming this function handles clearing tokens, etc.
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Add a loading state
  }

  return (
    <div className="bg-violet-dark text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Welcome {user.name}</h1>
        <button onClick={handleLogout} className=" py-2 px-4 bg-violet text-white rounded-md hover:bg-violet-light focus:outline-none hover:ring-2 hover:ring-white hover:ring-opacity-50 ">Logout</button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Salary Division</h2>
        <div className="flex justify-between items-center mt-2">
          <div>
            <span>Your Salary: </span>
            {salary === 'NA' ? <span className="text-red-500">{salary}</span> : <span>{salary}</span>}
          </div>
          <div>
            <input
              type="text"
              value={newSalaryInput}
              onChange={handleInputChange}
              placeholder="Enter new salary"
              className="px-2 py-1 text-violet rounded-md mr-2"
            />
            <button
              onClick={handleSaveSalary}
              className="bg-violet-light text-white px-4 py-2 rounded-md mr-2"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      <ExpenseForm />
      <ExpenseList />
      <Summary />
    </div>
  );
};

export default Home;
