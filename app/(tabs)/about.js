import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import WebView from 'react-native-webview';

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>About HearMe</Text>
        <Text style={styles.description}>
          Welcome to HearMe, a platform where individuals can share their day-to-day experiences and life struggles, providing a space for self-expression and support.
        </Text>
        <Text style={styles.subtitle}>Our Mission</Text>
        <Text style={styles.description}>
          Our mission is to create a community where people feel heard and supported, fostering connections and empathy.
        </Text>
        <Text style={styles.subtitle}>How It Works</Text>
        <Text style={styles.description}>
          Share your thoughts, struggles, or inspirational moments through posts. Connect with others by engaging in conversations and providing support.
        </Text>
        <Text style={styles.subtitle}>Watch Our Intro Video</Text>
        <WebView
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
