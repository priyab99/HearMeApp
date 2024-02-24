import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const YourComponent = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tabs>
        <Tabs.Screen
          name="posts"
          options={{
            tabBarLabel: 'Posts',
            headerTitle: 'HearMe',
            tabBarIcon: ({ color }) => (
              <Ionicons name="newspaper-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="addpost"
          options={{
            tabBarLabel: 'Add Post',
            headerTitle: "Add Post",
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={24} color={color} />
            ),
          }}
        />
         <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: 'My Account',
            headerTitle: "My Accout",
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={24} color={color} />
            ),
          }}
        />
         <Tabs.Screen
          name="about"
          options={{
            tabBarLabel: 'About HearMe',
            headerTitle: "About HearMe",
            tabBarIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

const styles = {
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    // Add more styles as needed
  },
};

export default YourComponent;
