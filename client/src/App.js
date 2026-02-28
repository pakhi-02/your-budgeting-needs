import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiSearch, FiMoon, FiSun, FiDownload, FiFilter } from 'react-icons/fi';
import Confetti from 'react-confetti';
import toast, { Toaster } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Category emoji mapping
const CATEGORY_EMOJIS = {
  'Food': '🍜',
  'Transport': '🚗',
  'Entertainment': '🎮',
  'Shopping': '🛍️',
  'Bills': '💡',
  'Health': '💊',
  'Education': '📚',
  'Rent': '🏠',
  'Salary': '💼',
  'Investment': '📈',
  'Freelance': '💻',
  'Gift': '🎁',
  'Other': '📌'
};

const CHART_COLORS = ['#FF6B9D', '#C471ED', '#12C2E9', '#4FD1C5', '#FC8181', '#9F7AEA', '#F6AD55'];

function App() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', limit: '' });
  const [newTransaction, setNewTransaction] = useState({ category: '', amount: '', type: 'expense', description: '' });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0 });

  // Fetch budgets and transactions
  useEffect(() => {
    fetchData();
  }, []);

  // Calculate stats
  useEffect(() => {
    const income = getTotalIncome();
    const expenses = getTotalExpenses();
    setStats({ income, expenses, balance: income - expenses });
  }, [transactions]);

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchBudgets(), fetchTransactions()]);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/budgets`);
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const addBudget = async () => {
    if (newBudget.category && newBudget.limit) {
      try {
        await axios.post(`${API_URL}/api/budgets`, newBudget);
        setNewBudget({ category: '', limit: '' });
        setShowAddBudget(false);
        fetchBudgets();
        toast.success('Budget added! 🎉', { icon: '✨' });
      } catch (error) {
        toast.error('Failed to add budget');
      }
    }
  };

  const addTransaction = async () => {
    if (newTransaction.category && newTransaction.amount) {
      try {
        await axios.post(`${API_URL}/api/transactions`, newTransaction);
        setNewTransaction({ category: '', amount: '', type: 'expense', description: '' });
        setShowAddTransaction(false);
        fetchTransactions();
        fetchBudgets();
        
        // Trigger confetti for income
        if (newTransaction.type === 'income') {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          toast.success('Money incoming! 💰', { icon: '🎊' });
        } else {
          toast.success('Transaction added!');
        }
        
        // Check if under budget
        checkBudgetStatus(newTransaction.category);
      } catch (error) {
        toast.error('Failed to add transaction');
      }
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/budgets/${id}`);
      fetchBudgets();
      toast.success('Budget deleted!', { icon: '🗑️' });
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/transactions/${id}`);
      fetchTransactions();
      fetchBudgets();
      toast.success('Transaction removed!');
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const checkBudgetStatus = (category) => {
    const budget = budgets.find(b => b.category === category);
    if (budget) {
      const spent = getTotalSpent(category);
      if (spent <= budget.limit) {
        toast.success(`Still under budget for ${category}! 👍`, { icon: '✅' });
      }
    }
  };

  const getTotalSpent = (category) => {
    return transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCategoryEmoji = (category) => {
    return CATEGORY_EMOJIS[category] || '📌';
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Get chart data
  const getChartData = () => {
    const categoryTotals = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Type', 'Amount', 'Description'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.category,
      t.type,
      t.amount,
      t.description || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Exported successfully!', { icon: '📊' });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your budget... 💰</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Toaster position="top-right" />
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <header className="header">
        <div className="header-content">
          <h1>💰 Budget Buddy</h1>
          <p>Your cute way to manage money</p>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button className="icon-btn" onClick={exportToCSV}>
              <FiDownload />
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Overview Cards */}
        <div className="overview">
          <div className="card income-card">
            <div className="card-label">💵 Total Income</div>
            <div className="card-value">${stats.income.toFixed(2)}</div>
          </div>
          <div className="card expense-card">
            <div className="card-label">💸 Total Expenses</div>
            <div className="card-value">${stats.expenses.toFixed(2)}</div>
          </div>
          <div className="card balance-card">
            <div className="card-label">🏦 Balance</div>
            <div className="card-value">${stats.balance.toFixed(2)}</div>
          </div>
        </div>

        {/* Charts */}
        {transactions.length > 0 && getChartData().length > 0 && (
          <div className="section chart-section">
            <h2>📊 Spending Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Budgets Section */}
        <div className="section">
          <div className="section-header">
            <h2>📊 Budgets</h2>
            <button className="btn btn-primary" onClick={() => setShowAddBudget(!showAddBudget)}>
              <FiPlus /> Add Budget
            </button>
          </div>

          {showAddBudget && (
            <div className="form-card">
              <div className="category-picker-wrapper">
                <input
                  type="text"
                  placeholder="Category"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  onFocus={() => setShowCategoryPicker(true)}
                />
                {showCategoryPicker && (
                  <div className="category-picker">
                    {Object.entries(CATEGORY_EMOJIS).map(([cat, emoji]) => (
                      <div
                        key={cat}
                        className="category-option"
                        onClick={() => {
                          setNewBudget({ ...newBudget, category: cat });
                          setShowCategoryPicker(false);
                        }}
                      >
                        <span className="emoji">{emoji}</span>
                        <span>{cat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="number"
                placeholder="Limit ($)"
                value={newBudget.limit}
                onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
              />
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={addBudget}>Save Budget</button>
                <button className="btn btn-cancel" onClick={() => setShowAddBudget(false)}>Cancel</button>
              </div>
            </div>
          )}

          {budgets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">📊</div>
              <h3>No budgets yet!</h3>
              <p>Create your first budget to start tracking your spending</p>
            </div>
          ) : (
            <div className="budget-list">
              {budgets.map(budget => {
                const spent = getTotalSpent(budget.category);
                const percentage = (spent / budget.limit) * 100;
                const isOverBudget = spent > budget.limit;
                
                return (
                  <div key={budget._id} className={`budget-item ${isOverBudget ? 'over-budget' : ''}`}>
                    <div className="budget-info">
                      <h3>
                        <span className="category-emoji">{getCategoryEmoji(budget.category)}</span>
                        {budget.category}
                      </h3>
                      <div className="budget-progress">
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${isOverBudget ? 'over' : ''}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="budget-stats">
                          <span>${spent.toFixed(2)} / ${budget.limit}</span>
                          <span className={isOverBudget ? 'over-text' : ''}>{isOverBudget ? '⚠️ Over' : '✅ OK'}</span>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-danger" onClick={() => deleteBudget(budget._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="section">
          <div className="section-header">
            <h2>💳 Transactions</h2>
            <button className="btn btn-primary" onClick={() => setShowAddTransaction(!showAddTransaction)}>
              <FiPlus /> Add Transaction
            </button>
          </div>

          {showAddTransaction && (
            <div className="form-card">
              <select 
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
              >
                <option value="expense">💸 Expense</option>
                <option value="income">💰 Income</option>
              </select>
              <input
                type="text"
                placeholder="Category"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount ($)"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })}
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              />
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={addTransaction}>Save Transaction</button>
                <button className="btn btn-cancel" onClick={() => setShowAddTransaction(false)}>Cancel</button>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="filter-bar">
            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                <FiFilter /> All
              </button>
              <button 
                className={`filter-btn ${filterType === 'income' ? 'active' : ''}`}
                onClick={() => setFilterType('income')}
              >
                💰 Income
              </button>
              <button 
                className={`filter-btn ${filterType === 'expense' ? 'active' : ''}`}
                onClick={() => setFilterType('expense')}
              >
                💸 Expense
              </button>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-illustration">💳</div>
              <h3>{searchTerm ? 'No matches found' : 'No transactions yet!'}</h3>
              <p>{searchTerm ? 'Try a different search term' : 'Add your first transaction to get started'}</p>
            </div>
          ) : (
            <div className="transaction-list">
              {filteredTransactions.slice().reverse().map(transaction => (
                <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-info">
                    <div className="transaction-category">
                      <span className="category-emoji">{getCategoryEmoji(transaction.category)}</span>
                      {transaction.category}
                    </div>
                    {transaction.description && (
                      <div className="transaction-description">{transaction.description}</div>
                    )}
                    <div className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="transaction-amount-section">
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <button className="btn btn-danger-sm" onClick={() => deleteTransaction(transaction._id)}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
