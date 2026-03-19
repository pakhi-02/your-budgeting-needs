import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CATEGORY_LIST } from "../constants/categories";
import { useTheme } from "../context/ThemeContext";

export default function CategoryPicker({ value, onChange, placeholder }) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = search
    ? CATEGORY_LIST.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    : CATEGORY_LIST;

  function select(name) {
    onChange(name);
    setVisible(false);
    setSearch("");
  }

  return (
    <>
      <Pressable
        style={[styles.trigger, { backgroundColor: theme.inputBg, borderColor: theme.border }]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.triggerText, { color: value ? theme.text : theme.textSecondary }]}>
          {value || placeholder || "Select category"}
        </Text>
      </Pressable>

      <Modal visible={visible} animationType="slide" transparent>
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />
            <Text style={[styles.sheetTitle, { color: theme.text }]}>Pick a Category</Text>

            <TextInput
              style={[styles.searchInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="Search categories..."
              placeholderTextColor={theme.textSecondary}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.name}
              numColumns={3}
              contentContainerStyle={styles.grid}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.option,
                    { backgroundColor: value === item.name ? theme.accent + "30" : theme.surfaceAlt },
                  ]}
                  onPress={() => select(item.name)}
                >
                  <Text style={styles.emoji}>{item.emoji}</Text>
                  <Text style={[styles.optionLabel, { color: theme.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={[styles.empty, { color: theme.textSecondary }]}>
                  No categories match "{search}"
                </Text>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  triggerText: {
    fontSize: 16,
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: "70%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  searchInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  grid: {
    paddingBottom: 10,
  },
  option: {
    flex: 1,
    alignItems: "center",
    margin: 4,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: "31%",
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
