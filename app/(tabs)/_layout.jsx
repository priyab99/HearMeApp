import { Tabs } from 'expo-router';

export default () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="posts"
                options={{
                    tabBarLabel: 'Post',
                    headerTitle: "HearMe",

                }}
            />
              <Tabs.Screen
                name="addpost"
                options={{
                    tabBarLabel: 'Add Post',
                    headerTitle: "Add Post",

                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarLabel: 'Accout',
                    headerTitle: "My Account",

                }}
            />
          
        </Tabs>
    )
};