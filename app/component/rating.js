import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { database, auth } from '../../config/firebaseConfig'; // Import database
import { getDoc, doc, collection, getDocs } from 'firebase/firestore'; // Import Firestore functions

const RatingComponent = ({ postId, onSubmitRating }) => {
  const [rating, setRating] = useState(0); // Initial rating state

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const userId = auth.currentUser.uid;

        // Updated: Fetch user-specific rating from 'userRatings' subcollection
        const ratingDocRef = doc(database, 'ratings', postId, 'userRatings', userId);
        const ratingSnapshot = await getDoc(ratingDocRef);

        if (ratingSnapshot.exists()) {
          setRating(ratingSnapshot.data().rating);
        } else {
          setRating(0);
        }
      } catch (error) {
        console.error('Error fetching rating:', error.message);
      }
    };

    // Fetch user-specific rating on component mount
    fetchRating();
  }, [postId]);

  const handleRatingSelect = (newRating) => {
    setRating(newRating);
    onSubmitRating(postId, newRating); // Pass postId and rating to the callback
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rate this Post:</Text>
      <View style={styles.rating}>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <TouchableOpacity key={index} onPress={() => handleRatingSelect(index + 1)}>
              <Ionicons
                name={rating >= index + 1 ? 'star' : 'star-outline'}
                size={24}
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
    fontSize: 16,
    marginBottom: 10,
  },
  rating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RatingComponent;
