import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SwipeableRow({ children, onDelete }) {
  const { theme } = useTheme();
  const pan = useRef(new Animated.Value(0)).current;
  const startX = useRef(0);
  const opened = useRef(false);

  const THRESHOLD = -70;

  function onTouchStart(e) {
    startX.current = e.nativeEvent.pageX;
  }

  function onTouchMove(e) {
    const dx = e.nativeEvent.pageX - startX.current;
    if (dx < 0) {
      pan.setValue(Math.max(dx, THRESHOLD));
    } else if (opened.current) {
      pan.setValue(Math.min(THRESHOLD + dx, 0));
    }
  }

  function onTouchEnd() {
    const target = pan.__getValue() < THRESHOLD / 2 ? THRESHOLD : 0;
    opened.current = target !== 0;
    Animated.spring(pan, {
      toValue: target,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }

  return (
    <View style={styles.wrapper}>
      <View style={[styles.deleteZone, { backgroundColor: theme.danger }]}>
        <Pressable onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
      <Animated.View
        style={[styles.foreground, { transform: [{ translateX: pan }] }]}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
  },
  deleteZone: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  foreground: {
    zIndex: 1,
  },
});
