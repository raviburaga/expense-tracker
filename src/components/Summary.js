import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSync } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, ReferenceDot, Doughnut, BarStack, BarStackChart } from 'recharts';

const Summary = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState({ total: 0, categories: [], monthly: {}, yearly: {} });
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get('https://backend-expense-tracker-2.onrender.com/expenses', {
        headers: { Authorization: token },
      });
      const expenses = response.data;
      let total = 0;
      const categories = {};
      const monthly = {};
      const yearly = {};

      expenses.forEach((expense) => {
        total += expense.amount;

        // Calculate monthly expenses for current year
        const expenseDate = new Date(expense.date);
        const year = expenseDate.getFullYear();
        const monthName = expenseDate.toLocaleString('default', { month: 'long' }); // Get month name
        const monthKey = `${monthName}`;

        // Update monthly expenses for current year
        if (year === new Date().getFullYear()) {
          if (monthly[monthKey]) {
            monthly[monthKey] += expense.amount;
          } else {
            monthly[monthKey] = expense.amount;
          }
        }

        // Calculate yearly expenses
        const yearKey = `${year}`;
        if (yearly[yearKey]) {
          yearly[yearKey] += expense.amount;
        } else {
          yearly[yearKey] = expense.amount;
        }

        // Categorize expenses
        if (categories[expense.category]) {
          categories[expense.category] += expense.amount;
        } else {
          categories[expense.category] = expense.amount;
        }
      });

      // Convert categories object to array for easier data manipulation
      const categoriesArray = Object.entries(categories).map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / total) * 100,
      }));

      // Sort categories by amount (descending order)
      categoriesArray.sort((a, b) => b.amount - a.amount);

      // Fill in missing months with 0 expenses
      const currentYear = new Date().getFullYear();
      const monthNames = Array.from({ length: 12 }, (_, index) => new Date(currentYear, index, 1).toLocaleString('default', { month: 'long' }));
      monthNames.forEach(monthName => {
        if (!monthly[monthName]) {
          monthly[monthName] = 0;
        }
      });

      setSummary({ total, categories: categoriesArray, monthly, yearly });
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Define colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19C6'];

  // Prepare data for yearly comparison charts (line chart and bar chart)
  const yearlyData = Object.entries(summary.yearly).map(([year, amount]) => ({ year, amount }));
  yearlyData.sort((a, b) => parseInt(a.year) - parseInt(b.year));

  // Data for monthly expense trend (January to December of current year)
  const monthNames = Array.from({ length: 12 }, (_, index) => new Date(new Date().getFullYear(), index, 1).toLocaleString('default', { month: 'long' }));
  const monthlyData = monthNames.map(month => ({ month, amount: summary.monthly[month] || 0 }));

  // Animation duration for blinking point
  const animationDuration = 1000; // 1 second

  return (
    <div className="p-4 bg-violet-dark text-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Summary</h2>
        <button onClick={fetchSummary} disabled={isFetching} className="text-white hover:text-blue-500">
          <FaSync className={`text-xl ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Line Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Expense Trend (Current Year)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" animationDuration={animationDuration} />
              {/* Blinking point animation for current month */}
              {monthlyData.map((entry, index) => {
                if (index === new Date().getMonth()) {
                  return <ReferenceDot key={index} x={entry.month} y={entry.amount} r={5} fill="#8884d8" animationDuration={animationDuration} />;
                } else {
                  return null;
                }
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* List View */}
        <div>
          <h3 className="text-xl font-semibold mb-2">List View</h3>
          <table className="w-full text-center border-2">
            <thead>
              <tr className="bg-gray-800 border-2 text-white">
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {summary.categories.map((category, index) => (
                <tr key={index} className="bg-gray-800">
                  <td className="px-4 py-2 uppercase">{category.category}</td>
                  <td className="px-4 py-2">{category.amount}</td>
                  <td className="px-4 py-2">{category.percentage.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pie Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Pie Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary.categories}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {summary.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Doughnut Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Doughnut Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary.categories}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {summary.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Stacked Bar Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Daily Breakdown (Stacked Bar Chart)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(summary.monthly).map(([month, amount]) => ({ month, amount }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" stackId="a" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Yearly Expenses */}
        {yearlyData.length > 1 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Yearly Comparison (Bar Chart)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
