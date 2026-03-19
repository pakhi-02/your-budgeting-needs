import { useCallback } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { CHART_COLORS, getCategoryEmoji } from "../constants/categories";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

function formatCurrency(v) {
  return "$" + Number(v || 0).toFixed(2);
}

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { transactions, budgets, totals, loading, error, fetchAll, getSpentForCategory } = useData();

  const onRefresh = useCallback(() => {
    fetchAll();
  }, [fetchAll]);

  const chartData = (() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount || 0);
      });
    return Object.entries(map).map(([name, amount], i) => ({
      name,
      amount,
      color: CHART_COLORS[i % CHART_COLORS.length],
      legendFontColor: theme.textSecondary,
      legendFontSize: 12,
    }));
  })();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor={theme.accent} />
      }
    >
      {error ? (
        <View style={[styles.errorBanner, { backgroundColor: theme.dangerBg }]}>
          <Text style={{ color: theme.danger }}>{error}</Text>
        </View>
      ) : null}

      {/* Overview cards */}
      <View style={styles.overviewRow}>
        <View style={[styles.statCard, { backgroundColor: "#e6ffed" }]}>
          <Text style={styles.statLabel}>Income</Text>
          <Text style={[styles.statValue, { color: "#38a169" }]}>
            {formatCurrency(totals.totalIncome)}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#ffe8ef" }]}>
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={[styles.statValue, { color: "#e53e3e" }]}>
            {formatCurrency(totals.totalExpense)}
          </Text>
        </View>
      </View>

      <View style={styles.overviewRow}>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={[styles.statValue, { color: theme.accentDark }]}>
            {formatCurrency(totals.balance)}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Text style={styles.statLabel}>Budgeted</Text>
          <Text style={[styles.statValue, { color: theme.accentDark }]}>
            {formatCurrency(totals.budgeted)}
          </Text>
        </View>
      </View>

      {/* Pie chart */}
      {chartData.length > 0 && (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.accentDark }]}>
            Spending Breakdown
          </Text>
          <PieChart
            data={chartData}
            width={SCREEN_WIDTH - 48}
            height={200}
            chartConfig={{
              color: () => theme.accent,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            hasLegend
          />
        </View>
      )}

      {/* Budget progress */}
      {budgets.length > 0 && (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.accentDark }]}>
            Budget Progress
          </Text>
          {budgets.map((b) => {
            const spent = getSpentForCategory(b.category);
            const pct = b.limit > 0 ? Math.min((spent / b.limit) * 100, 100) : 0;
            const over = spent > b.limit;
            return (
              <View key={b._id} style={styles.progressItem}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: theme.text }]}>
                    {getCategoryEmoji(b.category)} {b.category}
                  </Text>
                  <Text style={[styles.progressAmount, { color: over ? theme.danger : theme.textSecondary }]}>
                    {formatCurrency(spent)} / {formatCurrency(b.limit)}{" "}
                    {over ? "⚠️" : "✅"}
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
              </View>
            );
          })}
        </View>
      )}

      {/* Recent transactions */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.accentDark }]}>
          Recent Transactions
        </Text>
        {transactions.length === 0 ? (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            No transactions yet
          </Text>
        ) : (
          transactions.slice(0, 8).map((t) => (
            <View key={t._id} style={[styles.txRow, { borderBottomColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.txCategory, { color: theme.text }]}>
                  {getCategoryEmoji(t.category)} {t.category}
                </Text>
                {t.description ? (
                  <Text style={[styles.txDesc, { color: theme.textSecondary }]} numberOfLines={1}>
                    {t.description}
                  </Text>
                ) : null}
              </View>
              <Text
                style={[
                  styles.txAmount,
                  { color: t.type === "income" ? theme.income : theme.expense },
                ]}
              >
                {t.type === "income" ? "+" : "-"}
                {formatCurrency(t.amount)}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30, gap: 12 },
  errorBanner: { padding: 10, borderRadius: 10 },
  overviewRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statLabel: { fontSize: 13, fontWeight: "500", color: "#6b5f7a", marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "700" },
  card: {
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  progressItem: { marginBottom: 14 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: { fontSize: 14, fontWeight: "500" },
  progressAmount: { fontSize: 12 },
  progressTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 4 },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  txCategory: { fontSize: 15, fontWeight: "500" },
  txDesc: { fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: "700" },
  empty: { textAlign: "center", paddingVertical: 20, fontSize: 14 },
});
