import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="posts"
        options={{
          tabBarLabel: 'Posts',
          headerTitle: "HearMe",
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
          tabBarLabel: 'Profile',
          headerTitle: "My Account",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={24} color={color} />
          ),
        }}
      />
       <Tabs.Screen
          name="about"
          options={{
            tabBarLabel: 'About',
            headerTitle: 'About HearMe',
            tabBarIcon: ({ color }) => (
              <Ionicons name="information-circle-outline" size={24} color={color} />
            ),
          }}
        />
    </Tabs>
  );
};
