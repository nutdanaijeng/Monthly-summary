const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function getTransactions(month = "") {
  const url = month ? `${API_BASE_URL}/transactions?month=${month}` : `${API_BASE_URL}/transactions`;
  const res = await fetch(url);
  return res.json();
}

export async function addTransaction(data) {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTransaction(id) {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, { method: "DELETE" });
  return res.json();
}

export async function getMonthlySummary(month) {
  const res = await fetch(`${API_BASE_URL}/summary?month=${month}`);
  return res.json();
}
