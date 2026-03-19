import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import CategoryPicker from "../components/CategoryPicker";
import SwipeableRow from "../components/SwipeableRow";
import { getCategoryEmoji } from "../constants/categories";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

function fmt(v) {
  return "$" + Number(v || 0).toFixed(2);
}

export default function TransactionsScreen() {
  const { theme } = useTheme();
  const { transactions, loading, fetchAll, addTransaction, removeTransaction } = useData();

  const confettiRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = !search || t.category?.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || t.type === filter;
      return matchSearch && matchFilter;
    });
  }, [transactions, search, filter]);

  const onRefresh = useCallback(() => fetchAll(), [fetchAll]);

  async function handleSave() {
    if (!category || !amount) return;
    setSaving(true);
    try {
      const wasIncome = type === "income";
      await addTransaction({
        category,
        amount: parseFloat(amount),
        type,
        description: description.trim() || undefined,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (wasIncome && confettiRef.current) {
        confettiRef.current.start();
      }
      setCategory("");
      setAmount("");
      setDescription("");
      setType("expense");
      setShowForm(false);
    } catch {
      Alert.alert("Error", "Failed to add transaction");
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(id) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete Transaction", "Remove this transaction?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeTransaction(id),
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.bg }]}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={theme.accent} />
        }
      >
        <View style={styles.headerRow}>
          <Text style={[styles.heading, { color: theme.accentDark }]}>Transactions</Text>
          <Pressable
            style={[styles.addBtn, { backgroundColor: theme.accent }]}
            onPress={() => setShowForm((p) => !p)}
          >
            <Text style={styles.addBtnText}>{showForm ? "Cancel" : "+ Add"}</Text>
          </Pressable>
        </View>

        {showForm && (
          <View style={[styles.formCard, { backgroundColor: theme.surface }]}>
            {/* type toggle */}
            <View style={styles.toggleRow}>
              <Pressable
                style={[
                  styles.toggleBtn,
                  {
                    backgroundColor: type === "expense" ? "#ffe8ef" : theme.surfaceAlt,
                  },
                ]}
                onPress={() => setType("expense")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: type === "expense" ? theme.expense : theme.textSecondary },
                  ]}
                >
                  💸 Expense
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.toggleBtn,
                  {
                    backgroundColor: type === "income" ? "#e6ffed" : theme.surfaceAlt,
                  },
                ]}
                onPress={() => setType("income")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: type === "income" ? theme.income : theme.textSecondary },
                  ]}
                >
                  💰 Income
                </Text>
              </Pressable>
            </View>

            <CategoryPicker value={category} onChange={setCategory} placeholder="Pick a category" />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="Amount ($)"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="Description (optional)"
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={setDescription}
            />
            <Pressable
              style={[styles.saveBtn, { backgroundColor: theme.accent, opacity: saving ? 0.6 : 1 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save Transaction"}</Text>
            </Pressable>
          </View>
        )}

        {/* Search & filter */}
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          placeholder="Search by category..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filterRow}>
          {["all", "income", "expense"].map((f) => (
            <Pressable
              key={f}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: filter === f ? theme.accent : theme.surfaceAlt,
                },
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === f ? "#fff" : theme.textSecondary },
                ]}
              >
                {f === "all" ? "All" : f === "income" ? "💰 Income" : "💸 Expense"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Transaction list */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💳</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {search ? "No matches found" : "No transactions yet!"}
            </Text>
            <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>
              {search ? "Try a different search term" : "Add your first transaction to get started."}
            </Text>
          </View>
        ) : (
          filtered.map((t) => (
            <SwipeableRow key={t._id} onDelete={() => confirmDelete(t._id)}>
              <View style={[styles.txCard, { backgroundColor: theme.surface }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.txCategory, { color: theme.text }]}>
                    {getCategoryEmoji(t.category)} {t.category}
                  </Text>
                  {t.description ? (
                    <Text style={[styles.txDesc, { color: theme.textSecondary }]} numberOfLines={1}>
                      {t.description}
                    </Text>
                  ) : null}
                  <Text style={[styles.txDate, { color: theme.textSecondary }]}>
                    {new Date(t.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: t.type === "income" ? theme.income : theme.expense },
                  ]}
                >
                  {t.type === "income" ? "+" : "-"}
                  {fmt(t.amount)}
                </Text>
              </View>
            </SwipeableRow>
          ))
        )}
      </ScrollView>
      <ConfettiCannon
        ref={confettiRef}
        count={150}
        origin={{ x: SCREEN_WIDTH / 2, y: -20 }}
        fadeOut
        autoStart={false}
        fallSpeed={2500}
        colors={["#FF6B9D", "#C471ED", "#12C2E9", "#4FD1C5", "#F6AD55", "#FFD700"]}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30, gap: 10 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  heading: { fontSize: 22, fontWeight: "700" },
  addBtn: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  formCard: {
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  toggleRow: { flexDirection: "row", gap: 8 },
  toggleBtn: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  toggleText: { fontWeight: "600", fontSize: 15 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveBtn: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  filterRow: { flexDirection: "row", gap: 8 },
  filterBtn: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: "center" },
  filterText: { fontWeight: "600", fontSize: 13 },
  txCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  txCategory: { fontSize: 15, fontWeight: "600" },
  txDesc: { fontSize: 12, marginTop: 2 },
  txDate: { fontSize: 11, marginTop: 3 },
  txAmount: { fontSize: 17, fontWeight: "700", marginLeft: 10 },
  emptyState: { alignItems: "center", paddingVertical: 50 },
  emptyEmoji: { fontSize: 60, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  emptyBody: { fontSize: 14, textAlign: "center", paddingHorizontal: 30 },
});
