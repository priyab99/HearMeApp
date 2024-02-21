import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';


const About = () => {
  
 return (
    <View style={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.description}>
        HearMe app is a platform where one can share what are they going through their day to day life. The life-struggles they share is one way to express them.
      </Text>
      <WebView
            style={styles.videoContainer}
            javaScriptEnabled={true}
            source={{ uri: 'https://www.youtube.com/watch?v=yg8lwoGx_mM' }}
          />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  videoContainer: {
    height: 100, 
    width: 300,
  },
});

export default About;
