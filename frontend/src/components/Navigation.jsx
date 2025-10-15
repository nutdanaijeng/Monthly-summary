import React from "react";
import { Link } from "react-router-dom";

const navStyle = (darkMode) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  borderBottom: "1px solid #444",
  marginBottom: "20px",
  backgroundColor: darkMode ? "#2c2c2c" : "#fff",
  boxShadow: darkMode
    ? "0 4px 6px rgba(0,0,0,0.6)"
    : "0 4px 6px rgba(0,0,0,0.1)",
  borderRadius: "8px",
  transition: "all 0.3s",
});

const navLinksStyle = {
  display: "flex",
  gap: "20px",
  fontSize: "1.1rem",
};

const linkStyle = (isDark) => ({
  color: isDark ? "#f1f1f1" : "#212529",
  textDecoration: "none",
  fontWeight: "bold",
  padding: "4px 8px",
  borderRadius: "4px",
  transition: "all 0.3s",
});

export default function Navigation({ darkMode, setDarkMode, filterMonth, setFilterMonth }) {
  return (
    <nav style={navStyle(darkMode)}>
      <div style={navLinksStyle}>
        <Link
          to="/"
          style={linkStyle(darkMode)}
          onMouseEnter={(e) => {
            e.target.style.border = `1px solid ${darkMode ? "#f1f1f1" : "#212529"}`;
            e.target.style.boxShadow = darkMode 
              ? "0 0 8px rgba(255,255,255,0.5)" 
              : "0 0 8px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.border = "none";
            e.target.style.boxShadow = "none";
          }}
        >
          Dashboard
        </Link>
        <Link
          to="/transactions"
          style={linkStyle(darkMode)}
          onMouseEnter={(e) => {
            e.target.style.border = `1px solid ${darkMode ? "#f1f1f1" : "#212529"}`;
            e.target.style.boxShadow = darkMode 
              ? "0 0 8px rgba(255,255,255,0.5)" 
              : "0 0 8px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.border = "none";
            e.target.style.boxShadow = "none";
          }}
        >
          Transactions
        </Link>
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{
            background: darkMode ? "#333" : "#fff",
            color: darkMode ? "#f1f1f1" : "#212529",
            border: "1px solid #888",
            borderRadius: "4px",
            padding: "4px",
            boxShadow: darkMode
              ? "0 2px 4px rgba(0,0,0,0.5)"
              : "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.border = `1px solid ${darkMode ? "#f1f1f1" : "#212529"}`;
            e.target.style.boxShadow = darkMode 
              ? "0 0 8px rgba(255,255,255,0.5)" 
              : "0 0 8px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.border = "1px solid #888";
            e.target.style.boxShadow = darkMode
              ? "0 2px 4px rgba(0,0,0,0.5)"
              : "0 2px 4px rgba(0,0,0,0.1)";
          }}
        />

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            background: "none",
            border: "1px solid #888",
            borderRadius: "6px",
            padding: "6px 12px",
            cursor: "pointer",
            color: darkMode ? "#f1f1f1" : "#212529",
            boxShadow: darkMode
              ? "0 2px 4px rgba(0,0,0,0.5)"
              : "0 2px 4px rgba(0,0,0,0.1)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.border = `1px solid ${darkMode ? "#f1f1f1" : "#212529"}`;
            e.target.style.boxShadow = darkMode 
              ? "0 0 8px rgba(255,255,255,0.5)" 
              : "0 0 8px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.border = "1px solid #888";
            e.target.style.boxShadow = darkMode
              ? "0 2px 4px rgba(0,0,0,0.5)"
              : "0 2px 4px rgba(0,0,0,0.1)";
          }}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
