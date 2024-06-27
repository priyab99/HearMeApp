import React, { useEffect, useState } from 'react';
import { TextInput, Pressable, View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'
import { Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const handleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          if (user.emailVerified) {
            // Saving user ID in AsyncStorage upon successful login
            await AsyncStorage.setItem('userId', user.uid);
            console.log("Login success");
            router.replace('/posts');
          } else {
            Alert.alert("Email not verified", "Please verify your email before logging in.");
          }
        })
        .catch((err) => {
          Alert.alert("Login error", err.message);
        });
    }
  };

  // Checking AsyncStorage for user ID on app start
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          router.replace('/posts'); // Navigating to next screen if user ID exists
        }
      } catch (error) {
        // Handling AsyncStorage errors
        //console.error('Error fetching data from AsyncStorage:', error);

        Alert.alert('Error', 'An error occurred while fetching data. Please try again later.');
      }
    };
    checkLoginStatus();
  }, []); // Empty dependency array ensures this effect runs only once on component mount




  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.container}>
          <Ionicons name="heart-half-outline" size={60} color="navy"></Ionicons>
          <Text style={{ fontSize: 25, marginBottom: 30 }}>
            Login to <Text style={{ fontWeight: 'bold', color: 'purple', fontStyle: 'italic' }}>HearMe</Text>
          </Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={styles.input}
          />

          <Pressable
            onPress={handleLogin}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
          <Text style={styles.firstTimeText}>First time on <Text style={{ fontWeight: 'bold', fontStyle: 'italic', color: 'purple' }}>HearMe?</Text></Text>

          <Link href="/register" asChild>
            <Pressable>
              <Text style={styles.createAccountText}>Create Account</Text>
            </Pressable>
          </Link>
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
    marginTop: 80
  },
  scrollContainer: {


    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
    //backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 250,
  },
  loginButton: {
    height: 40,
    borderRadius: 10,
    backgroundColor: 'navy',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    marginBottom: 10,
    fontSize: 10
  },
  loginButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  firstTimeText: {
    marginBottom: 10,
    fontSize: 20,
    color: 'gray',
    marginTop: 45,

  },
  createAccountText: {
    color: 'navy',
    fontSize: 18,
  },
});

export default LoginPage;