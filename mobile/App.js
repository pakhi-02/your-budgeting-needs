import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";

import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { DataProvider } from "./src/context/DataContext";
import DashboardScreen from "./src/screens/DashboardScreen";
import BudgetsScreen from "./src/screens/BudgetsScreen";
import TransactionsScreen from "./src/screens/TransactionsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Dashboard: "📊",
  Budgets: "💰",
  Transactions: "💳",
  Settings: "⚙️",
};

function TabIcon({ name, focused, color }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.6 }}>
      {TAB_ICONS[name]}
    </Text>
  );
}

function AppNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => (
              <TabIcon name={route.name} focused={focused} color={color} />
            ),
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.textSecondary,
            tabBarStyle: {
              backgroundColor: theme.surface,
              borderTopColor: theme.border,
              paddingBottom: 4,
              height: 56,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "600",
            },
            headerStyle: {
              backgroundColor: theme.surface,
              shadowColor: "transparent",
              elevation: 0,
            },
            headerTintColor: theme.accentDark,
            headerTitleStyle: {
              fontWeight: "700",
              fontSize: 18,
            },
          })}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: "Budget Buddy" }}
          />
          <Tab.Screen name="Budgets" component={BudgetsScreen} />
          <Tab.Screen name="Transactions" component={TransactionsScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppNavigator />
      </DataProvider>
    </ThemeProvider>
  );
}
