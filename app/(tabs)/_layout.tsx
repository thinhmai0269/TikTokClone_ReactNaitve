import { router, Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

export default function TabLayout() {


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#49AA75FF',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "home-sharp" : "home-outline"} size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "people" : "people-outline"} size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="empty"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () =>
            <View className="absolute bottom-2">
              <Ionicons name="add-circle" size={60} color="black" />
            </View>
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/camera')
          }
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"} size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={24} color="black" />
        }}
      />
    </Tabs>
  );
}
