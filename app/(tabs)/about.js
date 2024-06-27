import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { gsap } from 'gsap-rn';
import { Back, Power2 } from 'gsap';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../config/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import AppRatingComponent from '../(component)/appRating';
import { Animated } from 'react-native';

const About = () => {
  const imageRef = useRef(null);
  const barRef = useRef(null);
  const router = useRouter();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    // Animation for the image
    gsap.from(imageRef.current, {
      duration: 1,
      delay: 0.2,
      transform: { rotate: 360, scale: 0.5 },
      ease: Back.easeInOut,
    });

    // GSAP Timeline animations
    const timeline = gsap.timeline();
    timeline.set(barRef.current, { style: { width: "0%" } });
    timeline.to(barRef.current, { duration: 1, style: { width: "90%" }, ease: Power2.easeInOut });


  }, []);

  

  

  const handleRating = async (rating) => {
    try {
      const userId = auth.currentUser.uid;
      const ratingDocRef = doc(database, 'appRatings', userId);

      // Checking if rating is defined
      if (typeof rating !== 'undefined') {
        // creating new rating document for the user
        await setDoc(ratingDocRef, { rating });
      } else {
        console.error('Error updating rating: Rating is undefined');
      }
    } catch (error) {
      console.error('Error updating rating:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>About <Text style={{ fontStyle: 'italic', color: 'purple' }}>HearMe</Text></Text>
        <View ref={barRef} style={styles.bar} />
        <Text style={styles.description}>
          Welcome to HearMe, a platform where individuals can share their day-to-day experiences and life struggles, providing a space for self-expression and support.
        </Text>
        <Image ref={imageRef} style={styles.image} source={{ uri: 'https://img.freepik.com/free-vector/heart-puzzle-black-red_78370-4006.jpg?t=st=1710657631~exp=1710661231~hmac=61dd3c8a4d75f03427c4aaf5dc639feb54e3d4d0fdfe6951f90d0a667bab4b02&w=740' }} />


        <TouchableOpacity onPress={() => router.push('/video')}>
          <Text style={styles.subtitle}>
            <Ionicons name="logo-youtube" size={20} color="red" />
            {' '}Watch Our Intro Video
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/barchart')}>
          <Text style={styles.subtitle}>
            <Ionicons name="bar-chart-outline" size={20} color="navy" />
            {' '}Explore App Activity
          </Text>
        </TouchableOpacity>

        <AppRatingComponent userId={userId} onSubmitRating={handleRating} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 220,
    height: 200,
  },
  bar: {
    width: '0%',
    height: 5,
    backgroundColor: 'navy',
    marginVertical: 10,
  },
});

export default About;
