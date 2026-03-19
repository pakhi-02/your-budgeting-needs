const DEFAULT_API_BASE_URL = "http://localhost:5001";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getBudgets: () => request("/api/budgets"),
  createBudget: (data) =>
    request("/api/budgets", { method: "POST", body: JSON.stringify(data) }),
  deleteBudget: (id) => request(`/api/budgets/${id}`, { method: "DELETE" }),

  getTransactions: () => request("/api/transactions"),
  createTransaction: (data) =>
    request("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteTransaction: (id) =>
    request(`/api/transactions/${id}`, { method: "DELETE" }),

  healthCheck: () => request("/api/health"),
};

export { API_BASE_URL };
