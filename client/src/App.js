import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiDollarSign } from 'react-icons/fi';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', limit: '' });
  const [newTransaction, setNewTransaction] = useState({ category: '', amount: '', type: 'expense' });

  // Fetch budgets and transactions
  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, []);

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
      } catch (error) {
        console.error('Error adding budget:', error);
      }
    }
  };

  const addTransaction = async () => {
    if (newTransaction.category && newTransaction.amount) {
      try {
        await axios.post(`${API_URL}/api/transactions`, newTransaction);
        setNewTransaction({ category: '', amount: '', type: 'expense' });
        setShowAddTransaction(false);
        fetchTransactions();
        fetchBudgets();
      } catch (error) {
        console.error('Error adding transaction:', error);
      }
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/budgets/${id}`);
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/transactions/${id}`);
      fetchTransactions();
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting transaction:', error);
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

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>💰 Budget Buddy</h1>
          <p>Your cute way to manage money</p>
        </div>
      </header>

      <div className="container">
        {/* Overview Cards */}
        <div className="overview">
          <div className="card income-card">
            <div className="card-label">💵 Total Income</div>
            <div className="card-value">${getTotalIncome().toFixed(2)}</div>
          </div>
          <div className="card expense-card">
            <div className="card-label">💸 Total Expenses</div>
            <div className="card-value">${getTotalExpenses().toFixed(2)}</div>
          </div>
          <div className="card balance-card">
            <div className="card-label">🏦 Balance</div>
            <div className="card-value">${(getTotalIncome() - getTotalExpenses()).toFixed(2)}</div>
          </div>
        </div>

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
              <input
                type="text"
                placeholder="Category (e.g., Food, Transport)"
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              />
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

          <div className="budget-list">
            {budgets.map(budget => {
              const spent = getTotalSpent(budget.category);
              const percentage = (spent / budget.limit) * 100;
              const isOverBudget = spent > budget.limit;
              
              return (
                <div key={budget._id} className={`budget-item ${isOverBudget ? 'over-budget' : ''}`}>
                  <div className="budget-info">
                    <h3>{budget.category}</h3>
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
                <option value="expense">Expense</option>
                <option value="income">Income</option>
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
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={addTransaction}>Save Transaction</button>
                <button className="btn btn-cancel" onClick={() => setShowAddTransaction(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="transaction-list">
            {transactions.slice().reverse().map(transaction => (
              <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
                <div className="transaction-info">
                  <div className="transaction-category">{transaction.category}</div>
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
        </div>
      </div>
    </div>
  );
}

export default App;
