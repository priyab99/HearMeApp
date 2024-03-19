import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { database, auth } from '../../config/firebaseConfig'; 
import { getDoc, doc, setDoc } from 'firebase/firestore'; 

const AppRatingComponent = () => {
  const [rating, setRating] = useState(0); // Initial rating state

  useEffect(() => {
    const fetchAppRating = async () => {
      try {
        const userId = auth.currentUser.uid;

        // Fetching user-specific rating from 'appRatings' collection
        const ratingDocRef = doc(database, 'appRatings', userId);
        const ratingSnapshot = await getDoc(ratingDocRef);

        if (ratingSnapshot.exists()) {
          setRating(ratingSnapshot.data().rating);
        } else {
          setRating(0);
        }
      } catch (error) {
        console.error('Error fetching app rating:', error.message);
      }
    };

    // Fetching user-specific app rating on component mount
    fetchAppRating();
  }, []);

  const handleRatingSelect = async (newRating) => {
    setRating(newRating);
    try {
      const userId = auth.currentUser.uid;
      const ratingDocRef = doc(database, 'appRatings', userId);

      // Setting or updating the user-specific app rating
      await setDoc(ratingDocRef, { rating: newRating });
    } catch (error) {
      console.error('Error updating app rating:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rate the App</Text>
      <View style={styles.rating}>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleRatingSelect(index + 1)}>
              <Ionicons
                name={rating >= index + 1 ? 'star' : 'star-outline'}
                size={26}
                color="gold"
              />
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AppRatingComponent;
