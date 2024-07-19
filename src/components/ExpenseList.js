// src/components/ExpenseList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash, FaSync } from 'react-icons/fa'; // Import FaSync for refresh icon

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editedAmount, setEditedAmount] = useState('');
  const [editedCategory, setEditedCategory] = useState('');
  const [editedDate, setEditedDate] = useState('');
  const [isFetching, setIsFetching] = useState(false); // State for refreshing data
  const { token } = useAuth();

  useEffect(() => {
    fetchExpenses();
  }, [token]); // Fetch expenses when token changes

  const fetchExpenses = async () => {
    try {
      setIsFetching(true); // Set fetching state to true
      const response = await axios.get('https://backend-expense-tracker-2.onrender.com/expenses', {
        headers: { Authorization: token }
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsFetching(false); // Set fetching state to false after request completes
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`https://backend-expense-tracker-2.onrender.com/expenses/${expenseId}`, {
        headers: { Authorization: token }
      });
      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense._id);
    setEditedAmount(expense.amount);
    setEditedCategory(expense.category);
    setEditedDate(expense.date);
  };

  const handleUpdate = async (expenseId) => {
    try {
      await axios.put(`https://backend-expense-tracker-2.onrender.com/expenses/${expenseId}`, {
        amount: Number(editedAmount),
        category: editedCategory,
        date: editedDate
      }, {
        headers: { Authorization: token }
      });
      setExpenses(expenses.map((expense) =>
        expense._id === expenseId ? { ...expense, amount: editedAmount, category: editedCategory, date: editedDate } : expense
      ));
      setEditingExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  return (
    <div className="p-4 bg-violet-dark text-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Expense List</h2>
        <button onClick={fetchExpenses} disabled={isFetching} className="text-white hover:text-blue-500">
          <FaSync className={`text-xl ${isFetching ? 'animate-spin' : ''}`} /> {/* Refresh icon with spin animation when fetching */}
        </button>
      </div>
      <ul>
        {expenses.map((expense) => (
          <li key={expense._id} className="flex items-center justify-between mb-2 p-2 rounded bg-gray-800">
            {editingExpense === expense._id ? (
              <>
                <input
                  type="number"
                  value={editedAmount}
                  onChange={(e) => setEditedAmount(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white mr-2"
                />
                <input
                  type="text"
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white mr-2"
                />
                <input
                  type="date"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                  className="p-2 rounded bg-gray-700 text-white mr-2"
                />
                <button onClick={() => handleUpdate(expense._id)} className="text-green-500 hover:text-green-700">
                  Save
                </button>
                <button onClick={() => setEditingExpense(null)} className="text-gray-500 hover:text-gray-700 ml-2">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{expense.amount}</span>
                <span>{expense.category}</span>
                <span>{expense.date}</span>
                <button onClick={() => handleEdit(expense)} className="text-black hover:text-blue-500 ml-2">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(expense._id)} className="text-black hover:text-red-500 ml-2">
                  <FaTrash />
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
