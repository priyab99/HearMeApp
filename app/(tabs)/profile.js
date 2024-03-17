import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { auth, database } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 22.471571779563817,
    longitude: 91.7851043750746,
    latitudeDelta: 0.09,
    longitudeDelta: 0.04,
  });
  const [locationError, setLocationError] = useState(null);


   //fetching user related data
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

  //asking location permission from user
  const userLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.04,
      });
    } catch (error) {
      setLocationError(error.message);
    }
  };

  useEffect(() => {
    userLocation();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear userId from AsyncStorage
      await AsyncStorage.removeItem('userId');
      // Redirect to login screen
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <>
         <View style={styles.profileInfo}>
            <Text style={styles.title}>
              <Ionicons name="person" size={24} color="black" /> My Account
            </Text>
            <Text style={styles.text}>
              <Ionicons name="person-outline" size={20} color="gray" /> {user.name}
            </Text>
            <Text style={styles.text}>
              <Ionicons name="mail-outline" size={20} color="gray" /> {user.email}
            </Text>
            <Text style={styles.text}>
              <Ionicons name="at-outline" size={20} color="gray" /> Uername: {user.username}
            </Text>
            <TouchableOpacity onPress={()=>router.push('/weather')}>
                
          
                <Text style={styles.text}
                ><Ionicons name="cloud-outline" size={20} color="gray" />Weather</Text>
                   </TouchableOpacity>
            {locationError && <Text style={styles.error}>{locationError}</Text>}
          </View>
          <MapView style={styles.map} region={mapRegion}>
            <Marker coordinate={mapRegion} title="My Location" />
          </MapView>
         

        </>
        
      ) : (
        <Text style={styles.loadingText}>Loading user information...</Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    marginBottom: 10,
    fontSize: 20,
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'red',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    height: 200,
    marginBottom: 20,
  },
  error: {
    color: 'red',
  },
});

export default Profile;