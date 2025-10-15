const API_BASE_URL = "http://127.0.0.1:5000/api";

// Helper function to handle API responses
async function handleResponse(res) {
  // UPDATED: Check if the response status is not OK (e.g., 404, 500)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export async function getTransactions(month = "") {
  const url = month ? `${API_BASE_URL}/transactions?month=${month}` : `${API_BASE_URL}/transactions`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function addTransaction(data) {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// NEW: Function to update a transaction
export async function updateTransaction(id, data) {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteTransaction(id) {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function getMonthlySummary(month) {
  const res = await fetch(`${API_BASE_URL}/summary?month=${month}`);
  return handleResponse(res);
}