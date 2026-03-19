import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { API_BASE_URL } from "../services/api";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { transactions } = useData();
  const [exporting, setExporting] = useState(false);

  async function exportCSV() {
    if (transactions.length === 0) {
      Alert.alert("Nothing to export", "Add some transactions first.");
      return;
    }

    setExporting(true);
    try {
      const headers = ["Date", "Category", "Type", "Amount", "Description"];
      const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.category || "",
        t.type || "",
        Number(t.amount || 0).toFixed(2),
        (t.description || "").replace(/,/g, " "),
      ]);

      const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
      const today = new Date().toISOString().split("T")[0];
      const fileUri = FileSystem.cacheDirectory + `budget-buddy-${today}.csv`;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      await Sharing.shareAsync(fileUri, {
        mimeType: "text/csv",
        dialogTitle: "Export Budget Buddy Transactions",
        UTI: "public.comma-separated-values-text",
      });
    } catch (e) {
      Alert.alert("Export failed", e.message || "Something went wrong.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.heading, { color: theme.accentDark }]}>Settings</Text>

      {/* Dark mode */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.row}>
          <View>
            <Text style={[styles.label, { color: theme.text }]}>
              {isDark ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </Text>
            <Text style={[styles.sublabel, { color: theme.textSecondary }]}>
              Toggle app appearance
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.surfaceAlt, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Export */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.accentDark }]}>Data</Text>
        <Text style={[styles.sublabel, { color: theme.textSecondary, marginBottom: 10 }]}>
          Export all {transactions.length} transaction{transactions.length !== 1 ? "s" : ""} as a CSV file.
        </Text>
        <Pressable
          style={[styles.exportBtn, { backgroundColor: theme.accent, opacity: exporting ? 0.6 : 1 }]}
          onPress={exportCSV}
          disabled={exporting}
        >
          <Text style={styles.exportBtnText}>
            {exporting ? "Preparing..." : "📥 Export to CSV"}
          </Text>
        </Pressable>
      </View>

      {/* Connection */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.accentDark }]}>Connection</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>API URL</Text>
          <Text style={[styles.infoValue, { color: theme.text }]} selectable>
            {API_BASE_URL}
          </Text>
        </View>
        <Text style={[styles.hint, { color: theme.textSecondary }]}>
          Change via EXPO_PUBLIC_API_URL in .env
        </Text>
      </View>

      {/* About */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.accentDark }]}>About</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>App</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>Budget Buddy Mobile</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Version</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>1.0.0</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Framework</Text>
          <Text style={[styles.infoValue, { color: theme.text }]}>Expo SDK 55 + React Native</Text>
        </View>

        <Pressable
          style={styles.linkRow}
          onPress={() => Linking.openURL("https://docs.expo.dev/")}
        >
          <Text style={[styles.linkText, { color: theme.accent }]}>Expo Documentation ↗</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 30, gap: 12 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  card: {
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 16, fontWeight: "600" },
  sublabel: { fontSize: 13, marginTop: 2 },
  exportBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  exportBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "500" },
  hint: { fontSize: 12, marginTop: 6, fontStyle: "italic" },
  linkRow: { marginTop: 12 },
  linkText: { fontSize: 14, fontWeight: "600" },
});
