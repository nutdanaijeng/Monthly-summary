import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { getTransactions, addTransaction, deleteTransaction, getMonthlySummary } from "./api";

// Pages & Components
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Navigation from "./components/Navigation";

// Fullscreen Light/Dark mode styles
const appStyle = {
  light: { 
    backgroundColor: "#f8f9fa", 
    color: "#212529", 
    width: "100vw",
    minHeight: "100vh", 
    transition: "all 0.3s",
    display: "flex",
    flexDirection: "column",
  },
  dark: { 
    backgroundColor: "#1e1e1e", 
    color: "#f1f1f1", 
    width: "100vw",
    minHeight: "100vh", 
    transition: "all 0.3s",
    display: "flex",
    flexDirection: "column",
  },
};

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [filterMonth, setFilterMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [darkMode, setDarkMode] = useState(false);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!filterMonth) return;
        const transData = await getTransactions(filterMonth);
        setTransactions(transData);
        const sumData = await getMonthlySummary(filterMonth);
        setSummary(sumData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [filterMonth]);

  const handleAdd = async (data) => {
    try {
      await addTransaction(data);
      const transData = await getTransactions(filterMonth);
      setTransactions(transData);
      const sumData = await getMonthlySummary(filterMonth);
      setSummary(sumData);
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      const sumData = await getMonthlySummary(filterMonth);
      setSummary(sumData);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  return (
    <div style={darkMode ? appStyle.dark : appStyle.light}>
      <Navigation 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        filterMonth={filterMonth} 
        setFilterMonth={setFilterMonth} 
      />

      {/* ให้ main ขยายเต็มพื้นที่ที่เหลือ */}
      <main style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard summary={summary} transactions={transactions} />} 
          />
          <Route 
            path="/transactions" 
            element={<Transactions transactions={transactions} onAdd={handleAdd} onDelete={handleDelete} />}
          />
        </Routes>
      </main>
    </div>
  );
}
