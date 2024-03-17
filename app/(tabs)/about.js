import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { gsap } from 'gsap-rn';
import { Back } from 'gsap';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const About = () => {
  const imageRef = useRef(null);
  const router=useRouter();
  

  useEffect(() => {
    // Animation for the title
    gsap.from(imageRef.current, {
      
      duration: 1,
      delay: 0.2,
      transform:{rotate:360, scale:0.5},
      ease: Back.easeInOut
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>About <Text style={{ fontStyle: 'italic', color: 'purple' }}>HearMe</Text></Text>
         <Text style={styles.description}>
          Welcome to HearMe, a platform where individuals can share their day-to-day experiences and life struggles, providing a space for self-expression and support.
        </Text>
        <Image ref={imageRef} style={styles.image} source={{uri: 'https://img.freepik.com/free-vector/heart-puzzle-black-red_78370-4006.jpg?t=st=1710657631~exp=1710661231~hmac=61dd3c8a4d75f03427c4aaf5dc639feb54e3d4d0fdfe6951f90d0a667bab4b02&w=740'}}></Image>
      
        <TouchableOpacity onPress={()=>router.push('/video')}>
          <Text style={styles.subtitle}>
            <Ionicons name="logo-youtube" size={20} color="red" />
            {' '}Watch Our Intro Video
          </Text>
        </TouchableOpacity>
       
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
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
 
  image:{
    width: 220,
    height:200
  }
});

export default About;
