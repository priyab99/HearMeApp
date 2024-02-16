import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import {Link} from "expo-router"
import { auth, database } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
const profile = () => {
    const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(database, 'users', auth.currentUser.uid));

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);
    
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {user ? (
        <>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Username: {user.username}</Text>
          {/* Display other user information as needed */}
        </>
      ) : (
        <Text>Loading user information...</Text>
      )}
            <Link href="/">Log Out</Link>
        </View>
    );
};

export default profile;