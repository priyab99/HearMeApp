import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { auth, database } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

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

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.text}>Name: {user.name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Username: {user.username}</Text>
          {locationError && <Text style={styles.error}>{locationError}</Text>}
          <MapView style={styles.map} region={mapRegion}>
            <Marker coordinate={mapRegion} title="My Location" />
          </MapView>
           </>
      ) : (
        <Text style={styles.loadingText}>Loading user information...</Text>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={() => router.push('/')}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 10,
    fontSize: 18,
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
 
  map: {
    width: '100%',
    height: 200,
  },
  error: {
    color: 'red',
  },
});

export default Profile;
