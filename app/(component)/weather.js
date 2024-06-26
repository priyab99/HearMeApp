import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, Image, TextInput, Button, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

const WeatherScreen = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  // Fetching weather data function
  const fetchWeatherData = async () => {
    try {
      const apiKey = process.env.EXPO_OPEN_WEATHER_API_KEY;
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      const response = await axios.get(apiUrl); // Making GET request using axios
      const data = response.data; // Extracting data from response

      // Updating weather data state
      setWeatherData(data);
    } catch (error) {
      // Handling errors
      Alert.alert('Error', 'Failed to fetch weather data');
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    <ScrollView  contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
         <Stack.Screen options={{ headerTitle: `Weather` }} />
      <TextInput
        style={styles.input}
        placeholder="Enter your city name"
        value={city}
        onChangeText={(text) => setCity(text)}
      />
      {weatherData ? null : (
        <TouchableOpacity style={styles.weatherButton} onPress={fetchWeatherData}>
           <Text style={styles.weatherText}>Weather</Text>
          
        </TouchableOpacity>
       
      )}

      {weatherData ? (
        <>
          <Text style={styles.title}>Current Weather in {weatherData.name}</Text>
          <Text style={styles.text}>Temperature: {weatherData.main.temp}°C</Text>
          <Text style={styles.text}>
            Weather: {weatherData.weather[0].description}
          </Text>
          <Image
            style={styles.weatherIcon}
            source={{
              uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
            }}
          />
        </>
      ) : (
        <Text>Enter your city and click "Get Weather"</Text>
      )}
    </View>
    </ScrollView>
    
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50
  },
  scrollContainer: {


    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
    //backgroundColor: '#fff',
  },
  input: {
    textAlign: 'center',
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherButton:{
    height: 40,
    borderRadius: 10,
    backgroundColor: 'navy',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    marginBottom: 10,
    fontSize: 10
  },
  weatherText:{
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
  
});

export default WeatherScreen;