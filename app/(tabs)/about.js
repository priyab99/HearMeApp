import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import WebView from 'react-native-webview';
import { gsap } from 'gsap-rn';
import { Back } from 'gsap';

const About = () => {
  const titleRef = useRef(null);
  const missionRef = useRef(null);
  const descriptionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Animation for the title
    gsap.from(titleRef.current, {
      opacity: 0,
      y: -20,
      duration: 1,
      delay: 0.2,
      transform:{rotate:80, scale:0.5},
      ease: Back.easeInOut
    });

    // Animation for the mission subtitle
    gsap.from(missionRef.current, {
      opacity: 0,
      y: -20,
      duration: 1,
      delay: 0.4,
      transform:{rotate:80, scale:0.5},
    });

    // Animation for the description text
    gsap.from(descriptionRef.current, {
      opacity: 0,
      y: -20,
      duration: 1,
      delay: 0.6,
      transform:{rotate:60, scale:0.5},
    });

    // Animation for the video container
    gsap.from(videoRef.current, {
      opacity: 0,
      duration: 1,
      delay: 0.8,
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text ref={titleRef} style={styles.title}>About <Text style={{ fontStyle: 'italic', color: 'purple' }}>HearMe</Text></Text>
         <Text style={styles.description}>
          Welcome to HearMe, a platform where individuals can share their day-to-day experiences and life struggles, providing a space for self-expression and support.
        </Text>
        <Text ref={missionRef} style={styles.subtitle}>Our Mission</Text>
        <Text ref={descriptionRef} style={styles.description}>
           Our mission is to create a community where people feel heard and supported.
        </Text>
        <Text ref={descriptionRef} style={styles.subtitle}>How It Works</Text>
        <Text style={styles.description}>
          Share your thoughts, struggles, or inspirational moments through posts. Connect with others by engaging in conversations and providing support.
        </Text>
        <Text style={styles.subtitle}>Watch Our Intro Video</Text>
        <WebView
          ref={videoRef}
          style={styles.videoContainer}
          javaScriptEnabled={true}
          source={{ uri: 'https://www.youtube.com/watch?v=yg8lwoGx_mM' }}
        />
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
  videoContainer: {
    height: 200,
    width: 280,
    marginTop: 15,
  },
});

export default About;
