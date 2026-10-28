import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import TranslatorScreen from './src/screens/TranslatorScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import LanguagesScreen from './src/screens/LanguagesScreen';
import FeedbackButton from './src/components/FeedbackButton';
import { COLORS } from './src/components/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: COLORS.background, elevation: 0, shadowOpacity: 0, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
          headerTitleStyle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
          tabBarStyle: { backgroundColor: COLORS.background, borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingBottom: 4 },
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.textTertiary,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          tabBarIcon: ({ focused, color }) => {
            const icons = { Translate: '⇄', History: '📖', Languages: '🌍' };
            return <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>;
          },
        })}
      >
        <Tab.Screen name="Translate" component={TranslatorScreen} options={{ title: 'Lugha', headerRight: () => <FeedbackButton /> }} />
        <Tab.Screen name="History" component={HistoryScreen} />
        <Tab.Screen name="Languages" component={LanguagesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
