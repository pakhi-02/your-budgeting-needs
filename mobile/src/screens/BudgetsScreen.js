import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import {
  Alert,
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
import CategoryPicker from "../components/CategoryPicker";
import SwipeableRow from "../components/SwipeableRow";
import { getCategoryEmoji } from "../constants/categories";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

function fmt(v) {
  return "$" + Number(v || 0).toFixed(2);
}

export default function BudgetsScreen() {
  const { theme } = useTheme();
  const { budgets, loading, fetchAll, addBudget, removeBudget, getSpentForCategory } = useData();

  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [saving, setSaving] = useState(false);

  const onRefresh = useCallback(() => fetchAll(), [fetchAll]);

  async function handleSave() {
    if (!category || !limit) return;
    setSaving(true);
    try {
      await addBudget({ category, limit: parseFloat(limit) });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCategory("");
      setLimit("");
      setShowForm(false);
    } catch {
      Alert.alert("Error", "Failed to create budget");
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(id, name) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete Budget", `Remove the "${name}" budget?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeBudget(id),
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
          <Text style={[styles.heading, { color: theme.accentDark }]}>Your Budgets</Text>
          <Pressable
            style={[styles.addBtn, { backgroundColor: theme.accent }]}
            onPress={() => setShowForm((p) => !p)}
          >
            <Text style={styles.addBtnText}>{showForm ? "Cancel" : "+ Add"}</Text>
          </Pressable>
        </View>

        {showForm && (
          <View style={[styles.formCard, { backgroundColor: theme.surface }]}>
            <CategoryPicker value={category} onChange={setCategory} placeholder="Pick a category" />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="Budget limit ($)"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
              value={limit}
              onChangeText={setLimit}
            />
            <Pressable
              style={[styles.saveBtn, { backgroundColor: theme.accent, opacity: saving ? 0.6 : 1 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>{saving ? "Saving..." : "Save Budget"}</Text>
            </Pressable>
          </View>
        )}

        {budgets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No budgets yet!</Text>
            <Text style={[styles.emptyBody, { color: theme.textSecondary }]}>
              Create your first budget to start tracking spending.
            </Text>
          </View>
        ) : (
          budgets.map((b) => {
            const spent = getSpentForCategory(b.category);
            const pct = b.limit > 0 ? Math.min((spent / b.limit) * 100, 100) : 0;
            const over = spent > b.limit;

            return (
              <SwipeableRow key={b._id} onDelete={() => confirmDelete(b._id, b.category)}>
                <View style={[styles.budgetCard, { backgroundColor: theme.surface }]}>
                  <View style={styles.budgetTop}>
                    <Text style={[styles.budgetName, { color: theme.text }]}>
                      {getCategoryEmoji(b.category)} {b.category}
                    </Text>
                    <Text
                      style={[styles.budgetStatus, { color: over ? theme.danger : theme.income }]}
                    >
                      {over ? "⚠️ Over budget" : "✅ On track"}
                    </Text>
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: theme.surfaceAlt }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${pct}%`,
                          backgroundColor: over ? theme.danger : theme.accent,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.budgetAmounts, { color: theme.textSecondary }]}>
                    {fmt(spent)} spent of {fmt(b.limit)}
                  </Text>
                </View>
              </SwipeableRow>
            );
          })
        )}
      </ScrollView>
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  saveBtn: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  budgetCard: {
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  budgetTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetName: { fontSize: 16, fontWeight: "600" },
  budgetStatus: { fontSize: 12, fontWeight: "500" },
  progressTrack: { height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: 8, borderRadius: 4 },
  budgetAmounts: { fontSize: 13 },
  emptyState: { alignItems: "center", paddingVertical: 50 },
  emptyEmoji: { fontSize: 60, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  emptyBody: { fontSize: 14, textAlign: "center", paddingHorizontal: 30 },
});
