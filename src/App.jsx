import { useState } from 'react'
import './App.css'
import SpendingChart from './SpendingChart'

const CATEGORIES = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"]

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Salary", amount: "5000", type: "income", category: "salary", date: "2025-01-01" },
    { id: 2, description: "Rent", amount: "1200", type: "expense", category: "housing", date: "2025-01-02" },
    { id: 3, description: "Groceries", amount: "150", type: "expense", category: "food", date: "2025-01-03" },
    { id: 4, description: "Freelance Work", amount: "800", type: "income", category: "salary", date: "2025-01-05" },
    { id: 5, description: "Electric Bill", amount: "95", type: "expense", category: "utilities", date: "2025-01-06" },
    { id: 6, description: "Dinner Out", amount: "65", type: "expense", category: "food", date: "2025-01-07" },
    { id: 7, description: "Gas", amount: "45", type: "expense", category: "transport", date: "2025-01-08" },
    { id: 8, description: "Netflix", amount: "15", type: "expense", category: "entertainment", date: "2025-01-10" },
  ])

  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense")
  const [category, setCategory] = useState("food")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const balance = totalIncome - totalExpenses

  let filteredTransactions = transactions
  if (filterType !== "all") filteredTransactions = filteredTransactions.filter(t => t.type === filterType)
  if (filterCategory !== "all") filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description || !amount) return
    setTransactions([...transactions, {
      id: Date.now(),
      description,
      amount,
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    }])
    setDescription("")
    setAmount("")
    setType("expense")
    setCategory("food")
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <h1>Finance<span>.</span></h1>
          <p>Personal money tracker</p>
        </div>
        <div className="header-date">
          <strong>{balance >= 0 ? `+$${balance.toFixed(2)}` : `-$${Math.abs(balance).toFixed(2)}`}</strong>
          {today}
        </div>
      </header>

      <div className="summary">
        <div className="summary-card">
          <h3>Income</h3>
          <p className="amount income-amount">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Expenses</h3>
          <p className="amount expense-amount">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <h3>Balance</h3>
          <p className="amount balance-amount">${balance.toFixed(2)}</p>
        </div>
      </div>

      <SpendingChart transactions={transactions} />

      <div className="section">
        <p className="section-label">Add Transaction</p>
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Description</label>
            <input type="text" placeholder="e.g. Groceries" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Amount</label>
            <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Type</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-field">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="section">
        <div className="transactions-header">
          <p className="section-label" style={{ marginBottom: 0 }}>Transactions</p>
          <div className="filters">
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr key={t.id}>
                <td className="td-date">{t.date}</td>
                <td className="td-desc">{t.description}</td>
                <td className="td-category">{t.category}</td>
                <td className={`td-amount ${t.type}`}>
                  {t.type === "income" ? "+" : "−"}${parseFloat(t.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
