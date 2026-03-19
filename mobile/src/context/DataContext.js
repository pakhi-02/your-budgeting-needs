import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    setError("");
    try {
      const [b, t] = await Promise.all([
        api.getBudgets(),
        api.getTransactions(),
      ]);
      setBudgets(Array.isArray(b) ? b : []);
      setTransactions(Array.isArray(t) ? t : []);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addBudget = useCallback(
    async (data) => {
      await api.createBudget(data);
      await fetchAll();
    },
    [fetchAll]
  );

  const removeBudget = useCallback(
    async (id) => {
      await api.deleteBudget(id);
      await fetchAll();
    },
    [fetchAll]
  );

  const addTransaction = useCallback(
    async (data) => {
      await api.createTransaction(data);
      await fetchAll();
    },
    [fetchAll]
  );

  const removeTransaction = useCallback(
    async (id) => {
      await api.deleteTransaction(id);
      await fetchAll();
    },
    [fetchAll]
  );

  const totals = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount || 0), 0);
    const budgeted = budgets.reduce((s, b) => s + Number(b.limit || 0), 0);
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense, budgeted };
  }, [budgets, transactions]);

  const getSpentForCategory = useCallback(
    (category) =>
      transactions
        .filter((t) => t.category === category && t.type === "expense")
        .reduce((s, t) => s + Number(t.amount || 0), 0),
    [transactions]
  );

  const value = useMemo(
    () => ({
      budgets,
      transactions,
      loading,
      error,
      totals,
      fetchAll,
      addBudget,
      removeBudget,
      addTransaction,
      removeTransaction,
      getSpentForCategory,
    }),
    [
      budgets,
      transactions,
      loading,
      error,
      totals,
      fetchAll,
      addBudget,
      removeBudget,
      addTransaction,
      removeTransaction,
      getSpentForCategory,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
