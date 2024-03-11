import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, Alert } from 'react-native';

const WeatherScreen = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  // Fetching weather data function
  const fetchWeatherData = async () => {
    const apiKey = process.env.EXPO_OPEN_WEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok) {
        // Updating the weather data state
        setWeatherData(data);
      } else {
        // Handling error response
        const errorMessage = data.message || 'City not found';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      // Handling network or other unexpected errors
      console.error('Error fetching weather data:', error.message);
    }
  };

  return (
    <View style={styles.container}>
         <Stack.Screen options={{ headerTitle: `Weather` }} />
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={(text) => setCity(text)}
      />
      {weatherData ? null : (
        <Button title="Get Weather" onPress={fetchWeatherData} />
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
        <Text>Enter a city and click "Get Weather"</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default WeatherScreen;
