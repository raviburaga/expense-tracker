import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ExpenseForm = () => {
  const { token } = useAuth();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category || !date) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await axios.post('https://backend-expense-tracker-2.onrender.com/expenses', {
        amount: Number(amount), // Ensure the amount is sent as a number
        category,
        date
      }, {
        headers: { Authorization: token }
      });

      // Clear the form fields after submission
      setAmount('');
      setCategory('');
      setDate('');
      alert('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense');
    }
  };

  return (
    <div className="bg-violet-dark text-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-200">Amount</label>
          <input
            id="amount"
            type="number"
            className="mt-1 text-violet block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-light focus:border-violet-light sm:text-sm"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-200">Category</label>
          <input
            id="category"
            type="text"
            className="mt-1 text-violet block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-light focus:border-violet-light sm:text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-200">Date</label>
          <input
            id="date"
            type="date"
            className="mt-1 text-violet block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-light focus:border-violet-light sm:text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-violet text-white rounded-md hover:bg-violet-light focus:outline-none focus:ring-2 focus:ring-violet-light focus:ring-opacity-50">
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
