import React from "react";
import { Link } from "react-router-dom";

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  borderBottom: "1px solid #444",
  marginBottom: "20px",
};

const navLinksStyle = {
  display: "flex",
  gap: "20px",
  fontSize: "1.1rem",
};

const linkStyle = (isDark) => ({
  color: isDark ? "#f1f1f1" : "#212529",
  textDecoration: "none",
  fontWeight: "bold",
});

export default function Navigation({ darkMode, setDarkMode, filterMonth, setFilterMonth }) {
  return (
    <nav style={navStyle}>
      <div style={navLinksStyle}>
        <Link to="/" style={linkStyle(darkMode)}>
          Dashboard
        </Link>
        <Link to="/transactions" style={linkStyle(darkMode)}>
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
          }}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </nav>
  );
}
